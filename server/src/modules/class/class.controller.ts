import { NextFunction, Request, Response } from "express";
import mongoose, { Types } from "mongoose";
import sendApiResponse from "../../utils/sendApiResponse";
import Class from "./class.model";
import { IClass } from "./class.types";

export const createClass = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const newClass = new Class({ ...req.body, _id: new mongoose.Types.ObjectId(), classTeacher: new mongoose.Types.ObjectId(req.body.classTeacher) });
        newClass.save();
        if (!newClass) {
            return sendApiResponse(res, 'CONFLICT', null, 'Class Not Created');
        }

        sendApiResponse(res, 'CREATED', newClass,
            `Added Class successfully`);
    } catch (error) {
        next(error);
    }
}

export const getClasses = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const searchKey = req.query.searchKey;
        const _data = await Class.find({
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
        const data: IClass[] = _data.map((_class) => {

            return {
                ..._class.toObject(),  // Convert mongoose document to a plain object

            };
        });

        sendApiResponse(res, 'OK', data, 'Successfully fetched list of Classes');
    } catch (error) {
        next(error);
    }
}

export const getClassByIdReq = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data: IClass = await getClassById(req.params.id);
        sendApiResponse(res, 'OK', data, 'Successfully fetched class');
    } catch (error) {
        if ((error as any).message === 'ClassNotFound') {
            sendApiResponse(res, 'NOT FOUND', null, 'class Not Found');
        } else {
            next(error); // Pass the error to the error-handling middleware for unexpected errors
        }
    }
};
export const getClassById = async (id: string | Types.ObjectId): Promise<IClass> => {
    const _data = await Class.findById(id)
        .sort({ 'name': 1 });

    if (!_data) {
        throw new Error('ClassNotFound'); // Throw an error if the class is not found
    }

    const data: IClass = {
        ..._data.toObject(),

    };

    return data; // Return the data to the controller function
};

export const updateClass = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const _updatedClass = req.body;
        const prevClass = await Class.findById(req.params.id)
        // .populate('logo').populate('manager.img');
        if (!prevClass) {
            return sendApiResponse(res, 'NOT FOUND', null, 'Class Not Found');
        }


        const updatedClass = await Class.findByIdAndUpdate(req.params.id, _updatedClass);
        if (!updatedClass) {
            return sendApiResponse(res, 'CONFLICT', null, 'Class Not Updated');
        }

        sendApiResponse(res, 'OK', _updatedClass,
            `Class updated successfully`);
    } catch (error) {
        next(error);
    }
}

