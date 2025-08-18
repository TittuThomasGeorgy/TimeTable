import { Schema, model } from 'mongoose';
import { IPeriod } from './period.types';


export const PeriodSchema = new Schema<IPeriod>({
    _id: { type: Schema.Types.ObjectId, required: true },
    timetableId: { type: Schema.Types.ObjectId, required: true, ref: "timetables" },
    classSubject: { type: Schema.Types.ObjectId, required: true, ref: "class_subjects" },
    class: { type: Schema.Types.ObjectId, required: true, ref: "classes" },
    teacher: { type: Schema.Types.ObjectId, required: true, ref: "teachers" },
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
const Period = model<IPeriod>('periods', PeriodSchema);

export default Period;
