import { NextFunction, Request, Response } from "express";
import mongoose, { ObjectId, Types } from "mongoose";
import sendApiResponse from "../../utils/sendApiResponse";
import Period from "./period.model";
import { DayType, IPeriod, PeriodType } from "./period.types";
import ClassSubject from "../classSubjects/classSubject.model";
import { IClassSubject } from "../classSubjects/classSubject.types";
import { IClass } from "../class/class.types";
import Class from "../class/class.model";
import { daysList, periodsList } from "./period.constants";
import { createRemark } from "../remarks/remarks.controller";
import { ISubject } from "../subject/subject.types";
// Sort subjects by noOfHours, with a random tie-breaker

const findBestSubjectForSlot = (
    classSubjects: IClassSubject[],
    assignedHoursMap: Map<string, number>,
    day: DayType,
    assignedSubjectsToday: Set<string>
): IClassSubject | null => {
    // Filter for subjects that still need hours and haven't been assigned today.
    const suitableSubjects = classSubjects.filter(sub => {
        const assignedCount = assignedHoursMap.get(sub._id.toString()) || 0;

        // Exclude subjects that have been assigned on the current day if they need more than one hour.
        const isAssignedToday = assignedSubjectsToday.has(`${day}-${sub._id.toString()}`);
        if (sub.noOfHours <= 5 && isAssignedToday) {
            return false;
        }

        if (assignedCount >= sub.noOfHours) {
            return false;
        }
        return true;
    }).sort((a, b) => {
        const remainingCountA = a.noOfHours - (assignedHoursMap.get(a._id.toString()) || 0);
        const remainingCountB = b.noOfHours - (assignedHoursMap.get(b._id.toString()) || 0);
        return remainingCountB - remainingCountA
    });

    // If no suitable subjects, return null.
    if (suitableSubjects.length === 0) {
        return null;
    }

    // Find the subject with the most remaining hours (the first element after sorting).
    const maxRemainingHours = suitableSubjects[0].noOfHours - (assignedHoursMap.get(suitableSubjects[0]._id.toString()) || 0);

    // Filter for all subjects that have this maximum number of remaining hours.
    const topSubjects = suitableSubjects.filter(sub => {
        const remainingHours = sub.noOfHours - (assignedHoursMap.get(sub._id.toString()) || 0);
        return remainingHours === maxRemainingHours;
    });

    // Return a random subject from the top-tier subjects.
    return topSubjects[Math.floor(Math.random() * topSubjects.length)];
};

/**
 * Generates the timetable for a given timetableId by assigning all subjects to available slots.
 */
