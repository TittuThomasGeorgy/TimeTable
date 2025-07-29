import { Schema, model } from 'mongoose';
import { IClassSubject } from './classSubject.types';


export const ClassSubjectSchema = new Schema<IClassSubject>({
    _id: { type: Schema.Types.ObjectId, required: true },
    class: { type: Schema.Types.ObjectId, required: true, ref: "classes" },
    teacher: { type: Schema.Types.ObjectId, required: true, ref: "teachers" },
    subject: { type: Schema.Types.ObjectId, required: true, ref: "subjects" },
    noOfHours: { type: Number, required: true },

}, {
    timestamps: true,
});
const ClassSubject = model<IClassSubject>('class_subjects', ClassSubjectSchema);

export default ClassSubject;
