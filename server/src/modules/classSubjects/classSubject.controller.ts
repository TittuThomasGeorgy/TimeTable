import { NextFunction, Request, Response } from "express";
import mongoose, { Types } from "mongoose";
import sendApiResponse from "../../utils/sendApiResponse";
import Class from "./classSubject.model";
import ClassSubject from "./classSubject.model";
import { IClassSubject } from "./classSubject.types";
import { ISubject } from "../subject/subject.types";
import { IClass } from "../class/class.types";
import { ITeacher } from "../teacher/teacher.types";

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
        const { type } = req.query;
        const { id } = req.params;

        let populateOptions: string[] = [];
        let condition: object = {};

        switch (type) {
            case 'class':
                populateOptions = ['subject', 'teacher'];
                condition = { class: id };
                break;
            case 'subject':
                populateOptions = ['class', 'teacher'];
                condition = { subject: id };
                break;
            case 'teacher':
                populateOptions = ['subject', 'class'];
                condition = { teacher: id };
                break;
            default:
                return sendApiResponse(res, 'BAD REQUEST', null, 'Invalid or missing "type" query parameter.');
        }

        const classSubjects = await ClassSubject.find(condition).populate(populateOptions);

        if (!classSubjects || classSubjects.length === 0) {
            return sendApiResponse(res, 'OK', [], 'No data found.');
        }

        const sortedData = classSubjects.map((subject) => subject.toObject()).sort((a, b) => {

            if (type === 'subject' || type == 'teacher') {
                const classA = a.class as unknown as IClass;
                const classB = b.class as unknown as IClass;

                // Sort by class.name, then class.div
                const classNameComparison = classA.name - classB.name;
                if (classNameComparison !== 0) {
                    return classNameComparison;
                }

                const classDivComparison = classA.div.localeCompare(classB.div);
                if (classDivComparison !== 0) {
                    return classDivComparison;
                }
            }
            if (type === 'teacher'||type=='class'&&(b.noOfHours - a.noOfHours==0)) {
                const subjectA = a.subject as ISubject;
                const subjectB = b.subject as ISubject;
                return subjectA.name.localeCompare(subjectB.name);
            }
            if (type === 'subject') {
                const teacherA = a.teacher as unknown as ITeacher;
                const teacherB = b.teacher as unknown as ITeacher;
                return teacherA.name.localeCompare(teacherB.name);
            }

            // Fallback for 'class' type or any other case
            return b.noOfHours - a.noOfHours;
        });

        sendApiResponse(res, 'OK', sortedData, 'Successfully fetched list of Class Subjects');
    } catch (error) {
        next(error);
    }
};



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
export const deleteClassSubject = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const prevClass = await ClassSubject.findById(req.params.id)
        // .populate('logo').populate('manager.img');
        if (!prevClass) {
            return sendApiResponse(res, 'NOT FOUND', null, 'Class Subject Not Found');
        }


        const updatedClass = await ClassSubject.findByIdAndDelete(req.params.id);
        if (!updatedClass) {
            return sendApiResponse(res, 'CONFLICT', null, 'Class Subject Not Deleted');
        }

        sendApiResponse(res, 'OK', updatedClass,
            `Class Subject deleted successfully`);
    } catch (error) {
        next(error);
    }
}

