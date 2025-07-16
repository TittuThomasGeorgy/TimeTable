import { NextFunction, Request, Response } from "express";
import mongoose, { Types } from "mongoose";
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
        const data: ITeacher[] = _data.map((teacher) => {
            // const logoObj = (teacher.logo as unknown as IFileModel).downloadURL; // Ensure that teacher.logo is properly typed
            // const logoObj2 = (teacher.manager.img as unknown as IFileModel).downloadURL; // Ensure that teacher.logo is properly typed
            // delete teacher.password;

            return {
                ...teacher.toObject(),  // Convert mongoose document to a plain object

            };
        });

        sendApiResponse(res, 'OK', data, 'Successfully fetched list of Teachers');
    } catch (error) {
        next(error);
    }
}

export const getTeacherByIdReq = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data: ITeacher = await getTeacherById(req.params.id);
        sendApiResponse(res, 'OK', data, 'Successfully fetched teacher');
    } catch (error) {
        if ((error as any).message === 'TeacherNotFound') {
            sendApiResponse(res, 'NOT FOUND', null, 'teacher Not Found');
        } else {
            next(error); // Pass the error to the error-handling middleware for unexpected errors
        }
    }
};
export const getTeacherById = async (id: string | Types.ObjectId): Promise<ITeacher> => {
    const _data = await Teacher.findById(id)
        // .populate('logo')
        // .populate('manager.img')
        .sort({ 'name': 1 });

    if (!_data) {
        throw new Error('TeacherNotFound'); // Throw an error if the teacher is not found
    }

    // const logoObj = (_data.logo as unknown as IFileModel).downloadURL;
    // const logoObj2 = (_data.manager.img as unknown as IFileModel).downloadURL; // Ensure that teacher.logo is properly typed

    const data: ITeacher = {
        ..._data.toObject(),
       
    };

    delete data.password;
    return data; // Return the data to the controller function
};

export const updateTeacher = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const _updatedTeacher = req.body;
        const prevTeacher = await Teacher.findById(req.params.id)
        // .populate('logo').populate('manager.img');
        if (!prevTeacher) {
            return sendApiResponse(res, 'NOT FOUND', null, 'Teacher Not Found');
        }
        // const files = req.files as { [fieldname: string]: Express.Multer.File[] };

        // const prevTeacherLogo = (prevTeacher?.logo as unknown as IFileModel);
        // const isSameLogo = prevTeacherLogo.downloadURL === _updatedTeacher.logo;
        // console.log(prevTeacherLogo.downloadURL, _updatedTeacher.logo);
        // let _file: IFileModel | null = null;
        // const file1 = files?.file1?.[0];
        // if (!isSameLogo && file1) {
        //     _file = (await uploadFiles(req.body.name, file1, process.env.CLUB_FOLDER ?? '', prevTeacherLogo.fileId));
        //     if (_file) {
        //         _updatedTeacher.logo = _file?._id
        //     }
        //     else {
        //         return sendApiResponse(res, 'SERVICE UNAVAILABLE', null,
        //             `File upload Failed`);
        //     }
        // }
        // else {
        //     _updatedTeacher.logo = prevTeacher?.logo
        // }

        // const prevManImg = (prevTeacher?.manager.img as unknown as IFileModel);
        // const isSameManImg = prevManImg.downloadURL === _updatedTeacher.manager.img;
        // const file2 = files?.file2?.[0];
        // if (!isSameManImg && file2) {
        //     _file = (await uploadFiles(req.body.name, file2, process.env.MANAGER_FOLDER ?? '', prevTeacherLogo.fileId));
        //     if (_file) {
        //         _updatedTeacher.manager.img = _file?._id
        //     }
        //     else {
        //         return sendApiResponse(res, 'SERVICE UNAVAILABLE', null,
        //             `File upload Failed`);
        //     }
        // }
        // else {
        //     _updatedTeacher.manager.img = prevTeacher?.manager.img
        // }

        if (req.body.password === '')
            _updatedTeacher.password = prevTeacher?.password

        const updatedTeacher = await Teacher.findByIdAndUpdate(req.params.id, _updatedTeacher);
        if (!updatedTeacher) {
            return sendApiResponse(res, 'CONFLICT', null, 'Teacher Not Updated');
        }
        delete _updatedTeacher.password;

        sendApiResponse(res, 'OK', _updatedTeacher,
            `Teacher updated successfully`);
    } catch (error) {
        next(error);
    }
}

