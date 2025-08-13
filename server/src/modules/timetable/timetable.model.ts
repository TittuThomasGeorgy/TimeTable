import { Schema, model } from 'mongoose';
import { ITimetable } from './timetable.types';


export const TimetableSchema = new Schema<ITimetable>({
    _id: { type: Schema.Types.ObjectId, required: true },
    name: { type: String, required: true, unique: true},
    isActive: { type: Boolean, required: true },
}, {
    timestamps: true,
});
const Timetable = model<ITimetable>('timetables', TimetableSchema);

export default Timetable;
