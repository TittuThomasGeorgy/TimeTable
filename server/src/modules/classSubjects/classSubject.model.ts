import { Schema, model } from 'mongoose';
import { IClassSubject, Preferences } from './classSubject.types';

const PreferencesSchema = new Schema<Preferences>(
  {
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
    preference: {
      type: Number,
      enum: [1, 0, -1],
      required: true,
    },
  },
  { _id: false } // prevent _id for subDocuments
);

export const ClassSubjectSchema = new Schema<IClassSubject>({
    _id: { type: Schema.Types.ObjectId, required: true },
    class: { type: Schema.Types.ObjectId, required: true, ref: "classes" },
    teacher: { type: Schema.Types.ObjectId, required: true, ref: "teachers" },
    subject: { type: Schema.Types.ObjectId, required: true, ref: "subjects" },
    noOfHours: { type: Number, required: true },
    preferences: {
      type: [PreferencesSchema],
      default: [],
    },

}, {
    timestamps: true,
});
const ClassSubject = model<IClassSubject>('class_subjects', ClassSubjectSchema);

export default ClassSubject;
