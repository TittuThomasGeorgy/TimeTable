import HomePageRoutes from "../modules/home/routes";
import TeacherPageRoutes from "../modules/teacher/routes";
import TimeTablePageRoutes from "../modules/timetable/routes";
import type { ModuleRoute } from "../types/ModuleRoute";

export const allModuleRoutes:ModuleRoute[] = [
    HomePageRoutes,
    TeacherPageRoutes,
    TimeTablePageRoutes,

];