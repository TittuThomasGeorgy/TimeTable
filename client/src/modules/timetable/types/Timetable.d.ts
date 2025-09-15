import DayJs from 'dayjs';
export interface ITimetable {
    _id: string;
    name: string;
    isActive: boolean;
    createdAt: DayJs;
}