export const createPeriods = async (timetableId: string | Types.ObjectId) => {
    try {
        await Period.deleteMany({ timetableId });
        const classes: IClass[] = await Class.find({});

        for (const clz of classes) {
            console.log(`Starting timetable generation for class: ${clz.name}`);

            const classSubjects: IClassSubject[] = await ClassSubject.find({ class: clz._id })
                .populate('teacher')
                .populate('class')
                .populate('subject');

            const assignedHoursMap = new Map<string, number>(
                classSubjects.map(s => [s._id.toString(), 0])
            );

            // In-memory conflict trackers to avoid repeated DB queries.
            const timetableSlots = new Set<string>(); // Tracks occupied slots: 'Monday-1'
            const teacherAssignments = new Map<string, string>(); // Tracks teacher assignments: 'Monday-1-teacherId'

            const dayAssignments = new Set<string>();
            for (const clzSub of classSubjects) {
                const assignedCount = assignedHoursMap.get(clzSub._id.toString()) || 0;
                // Track which subjects have been assigned today to enforce the once-per-day rule.

                for (const pref of clzSub.preferences) {
                    if (pref.preference === 1) {
                        const slotKey = `${pref.day}-${pref.period}`;
                        const teacherId = clzSub.teacher._id.toString();

                        // Check for all conflicts before assigning.
                        if (
                            !timetableSlots.has(slotKey) &&
                            !teacherAssignments.has(`${slotKey}-${teacherId}`) &&
                            !dayAssignments.has(`${pref.day}-${clzSub._id}`) &&
                            assignedCount < clzSub.noOfHours
                        ) {
                            await new Period({
                                timetableId: timetableId,
                                classSubject: clzSub._id,
                                teacher: clzSub.teacher,
                                class: clzSub.class,
                                day: pref.day,
                                period: pref.period,
                                _id: new mongoose.Types.ObjectId(),
                            }).save();

                            timetableSlots.add(slotKey);
                            teacherAssignments.set(`${slotKey}-${teacherId}`, teacherId);
                            assignedHoursMap.set(clzSub._id.toString(), (assignedCount || 0) + 1);
                            dayAssignments.add(`${pref.day}-${clzSub._id}`);
                            createRemark(timetableId, clzSub._id, `Assigned preferred slot at ${pref.day} ${pref.period}.`, 1);
                        }
                    }
                }
            }

            // 2. Fill remaining slots with non-preferred subjects.
            for (const day of daysList) {
                // A new set for each day to reset the "once-per-day" check.
                for (const period of periodsList) {
                    const slotKey = `${day}-${period}`;
                    if (timetableSlots.has(slotKey)) {
                        continue;
                    }

                    let bestSubject = findBestSubjectForSlot(classSubjects, assignedHoursMap, day, dayAssignments);

                    if (bestSubject) {
                        const teacherId = bestSubject.teacher._id.toString();
                        const hasTeacherConflict = teacherAssignments.has(`${slotKey}-${teacherId}`);

                        if (!hasTeacherConflict) {
                            await new Period({
                                timetableId: timetableId,
                                classSubject: bestSubject._id,
                                teacher: bestSubject.teacher,
                                class: bestSubject.class,
                                day: day,
                                period: period,
                                _id: new mongoose.Types.ObjectId(),
                            }).save();

                            assignedHoursMap.set(bestSubject._id.toString(), (assignedHoursMap.get(bestSubject._id.toString()) || 0) + 1);
                            timetableSlots.add(slotKey);
                            teacherAssignments.set(`${slotKey}-${teacherId}`, teacherId);
                            dayAssignments.add(`${day}-${bestSubject._id}`);

                            createRemark(timetableId, bestSubject._id, `Assigned to slot ${day} ${period}.`, 1);
                        } else {
                            // Teacher conflict found; move to the next period.
                            console.log(`Teacher conflict for slot ${slotKey}. Skipping.`);
                        }
                    } else {
                        console.log(`No suitable subject found for slot ${slotKey}.`);
                    }
                }
            }
        }
        console.log("Timetable generation completed successfully.");
    } catch (error: any) {
        const errorMessage = `Error during timetable creation: ${error.message}`;
        console.error(errorMessage, error);
        throw new Error(errorMessage);
    }
};

export const getPeriods = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const _data = await Period.find({ timetableId: req.query.timetableId })

        const data: IPeriod[] = _data.map((per) => {

            return {
                ...per.toObject(),  // Convert mongoose document to a plain object

            };
        });

        sendApiResponse(res, 'OK', data, 'Successfully fetched list of Periods');
    } catch (error) {
        next(error);
    }
}

export const getPeriodByIdReq = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data: IPeriod = await getPeriodById(req.params.id);
        sendApiResponse(res, 'OK', data, 'Successfully fetched class');
    } catch (error) {
        if ((error as any).message === 'PeriodNotFound') {
            sendApiResponse(res, 'NOT FOUND', null, 'Period Not Found');
        } else {
            next(error); // Pass the error to the error-handling middleware for unexpected errors
        }
    }
};
export const getPeriodById = async (id: string | Types.ObjectId): Promise<IPeriod> => {
    const _data = await Period.findById(id)
        .sort({ 'name': 1 });

    if (!_data) {
        throw new Error('PeriodNotFound'); // Throw an error if the class is not found
    }

    const data: IPeriod = {
        ..._data.toObject(),

    };

    return data; // Return the data to the controller function
};


export const updatePeriod = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const _updatedPeriod = req.body;
        const prevPeriod = await Period.findById(req.params.id)
        // .populate('logo').populate('manager.img');
        if (!prevPeriod) {
            return sendApiResponse(res, 'NOT FOUND', null, 'Period Not Found');
        }


        const updatedPeriod = await Period.findByIdAndUpdate(req.params.id, _updatedPeriod);
        if (!updatedPeriod) {
            return sendApiResponse(res, 'CONFLICT', null, 'Period Not Updated');
        }

        sendApiResponse(res, 'OK', _updatedPeriod,
            `Period updated successfully`);
    } catch (error) {
        next(error);
    }
}

