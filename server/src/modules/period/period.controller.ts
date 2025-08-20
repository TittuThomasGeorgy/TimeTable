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
const sortClassSubjects = (classSubjects: IClassSubject[]) => {
    return classSubjects.sort((a, b) => {
        if (b.preferences.length - a.preferences.length == 0) {
            const hoursDiff = b.noOfHours - a.noOfHours;
            if (hoursDiff !== 0) {
                return hoursDiff;
            }
            return Math.random() - 0.5;
        }
        return b.preferences.length - a.preferences.length
    });
};

// Finds the first available slot for a given subject

// New helper function to find the best subject for a given slot
const findBestSubjectForSlot = (
    classSubjects: IClassSubject[],
    assignedHoursMap: Map<string, number>,
    day: DayType,
    period: PeriodType,
) => {
    // Filter for subjects that still need hours and don't have conflicts
    const suitableSubjects = classSubjects.filter(sub => {
        const assignedCount = assignedHoursMap.get(sub._id.toString()) || 0;
        if (assignedCount >= sub.noOfHours) {
            return false;
        }

        const isNotPreferred = sub.preferences.find(pref => pref.day === day && pref.period === period)?.preference === -1;
        if (isNotPreferred) {
            return false;
        }
        return true;
    });

    // Prioritize subjects with a preferred slot for this time
    const preferredSubjects = suitableSubjects.filter(sub =>
        sub.preferences.some(pref => pref.day === day && pref.period === period && pref.preference === 1)
    );

    if (preferredSubjects.length > 0) {
        return preferredSubjects[Math.floor(Math.random() * preferredSubjects.length)];
    }

    // If no preferred subjects, return a random suitable subject
    if (suitableSubjects.length > 0) {
        return suitableSubjects[Math.floor(Math.random() * suitableSubjects.length)];
    }

    return null;
};

export const createPeriods = async (timetableId: string | Types.ObjectId) => {
    try {
        await Period.deleteMany({ timetableId });
        const classes: IClass[] = await Class.find({});

        for (const clz of classes) {
            console.log(`Starting timetable generation for class: ${clz.name}`);

            const classSubjects: IClassSubject[] = await ClassSubject.find({ class: clz._id })
                .populate('teacher')
                .populate('class')
                .populate('subject')
                .populate('preferences');

            const assignedHoursMap = new Map<string, number>(classSubjects.map(s => [s._id.toString(), 0]));
            
            // Loop through each day and period
            for (const day of daysList) {
                for (const period of periodsList) {
                    
                    // Check if slot is already occupied by a previously placed period
                    const existingPeriod = await Period.findOne({
                        timetableId,
                        class: clz._id,
                        day,
                        period
                    });

                    if (existingPeriod) {
                        console.log(`Slot ${day} ${period} is already occupied.`);
                        // createRemark(timetableId, undefined, `Slot ${day} ${period} is already occupied.`, 0);
                        continue;
                    }

                    // Loop to find a suitable subject and check for conflicts
                    let bestSubject = findBestSubjectForSlot(classSubjects, assignedHoursMap, day, period);
                    let attempts = 0;
                    const maxAttempts = classSubjects.length;

                    while (bestSubject && attempts < maxAttempts) {
                        // Check for teacher conflict with the specifically chosen subject
                        const hasTeacherConflict = await Period.findOne({
                            timetableId,
                            day,
                            period,
                            teacher: bestSubject.teacher
                        });

                        if (hasTeacherConflict) {
                            createRemark(timetableId, bestSubject._id, `Teacher conflict at ${day} ${period}. Trying another subject.`, 0);
                            
                            // Remove the conflicted subject from the list and find the next best one
                            const remainingSubjects = classSubjects.filter(sub => sub._id !== bestSubject?._id);
                            bestSubject = findBestSubjectForSlot(remainingSubjects, assignedHoursMap, day, period);
                            attempts++;
                        } else {
                            // No conflict found, break the loop
                            break;
                        }
                    }

                    if (bestSubject) {
                        await new Period({
                            timetableId: timetableId,
                            classSubject: bestSubject._id,
                            teacher: bestSubject.teacher,
                            class: bestSubject.class,
                            day: day,
                            period: period,
                            _id: new mongoose.Types.ObjectId()
                        }).save();
                        
                        const assignedCount = (assignedHoursMap.get(bestSubject._id.toString()) || 0) + 1;
                        assignedHoursMap.set(bestSubject._id.toString(), assignedCount);
                        createRemark(timetableId, bestSubject._id, `Assigned to slot ${day} ${period}.`, 1);
                    } else {
                        console.log(`No suitable subject found for slot ${day} ${period}.`);
                        
                    }
                }
            }
        }
        console.log("Timetable generation completed successfully.");
    } catch (error: any) {
        const errorMessage = `Error during timetable creation: ${error.message}`;
        console.error(errorMessage, error);
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

