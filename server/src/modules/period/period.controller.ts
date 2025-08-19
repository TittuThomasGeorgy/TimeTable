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
// Sort subjects by noOfHours, with a random tie-breaker
const sortClassSubjects = (classSubjects: IClassSubject[]) => {
    return classSubjects.sort((a, b) => {
        const hoursDiff = b.noOfHours - a.noOfHours;
        if (hoursDiff !== 0) {
            return hoursDiff;
        }
        return Math.random() - 0.5;
    });
};

// Finds the first available slot for a given subject
const findAvailableSlot = async (
    timetableId: string | Types.ObjectId,
    classSubject: IClassSubject,
    startDay: DayType,
    startPeriod: PeriodType,
) => {
    const startDayIndex = daysList.indexOf(startDay);
    const startPeriodIndex = periodsList.indexOf(startPeriod);

    for (let d = startDayIndex; d < daysList.length; d++) {
        const currentDay = daysList[d] as DayType;
        const startP = d === startDayIndex ? startPeriodIndex : 0;

        // Check if this subject has already been assigned on the current day
        const isSubjectAssignedToday = await Period.findOne({
            timetableId: timetableId,
            day: currentDay,
            classSubject: classSubject._id,
        });

        if (classSubject.noOfHours > 1 && isSubjectAssignedToday) {
            continue;
        }

        for (let p = startP; p < periodsList.length; p++) {
            const currentPeriod = periodsList[p] as PeriodType;
            
            // Check for conflicts with other subjects for the same class or teacher
            const slotTaken = await Period.findOne({
                timetableId: timetableId,
                day: currentDay,
                period: currentPeriod,
                $or: [
                    { class: classSubject.class },
                    { teacher: classSubject.teacher },
                ]
            });
            
            // Check if the slot is a "not preferred" one
            const preferred = classSubject.preferences.find(pref => {
                return pref.day === currentDay && pref.period === currentPeriod;
            });

            const isNotPreferred = preferred?.preference === -1;
            
            if (!slotTaken && !isNotPreferred) {
                return { day: currentDay, period: currentPeriod };
            }
        }
    }
    return null;
};


// Main function to create the timetable
export const createPeriods = async (timetableId: string | Types.ObjectId) => {
    try {
        await Period.deleteMany({ timetableId });
        const classes: IClass[] = await Class.find({});

        for (const clz of classes) {
            const classSubjects: IClassSubject[] = await ClassSubject.find({ class: clz._id })
                .populate('teacher')
                .populate('class')
                .populate('preferences');

            const sortedSubjects = sortClassSubjects(classSubjects);
            const assignedHoursMap = new Map<string, number>(sortedSubjects.map(s => [s._id.toString(), 0]));
            const totalHoursNeeded = sortedSubjects.reduce((sum, subj) => sum + subj.noOfHours, 0);

            // Pass 1: Schedule all preferred slots (preference === 1)
            for (const clzSub of sortedSubjects) {
                for (const pref of clzSub.preferences) {
                    if (pref.preference === 1) {
                        const assignedCount = assignedHoursMap.get(clzSub._id.toString()) || 0;
                        if (assignedCount < clzSub.noOfHours) {
                            // Call findAvailableSlot, starting the search at the preferred slot
                            const availableSlot = await findAvailableSlot(
                                timetableId,
                                clzSub,
                                pref.day,
                                pref.period
                            );
                            if (availableSlot) {
                                await new Period({
                                    timetableId: timetableId,
                                    classSubject: clzSub._id,
                                    teacher: clzSub.teacher,
                                    class: clzSub.class,
                                    day: availableSlot.day,
                                    period: availableSlot.period,
                                    _id: new mongoose.Types.ObjectId()
                                }).save();
                                assignedHoursMap.set(clzSub._id.toString(), assignedCount + 1);
                            }
                        }
                    }
                }
            }

            // Pass 2: Schedule the remaining slots
            let hoursAssignedForClass = Array.from(assignedHoursMap.values()).reduce((sum, val) => sum + val, 0);
            while (hoursAssignedForClass < totalHoursNeeded) {
                let assignedThisLoop = false;
                for (const clzSub of sortedSubjects) {
                    const assignedCount = assignedHoursMap.get(clzSub._id.toString()) || 0;
                    
                    if (assignedCount < clzSub.noOfHours) {
                        const availableSlot = await findAvailableSlot(
                            timetableId,
                            clzSub,
                            'MON',
                            1
                        );

                        if (availableSlot) {
                            await new Period({
                                timetableId: timetableId,
                                classSubject: clzSub._id,
                                teacher: clzSub.teacher,
                                class: clzSub.class,
                                day: availableSlot.day,
                                period: availableSlot.period,
                                _id: new mongoose.Types.ObjectId()
                            }).save();

                            assignedHoursMap.set(clzSub._id.toString(), assignedCount + 1);
                            hoursAssignedForClass++;
                            assignedThisLoop = true;
                        }
                    }
                }
                if (!assignedThisLoop && hoursAssignedForClass < totalHoursNeeded) {
                     console.error(`Timetable generation failed for class ${clz.name}. Could not find slots for all subjects.`);
                     break;
                }
            }
        }
        console.log("Timetable generation completed successfully.");
    } catch (error) {
        console.error("Error during timetable creation:", error);
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

