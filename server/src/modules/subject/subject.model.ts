import { Schema, model } from 'mongoose';
import { ISubject } from './subject.types';


export const SubjectSchema = new Schema<ISubject>({
    _id: { type: Schema.Types.ObjectId, required: true },
    name: { type: String, required: true, unique: true, uppercase: true },
    code: { type: String, required: true, uppercase: true, unique: true },
}, {
    timestamps: true,
});
const Subject = model<ISubject>('subjects', SubjectSchema);

export default Subject;
