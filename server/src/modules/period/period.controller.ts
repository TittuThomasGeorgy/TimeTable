import { NextFunction, Request, Response } from "express";
import mongoose, { ObjectId, Types } from "mongoose";
import sendApiResponse from "../../utils/sendApiResponse";
import Period from "./period.model";
import { DayType, IPeriod, PeriodType } from "./period.types";
import ClassSubject from "../classSubjects/classSubject.model";
import { IClassSubject } from "../classSubjects/classSubject.types";
const _daysList = ['MON', 'TUE', 'WED', 'THU', 'FRI'];
const _periodsList = [1, 2, 3, 4, 5, 6, 7, 8];

const shuffleClassSubjects = (classSubjects: IClassSubject[]) => {
    for (let i = classSubjects.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [classSubjects[i], classSubjects[j]] = [classSubjects[j], classSubjects[i]];
    }
    return classSubjects;
};

const findAvailableSlot = async (timetableId: string | Types.ObjectId, teacherId: string | Types.ObjectId, classId: string | Types.ObjectId, classSubId: string | Types.ObjectId, startDay: DayType, startPeriod: PeriodType) => {
    const startDayIndex = _daysList.indexOf(startDay);
    const startPeriodIndex = _periodsList.indexOf(startPeriod);

    for (let d = startDayIndex; d < _daysList.length; d++) {
        const currentDay = _daysList[d] as DayType;
        const startP = (d === startDayIndex) ? startPeriodIndex : 0;

        for (let p = startP; p < _periodsList.length; p++) {
            const currentPeriod = _periodsList[p] as PeriodType;

            // Check if slot is already occupied by any other class or teacher
            const slotTaken = await Period.findOne({
                timetableId: timetableId,
                day: currentDay,
                period: currentPeriod,
                $or: [
                    { class: classId }, // Check if class is busy
                    { classSubject: { $ne: classSubId } }, // Check if slot is taken by another subject for this timetable
                ]
            }).populate({
                path: 'classSubject',
                match: { teacher: teacherId } // Check if teacher is busy
            });

            if (!slotTaken) {
                return { day: currentDay, period: currentPeriod };
            }
        }
    }
    return null;
};

export const createPeriods = async (timetableId: string | Types.ObjectId, next: NextFunction) => {
    try {
        await Period.deleteMany({ timetableId }); // Start with a clean slate for the timetable
        const classSubjects: IClassSubject[] = await ClassSubject.find({ timetableId }).populate('teacher').populate('class'); // Fetch all class subjects for the timetable
        const shuffledSubjects = shuffleClassSubjects(classSubjects);

        for (const clzSub of shuffledSubjects) {
            let hoursAssigned = 0;

            // 1. Assign preferred slots first
            if (clzSub.preferences && clzSub.preferences.length > 0) {
                for (const pref of clzSub.preferences) {
                    if (pref.preference === 1 && hoursAssigned < clzSub.noOfHours) {
                        const availableSlot = await findAvailableSlot(
                            timetableId,
                            clzSub.teacher as Types.ObjectId,
                            clzSub.class as Types.ObjectId,
                            clzSub._id,
                            pref.day,
                            pref.period
                        );
                        if (availableSlot) {
                            await new Period({
                                timetableId: timetableId,
                                classSubject: clzSub._id,
                                teacher: clzSub.teacher, // Add teacher ID for denormalized queries
                                class: clzSub.class, // Add class ID for denormalized queries
                                day: availableSlot.day,
                                period: availableSlot.period,
                            }).save();
                            hoursAssigned++;
                        }
                    }
                }
            }

            // 2. Assign remaining hours to next available slots
            let lastDay = 'MON' as DayType;
            let lastPeriod = 1 as PeriodType;

            while (hoursAssigned < clzSub.noOfHours) {
                const availableSlot = await findAvailableSlot(
                    timetableId,
                    clzSub.teacher as Types.ObjectId,
                    clzSub.class as Types.ObjectId,
                    clzSub._id,
                    lastDay,
                    lastPeriod
                );

                if (!availableSlot) {
                    console.error(`Could not find a slot for subject ID: ${clzSub._id} and Class: ${clzSub.class}`);
                    break;
                }

                await new Period({
                    timetableId: timetableId,
                    classSubject: clzSub._id,
                    teacher: clzSub.teacher,
                    class: clzSub.class,
                    day: availableSlot.day,
                    period: availableSlot.period,
                }).save();
                hoursAssigned++;
                lastDay = availableSlot.day;
                lastPeriod = availableSlot.period;
            }
        }
    } catch (error) {
        next(error);
    }
};

export const getPeriods = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const searchKey = req.query.searchKey;
        const _data = await Period.find({
            ...(searchKey
                ? {
                    name: {
                        $regex: searchKey as string,
                        $options: 'i',
                    },

                }
                : {}),

        })
            .sort({ 'name': 1 });
        // If your logo is being populated correctly, we need to handle it properly in the map function
        const data: IPeriod[] = _data.map((_class) => {

            return {
                ..._class.toObject(),  // Convert mongoose document to a plain object

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

