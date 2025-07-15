import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import sendApiResponse from "../utils/sendApiResponse";
import Teacher from "./teacher.model";
import { ITeacher } from "./teacher.types";

const userNameExist = async (username: string) => {
    const teacher = await Teacher.find({ username: username });
    return teacher;
}
export const createTeacher = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // const files = req.files as { [fieldname: string]: Express.Multer.File[] };

        // const file1 = files?.file1?.[0];
        // const file2 = files?.file2?.[0];
        // if (!file1 || !file2) {
        //     return sendApiResponse(res, 'NOT FOUND', null,
        //         `File Not Found`);
        // }
        const isUserNameExist = await userNameExist(req.body.username);
        if (isUserNameExist.length > 0)
            return sendApiResponse(res, 'CONFLICT', null,
                `Username Already Exist`);
        // const _file1 = await uploadFiles(req.body.name, file1, process.env.CLUB_FOLDER ?? '',);
        // const _file2 = await uploadFiles(req.body.manager.name, file2, process.env.MANAGER_FOLDER ?? '',);
        const newTeacher = new Teacher({ ...req.body, _id: new mongoose.Types.ObjectId() });
        // if (_file1 && _file2) {
        //     newTeacher.logo = _file1._id;
        //     newTeacher.manager.img = _file2._id;
        // }
        // else {
        //     return sendApiResponse(res, 'SERVICE UNAVAILABLE', null,
        //         `File upload Failed`);
        // }
        newTeacher.save();
        if (!newTeacher) {
            return sendApiResponse(res, 'CONFLICT', null, 'teacher Not Created');
        }

        sendApiResponse(res, 'CREATED', newTeacher,
            `Added teacher successfully`);
    } catch (error) {
        next(error);
    }
}

export const getTeachers = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const searchKey = req.query.searchKey;
        const _data = await Teacher.find({
            ...(searchKey
                ? {
                    $or: [
                        {
                            name: {
                                $regex: searchKey as string,
                                $options: 'i',
                            },
                        },
                        {
                            code: {
                                $regex: searchKey as string,
                            },
                        },
                    ],
                }
                : {}),
            isAdmin: false

        })
            .sort({ 'name': 1 });
        // If your logo is being populated correctly, we need to handle it properly in the map function
        const data: ITeacher[] = _data.map((club) => {
            // const logoObj = (club.logo as unknown as IFileModel).downloadURL; // Ensure that club.logo is properly typed
            // const logoObj2 = (club.manager.img as unknown as IFileModel).downloadURL; // Ensure that club.logo is properly typed
            // delete club.password;

            return {
                ...club.toObject(),  // Convert mongoose document to a plain object

            };
        });

        sendApiResponse(res, 'OK', data, 'Successfully fetched list of Teachers');
    } catch (error) {
        next(error);
    }
}