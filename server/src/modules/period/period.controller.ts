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
const shuffleClassSubjects = (classSubjects: IClassSubject[]) => {
    for (let i = classSubjects.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [classSubjects[i], classSubjects[j]] = [classSubjects[j], classSubjects[i]];
    }
    return classSubjects;
};

const findAvailableSlot = async (timetableId: string | Types.ObjectId, classSubject: IClassSubject, startDay: DayType, startPeriod: PeriodType) => {
    const startDayIndex = daysList.indexOf(startDay);
    const startPeriodIndex = periodsList.indexOf(startPeriod);

    for (let d = startDayIndex; d < daysList.length; d++) {
        const currentDay = daysList[d] as DayType;
        const startP = (d === startDayIndex) ? startPeriodIndex : 0;

        for (let p = startP; p < periodsList.length; p++) {
            const currentPeriod = periodsList[p] as PeriodType;

            // Check for both teacher and class availability in one query
            const slotTaken = await Period.findOne({
                timetableId: timetableId,
                day: currentDay,
                period: currentPeriod,
                $or: [
                    { class: classSubject.class }, // Check if the class is busy
                    { teacher: classSubject.teacher } // Check if the teacher is busy
                ]
            });
            const preferred = classSubject.preferences.find(pref => {
                pref.day === currentDay && pref.period === currentPeriod
            });
            const isNotPreferred = preferred?.preference === -1
            if (!slotTaken && !isNotPreferred) {
                return { day: currentDay, period: currentPeriod };
            }
        }
    }
    return null;
};

export const createPeriods = async (timetableId: string | Types.ObjectId) => {
    try {
        await Period.deleteMany({ timetableId }); // Start with a clean slate
        const classes: IClass[] = await Class.find({});

        for (const clz of classes) {
            const classSubjects: IClassSubject[] = await ClassSubject.find({ class: clz._id }).populate('teacher').populate('class');
            const shuffledSubjects = shuffleClassSubjects(classSubjects);

            // This will hold the total hours needed for the class
            const totalHoursNeeded = shuffledSubjects.reduce((sum, subj) => sum + subj.noOfHours, 0);
            let hoursAssignedForClass = 0;

            // This map will track hours assigned per subject to handle multiple periods
            const assignedHoursMap = new Map<string, number>(shuffledSubjects.map(s => [s._id.toString(), 0]));

            // First, schedule all preferred slots for this class
            for (const clzSub of shuffledSubjects) {
                if (clzSub.preferences && clzSub.preferences.length > 0) {
                    for (const pref of clzSub.preferences) {
                        const assigned = assignedHoursMap.get(clzSub._id.toString()) || 0;
                        if (pref.preference === 1 && assigned < clzSub.noOfHours) {
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
                                assignedHoursMap.set(clzSub._id.toString(), assigned + 1);
                                hoursAssignedForClass++;
                            }
                        }
                    }
                }
            }

            // Then, schedule the remaining slots for this class
            let lastDay = 'MON' as DayType;
            let lastPeriod = 1 as PeriodType;
            let subjectIndex = 0;

            while (hoursAssignedForClass < totalHoursNeeded) {
                const clzSub = shuffledSubjects[subjectIndex];
                const assigned = assignedHoursMap.get(clzSub._id.toString()) || 0;

                if (assigned < clzSub.noOfHours) {
                    const availableSlot = await findAvailableSlot(
                        timetableId,
                        clzSub,
                        lastDay,
                        lastPeriod
                    );

                    if (!availableSlot) {
                        console.error(`Timetable generation failed for class ${clz._id}. No more slots available.`);
                        break;
                    }

                    await new Period({
                        timetableId: timetableId,
                        classSubject: clzSub._id,
                        teacher: clzSub.teacher,
                        class: clzSub.class,
                        day: availableSlot.day,
                        period: availableSlot.period,
                        _id: new mongoose.Types.ObjectId()
                    }).save();
                    assignedHoursMap.set(clzSub._id.toString(), assigned + 1);
                    hoursAssignedForClass++;

                    lastDay = availableSlot.day;
                    lastPeriod = availableSlot.period;
                }

                // Move to the next subject in the shuffled list
                subjectIndex = (subjectIndex + 1) % shuffledSubjects.length;
            }
        }
    } catch (error) {
        console.error("Error during timetable creation:", error);
    }
};

export const getPeriods = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log(req.query.timetableId);


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

