import { NextFunction, Request, Response } from "express";
import mongoose, { Types } from "mongoose";
import sendApiResponse from "../../utils/sendApiResponse";
import Subject from "./subject.model";
import { ISubject } from "./subject.types";

export const createSubject = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const newSubject = new Subject({ ...req.body, _id: new mongoose.Types.ObjectId(), classTeacher: new mongoose.Types.ObjectId(req.body.classTeacher) });
        newSubject.save();
        if (!newSubject) {
            return sendApiResponse(res, 'CONFLICT', null, 'Subject Not Created');
        }

        sendApiResponse(res, 'CREATED', 
            newSubject,
            `Added Subject successfully`);
    } catch (error) {
        next(error);
    }
}

export const getSubjects = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const searchKey = req.query.searchKey;
        const _data = await Subject.find({
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
        const data: ISubject[] = _data.map((_class) => {

            return {
                ..._class.toObject(),  // Convert mongoose document to a plain object

            };
        });

        sendApiResponse(res, 'OK', data, 'Successfully fetched list of Subjects');
    } catch (error) {
        next(error);
    }
}

export const getSubjectByIdReq = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data: ISubject = await getSubjectById(req.params.id);
        sendApiResponse(res, 'OK', data, 'Successfully fetched class');
    } catch (error) {
        if ((error as any).message === 'SubjectNotFound') {
            sendApiResponse(res, 'NOT FOUND', null, 'class Not Found');
        } else {
            next(error); // Pass the error to the error-handling middleware for unexpected errors
        }
    }
};
export const getSubjectById = async (id: string | Types.ObjectId): Promise<ISubject> => {
    const _data = await Subject.findById(id)
        .sort({ 'name': 1 });

    if (!_data) {
        throw new Error('SubjectNotFound'); // Throw an error if the class is not found
    }

    const data: ISubject = {
        ..._data.toObject(),

    };

    return data; // Return the data to the controller function
};

export const updateSubject = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const _updatedSubject = req.body;
        const prevSubject = await Subject.findById(req.params.id)
        // .populate('logo').populate('manager.img');
        if (!prevSubject) {
            return sendApiResponse(res, 'NOT FOUND', null, 'Subject Not Found');
        }


        const updatedSubject = await Subject.findByIdAndUpdate(req.params.id, _updatedSubject);
        if (!updatedSubject) {
            return sendApiResponse(res, 'CONFLICT', null, 'Subject Not Updated');
        }

        sendApiResponse(res, 'OK', _updatedSubject,
            `Subject updated successfully`);
    } catch (error) {
        next(error);
    }
}

