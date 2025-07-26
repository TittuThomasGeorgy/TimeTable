import { Schema, model } from 'mongoose';
import { ISubject } from './subject.types';


export const SubjectSchema = new Schema<ISubject>({
    _id: { type: Schema.Types.ObjectId, required: true },
    name: { type: String, required: true },
    code: { type: String, required: true },
}, {
    timestamps: true,
});
const Subject = model<ISubject>('subjects', SubjectSchema);

export default Subject;
