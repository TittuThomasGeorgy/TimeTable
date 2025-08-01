import { Schema, model } from 'mongoose';
import { ITeacher } from './teacher.types';


export const TeacherSchema = new Schema<ITeacher>({
    _id: { type: Schema.Types.ObjectId, required: true },
    name: { type: String, required: true },
    code: { type: String, required: true,uppercase:true ,unique:true},
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    exp: { type: Number, required: true },
    image:{ type: String },
    subject: { type: Schema.Types.ObjectId, ref: "subjects" }

}, {
    timestamps: true,
});
const Teacher = model<ITeacher>('teachers', TeacherSchema);

export default Teacher;
