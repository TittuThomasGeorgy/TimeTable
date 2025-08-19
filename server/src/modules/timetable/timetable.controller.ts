import { NextFunction, Request, Response } from "express";
import mongoose, { Types } from "mongoose";
import sendApiResponse from "../../utils/sendApiResponse";
import Timetable from "./timetable.model";
import { ITimetable } from "./timetable.types";
import { createPeriods } from "../period/period.controller";
import Period from "../period/period.model";

const timetableNameExist = async (name: string) => {
    const teacher = await Timetable.find({ name: name });
    return teacher;
}

export const createTimetable = async (req: Request, res: Response, next: NextFunction) => {
    try {
         const isNameExist = await timetableNameExist(req.body.name);
        if (isNameExist.length > 0)
            return sendApiResponse(res, 'CONFLICT', null,
                `TimeTable Already Exist`);
        const id = new mongoose.Types.ObjectId
        const newTimetable = new Timetable({ ...req.body, _id: id });
        newTimetable.save();
        await createPeriods(id)
        if (!newTimetable) {
            return sendApiResponse(res, 'CONFLICT', null, 'Timetable Not Created');
        }

        sendApiResponse(res, 'CREATED',
            newTimetable,
            `Added Timetable successfully`);
    } catch (error) {
        next(error);
    }
}

export const getTimetables = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const searchKey = req.query.searchKey;
        const _data = await Timetable.find({
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
        const data: ITimetable[] = _data.map((_class) => {

            return {
                ..._class.toObject(),  // Convert mongoose document to a plain object

            };
        });

        sendApiResponse(res, 'OK', data, 'Successfully fetched list of Timetables');
    } catch (error) {
        next(error);
    }
}

export const getTimetableByIdReq = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data: ITimetable = await getTimetableById(req.params.id);
        sendApiResponse(res, 'OK', data, 'Successfully fetched class');
    } catch (error) {
        if ((error as any).message === 'TimetableNotFound') {
            sendApiResponse(res, 'NOT FOUND', null, 'Timetable Not Found');
        } else {
            next(error); // Pass the error to the error-handling middleware for unexpected errors
        }
    }
};
export const getTimetableById = async (id: string | Types.ObjectId): Promise<ITimetable> => {
    const _data = await Timetable.findById(id)
        .sort({ 'name': 1 });

    if (!_data) {
        throw new Error('TimetableNotFound'); // Throw an error if the class is not found
    }

    const data: ITimetable = {
        ..._data.toObject(),

    };

    return data; // Return the data to the controller function
};
export const getTimetableName = async (id: string | Types.ObjectId): Promise<string> => {
    const _data = await getTimetableById(id);

    return _data.name
        ; // Return the data to the controller function
};

export const updateTimetable = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const _updatedTimetable = req.body;
        const prevTimetable = await Timetable.findById(req.params.id)
        // .populate('logo').populate('manager.img');
        if (!prevTimetable) {
            return sendApiResponse(res, 'NOT FOUND', null, 'Timetable Not Found');
        }


        const updatedTimetable = await Timetable.findByIdAndUpdate(req.params.id, _updatedTimetable);
        if (!updatedTimetable) {
            return sendApiResponse(res, 'CONFLICT', null, 'Timetable Not Updated');
        }

        sendApiResponse(res, 'OK', _updatedTimetable,
            `Timetable updated successfully`);
    } catch (error) {
        next(error);
    }
}

export const deleteTimetable = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const prevClass = await Timetable.findById(req.params.id)
        // .populate('logo').populate('manager.img');
        if (!prevClass) {
            return sendApiResponse(res, 'NOT FOUND', null, 'Timetable Not Found');
        }


        const updatedClass = await Timetable.findByIdAndDelete(req.params.id);
        if (!updatedClass) {
            return sendApiResponse(res, 'CONFLICT', null, 'Timetable Not Deleted');
        }
        await Period.deleteMany({timetableId:req.params.id})

        sendApiResponse(res, 'OK', updatedClass,
            `Class Subject deleted successfully`);
    } catch (error) {
        next(error);
    }
}