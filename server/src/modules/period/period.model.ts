import { Schema, model } from 'mongoose';
import { IPeriod } from './period.types';


export const TimetableSchema = new Schema<IPeriod>({
    _id: { type: Schema.Types.ObjectId, required: true },
    classId: { type: Schema.Types.ObjectId, required: true, ref: "classes" },
    subject: { type: Schema.Types.ObjectId, required: true, ref: "subjects" },
    day: {
        type: String,
        enum: ['MON', 'TUE', 'WED', 'THU', 'FRI'],
        required: true,
    },
    period: {
        type: Number,
        enum: [1, 2, 3, 4, 5, 6, 7, 8],
        required: true,
    },
}, {
    timestamps: true,
});
const Timetable = model<IPeriod>('periods', TimetableSchema);

export default Timetable;
