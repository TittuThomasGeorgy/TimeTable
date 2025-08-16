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

const isTeacherAvailable = async (timetableId: string | Types.ObjectId, teacherId: string | Types.ObjectId, day: DayType, period: PeriodType) => {
    const data = await Period.findOne({
        timetableId: timetableId,
        day: day,
        period: period,
    }).populate({
        path: 'classSubject',
        match: { teacher: teacherId }
    });
    return data === null;
};

const isPeriodOnDay = async (timetableId: string | Types.ObjectId, classSub: string | Types.ObjectId, day: DayType) => {
    const data = await Period.findOne({
        timetableId: timetableId,
        classSubject: classSub,
        day: day,
    });
    return data !== null;
};

const nextAvailable = async (timetableId: string | Types.ObjectId, teacherId: string | Types.ObjectId, classSub: string | Types.ObjectId, startDay: DayType, startPeriod: PeriodType) => {
    const startDayIndex = _daysList.indexOf(startDay);
    const startPeriodIndex = _periodsList.indexOf(startPeriod);

    for (let d = startDayIndex; d < _daysList.length; d++) {
        const currentDay = _daysList[d] as DayType;
        const startP = (d === startDayIndex) ? startPeriodIndex : 0;

        for (let p = startP; p < _periodsList.length; p++) {
            const currentPeriod = _periodsList[p] as PeriodType;

            const isSlotBooked = await Period.findOne({
                timetableId: timetableId,
                $or: [
                    { day: currentDay, period: currentPeriod, classSubject: { $ne: classSub } }, // Check if slot is taken by another subject
                    { day: currentDay, period: currentPeriod } // Check if slot is taken by any subject
                ]
            }).populate({
                path: 'classSubject',
                match: {
                    $or: [
                        { teacher: teacherId }, // Check if teacher is busy
                        { _id: classSub } // Check if classSubject is already assigned to a period on this day
                    ]
                }
            });

            if (!isSlotBooked) {
                return { day: currentDay, period: currentPeriod };
            }
        }
    }
    return null;
};

export const createPeriods = async (timetableId: string | Types.ObjectId, next: NextFunction) => {
    try {
        const _classSubjects: IClassSubject[] = await ClassSubject.find({}).populate('subject');
        const classSubjects = shuffleClassSubjects(_classSubjects);

        for (const clzSub of classSubjects) {
            let hoursAssigned = 0;

            // 1. Assign preferred slots first
            if (clzSub.preferences && clzSub.preferences.length > 0) {
                for (const pref of clzSub.preferences) {
                    if (pref.preference === 1 && hoursAssigned < clzSub.noOfHours) {
                        const isAvailable = await isTeacherAvailable(timetableId, clzSub.teacher as Types.ObjectId, pref.day, pref.period);
                        const isAlreadyAssigned = await isPeriodOnDay(timetableId, clzSub._id, pref.day);

                        if (isAvailable && !isAlreadyAssigned) {
                            const newPeriod = new Period({
                                _id: new mongoose.Types.ObjectId(),
                                timetableId: timetableId,
                                classSubject: clzSub._id,
                                day: pref.day,
                                period: pref.period,
                            });
                            await newPeriod.save();
                            hoursAssigned++;
                        }
                    }
                }
            }

            // 2. Assign remaining hours to next available slots
            let lastDay = 'MON' as DayType;
            let lastPeriod = 1 as PeriodType;

            while (hoursAssigned < clzSub.noOfHours) {
                const availability = await nextAvailable(timetableId, clzSub.teacher as Types.ObjectId, clzSub._id, lastDay, lastPeriod);

                if (!availability) {
                    console.error(`Could not find a slot for subject ID: ${clzSub._id},${lastDay}, ${lastPeriod}`);
                    break;
                }

                const newPeriod = new Period({
                    _id: new mongoose.Types.ObjectId(),
                    timetableId: timetableId,
                    classSubject: clzSub._id,
                    day: availability.day,
                    period: availability.period,
                });
                await newPeriod.save();
                hoursAssigned++;

                // Update the last checked slot for the next iteration
                lastDay = availability.day;
                lastPeriod = availability.period;
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

