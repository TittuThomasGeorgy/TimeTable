import { NextFunction, Request, Response } from "express";
import mongoose, { Types } from "mongoose";
import sendApiResponse from "../../utils/sendApiResponse";
import Class from "./classSubject.model";
import ClassSubject from "./classSubject.model";
import { IClassSubject } from "./classSubject.types";

export const createClassSubject = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const newClassSub = new ClassSubject({
            ...req.body,
            _id: new mongoose.Types.ObjectId(),
            class: new mongoose.Types.ObjectId(req.body.class as string),
            teacher: new mongoose.Types.ObjectId(req.body.teacher as string),
            subject: new mongoose.Types.ObjectId(req.body.subject as string),
        });
        newClassSub.save();
        if (!newClassSub) {
            return sendApiResponse(res, 'CONFLICT', null, ' Class Subject Not Created');
        }

        sendApiResponse(res, 'CREATED',
            newClassSub,
            `Added Class ClassSubject successfully`);
    } catch (error) {
        next(error);
    }
}

export const getClassSubjects = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const _data = await ClassSubject.find({
            class: req.params.id
        }).populate(['subject', 'teacher'])
        
        // If your logo is being populated correctly, we need to handle it properly in the map function
        const data: IClassSubject[] = _data.map((_class) => {

            return {
                ..._class.toObject(),  // Convert mongoose document to a plain object

            };
        });

        sendApiResponse(res, 'OK', data, 'Successfully fetched list of Class Subjects');
    } catch (error) {
        next(error);
    }
}



export const updateClassSubject = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const _updatedClass = req.body;
        const prevClass = await ClassSubject.findById(req.params.id)
        // .populate('logo').populate('manager.img');
        if (!prevClass) {
            return sendApiResponse(res, 'NOT FOUND', null, 'Class Subject Not Found');
        }


        const updatedClass = await ClassSubject.findByIdAndUpdate(req.params.id, _updatedClass);
        if (!updatedClass) {
            return sendApiResponse(res, 'CONFLICT', null, 'Class Subject Not Updated');
        }

        sendApiResponse(res, 'OK', _updatedClass,
            `Class Subject updated successfully`);
    } catch (error) {
        next(error);
    }
}

