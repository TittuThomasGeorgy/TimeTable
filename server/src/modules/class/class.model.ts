import { Schema, model } from 'mongoose';
import { IClass } from './class.types';


export const ClassSchema = new Schema<IClass>({
    _id: { type: Schema.Types.ObjectId, required: true },
    name: { type: Number, required: true },
    div: { type: String },
    classTeacher: { type: Schema.Types.ObjectId, ref: "teachers" }
}, {
    timestamps: true,
});
const Class = model<IClass>('classes', ClassSchema);

export default Class;
