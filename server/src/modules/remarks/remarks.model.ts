import { Schema, model } from 'mongoose';
import { IRemark } from './remarks.type';



export const RemarkSchema = new Schema<IRemark>({
    _id: { type: Schema.Types.ObjectId, required: true },
    timetableId: { type: Schema.Types.ObjectId, required: true, ref: "timetables" },
    classSubject: { type: Schema.Types.ObjectId, required: true, ref: "class_subjects" },
    remark:{type:String},
     status: {
        type: Number,
        enum: [0,1,-1],
        required: true,
        default:0
    },
}, {
    timestamps: true,
});
const Remark = model<IRemark>('remarks', RemarkSchema);

export default Remark;
