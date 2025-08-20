import mongoose, { Types } from "mongoose";
import Remark from "./remarks.model";
import { NextFunction, Request, Response } from "express";
import { IRemark } from "./remarks.type";
import sendApiResponse from "../../utils/sendApiResponse";

export const createRemark = async (timetableId: string | Types.ObjectId, classSubject: string | Types.ObjectId, remark: string, status: 0 | 1 | -1) => {
    const _remark = await new Remark({
        _id: new mongoose.Types.ObjectId,
        classSubject: classSubject,
        remark: remark,
        status: status,
        timetableId: timetableId
    }).save()
}

export const getRemarks = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const _data = await Remark.find({ timetableId: req.query.timetableId }).sort({'createdAt': 1})

        const data: IRemark[] = _data.map((per) => {

            return {
                ...per.toObject(),  // Convert mongoose document to a plain object

            };
        });

        sendApiResponse(res, 'OK', data, 'Successfully fetched list of Remarks');
    } catch (error) {
        next(error);
    }
}