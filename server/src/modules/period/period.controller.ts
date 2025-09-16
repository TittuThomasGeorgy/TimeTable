import { NextFunction, Request, Response } from "express";
import mongoose, { ObjectId, Types } from "mongoose";
import sendApiResponse from "../../utils/sendApiResponse";
import Period from "./period.model";
import { DayType, IPeriod, PeriodType } from "./period.types";
import ClassSubject from "../classSubjects/classSubject.model";
import { IClassSubject } from "../classSubjects/classSubject.types";
import { IClass } from "../class/class.types";
import Class from "../class/class.model";
import { daysList, periodsList } from "./period.constants";
import { createRemark } from "../remarks/remarks.controller";
import { ISubject } from "../subject/subject.types";
import Remark from "../remarks/remarks.model";
import { getActiveTT } from "../timetable/timetable.controller";
import classList from "../class/classList.default";


const shuffleClassSubjects = (classSubjects: IClassSubject[]) => {
    for (let i = classSubjects.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [classSubjects[i], classSubjects[j]] = [classSubjects[j], classSubjects[i]];
    }
    return classSubjects;
};

/**
 * Finds the best suitable subject for a given slot based on the greedy heuristic:
 * 1. Must still need hours.
 * 2. Must not have been assigned yet on the current day for this class.
 * 3. Prioritize subjects with the most remaining hours.
 * 4. Break ties randomly.
 * * NOTE: The assignedSubjectsToday set should only contain Subject ID strings 
 * for subjects that have already been assigned on the current day.
 */
export const findBestSubjectForSlot = (
    classSubjects: IClassSubject[],
    assignedHoursMap: Map<string, number>,
    day: DayType, // Not strictly needed for logic, but kept for function signature consistency
    assignedSubjectsToday: Set<string>
): IClassSubject[] | null => {

    // 1. Filter for subjects that meet the constraints
    const suitableSubjects = classSubjects.filter(sub => {
        const subjectId = sub._id.toString();
        const assignedCount = assignedHoursMap.get(subjectId) || 0;

        // Constraint A: Must still need hours
        if (assignedCount >= sub.noOfHours) {
            return false;
        }

        // Constraint B: Must not have been assigned yet on the current day (Standard Once-Per-Day rule)
        // Check if the subject's ID is in the day's tracker set.
        if (assignedSubjectsToday.has(subjectId)) {
            return false;
        }

        return true;
    });

    // If no suitable subjects, return null.
    if (suitableSubjects.length === 0) {
        return null;
    }

    // 2. Sort by remaining hours (Descending: B - A)
    suitableSubjects.sort((a, b) => {
        const remainingCountA = a.noOfHours - (assignedHoursMap.get(a._id.toString()) || 0);
        const remainingCountB = b.noOfHours - (assignedHoursMap.get(b._id.toString()) || 0);

        // Prioritize higher remaining hours
        return remainingCountB - remainingCountA;
    });

    // 3. Find the highest remaining hour count
    const maxRemainingHours = suitableSubjects[0].noOfHours - (assignedHoursMap.get(suitableSubjects[0]._id.toString()) || 0);

    // 4. Filter for all subjects that match the highest count (the 'top tier')
    const topSubjects = suitableSubjects.filter(sub => {
        const remainingHours = sub.noOfHours - (assignedHoursMap.get(sub._id.toString()) || 0);
        return remainingHours === maxRemainingHours;
    });

    // 5. Return a random subject from the top tier (tie-breaker)
    return shuffleClassSubjects(topSubjects);
};

/**
 * Core function to generate periods for a given set of classes and subjects.
 * @param timetableId The ID of the timetable.
 * @param classes The array of classes to process.
 * @param classSubjects The array of ClassSubjects relevant to these classes.
 */
const generateTimetable = async (
    timetableId: string | Types.ObjectId,
    classes: IClass[],
    classSubjects: IClassSubject[],
    teacherAssignments: Map<string, string>

) => {
    // Map for easy access and filtering by class ID
    const classSubjectsMap = new Map<string, IClassSubject[]>();
    classSubjects.forEach(clzSub => {
        const classId = clzSub.class._id ? clzSub.class._id.toString() : clzSub.class.toString();
        if (!classSubjectsMap.has(classId)) {
            classSubjectsMap.set(classId, []);
        }
        classSubjectsMap.get(classId)!.push(clzSub);
    });

    // Global trackers for assignment state across all classes and phases
    const assignedHoursMap = new Map<string, number>(
        classSubjects.map(s => [s._id.toString(), 0])
    );
    const timetableSlots = new Map<string, string>(); // Key: 'Monday-1-classId', Value: classId (Tracks class-slot conflict)

    // This set will only track subjects assigned on a given day for a class during PHASE 1.
    const phase1DayAssignments = new Set<string>();

    // =================================================================
    // PHASE 1: ASSIGN PREFERRED SLOTS (Iterate over all ClassSubjects)
    // =================================================================
    console.log("--- PHASE 1: Assigning Preferred Slots ---");

    for (const clzSub of classSubjects) {
        const assignedCount = assignedHoursMap.get(clzSub._id.toString()) || 0;
        const teacherId = clzSub.teacher._id.toString();
        const classId = clzSub.class._id ? clzSub.class._id.toString() : clzSub.class.toString();

        for (const pref of clzSub.preferences) {
            if (pref.preference === 1) {
                const slotKey = `${pref.day}-${pref.period}`;
                const classSlotKey = `${slotKey}-${classId}`;
                const teacherSlotKey = `${slotKey}-${teacherId}`;
                const daySubKey = `${pref.day}-${clzSub._id}`;

                if (timetableSlots.has(classSlotKey)) {
                    createRemark(timetableId.toString(), classId, clzSub._id, `Preferred slot already taken for ${pref.day} ${pref.period}.`, -1);
                }
                else if (teacherAssignments.has(teacherSlotKey)) {
                    const assignedClass: IClass = (await Period.findOne({ timetableId, day: pref.day, period: pref.period }).populate('class'))?.class as unknown as IClass
                    createRemark(timetableId.toString(), classId, clzSub._id, `Preferred slot Teacher already assigned for ${pref.day} ${pref.period} for ${classList[assignedClass?.name ?? -1]} ${assignedClass?.div}.`, -1);
                }
                else if (assignedCount >= clzSub.noOfHours) {
                    createRemark(timetableId.toString(), classId, clzSub._id, `Preferred slot unavailable as number of Hours exceeded.`, -1);
                }
                else {
                    await new Period({
                        timetableId: timetableId,
                        classSubject: clzSub._id,
                        teacher: clzSub.teacher,
                        class: clzSub.class,
                        day: pref.day,
                        period: pref.period,
                        _id: new mongoose.Types.ObjectId(),
                    }).save();

                    // Update trackers
                    timetableSlots.set(classSlotKey, classId);
                    teacherAssignments.set(teacherSlotKey, teacherId);
                    assignedHoursMap.set(clzSub._id.toString(), assignedCount + 1);
                    phase1DayAssignments.add(daySubKey);
                    createRemark(timetableId.toString(), classId, clzSub._id, `Assigned preferred slot at ${pref.day} ${pref.period}.`, 1);
                }
            }
        }
    }

    // =================================================================
    // PHASE 2: FILL REMAINING SLOTS
    // =================================================================
    console.log("--- PHASE 2: Filling Remaining Slots ---");

    for (const clz of classes) {
        console.log(`Starting Phase 2 for class: ${clz.name}`);
        const classId = clz._id.toString();
        const currentClassSubjects = classSubjectsMap.get(classId) || [];

        for (const day of daysList) {
            const currentDayAssignments = new Set<string>();
            currentClassSubjects.forEach(sub => {
                const phase1Key = `${day}-${sub._id}`;
                if (phase1DayAssignments.has(phase1Key)) {
                    currentDayAssignments.add(sub._id.toString());
                }
            });

            for (const period of periodsList) {
                const slotKey = `${day}-${period}`;
                const classSlotKey = `${slotKey}-${classId}`;

                if (timetableSlots.has(classSlotKey)) {
                    continue;
                }

                const bestSubjects = findBestSubjectForSlot(currentClassSubjects, assignedHoursMap, day, currentDayAssignments);

                if (bestSubjects && bestSubjects.length > 0) {
                    for (const bestSubject of bestSubjects) {
                        const teacherId = bestSubject.teacher._id.toString();
                        const teacherSlotKey = `${slotKey}-${teacherId}`;
                        const hasTeacherConflict = teacherAssignments.has(teacherSlotKey);

                        if (!hasTeacherConflict) {
                            await new Period({
                                timetableId: timetableId,
                                classSubject: bestSubject._id,
                                teacher: bestSubject.teacher,
                                class: bestSubject.class,
                                day: day,
                                period: period,
                                _id: new mongoose.Types.ObjectId(),
                            }).save();

                            // Update trackers
                            const newAssignedCount = (assignedHoursMap.get(bestSubject._id.toString()) || 0) + 1;
                            assignedHoursMap.set(bestSubject._id.toString(), newAssignedCount);
                            timetableSlots.set(classSlotKey, classId);
                            teacherAssignments.set(teacherSlotKey, teacherId);
                            currentDayAssignments.add(bestSubject._id.toString());
                            createRemark(timetableId.toString(), classId, bestSubject._id, `Assigned to general slot ${day} ${period}.`, 1);
                            break;
                        } else {
                            console.log(`Teacher conflict for slot ${slotKey}. Skipping.`);
                        }
                    }
                } else {
                    console.log(`No suitable subject found for slot ${slotKey} for class ${clz.name}.`);
                }
            }
        }
    }
    console.log("Timetable generation completed successfully.");
};

// =================================================================
// REFACTORED EXPORT FUNCTIONS
// =================================================================

export const createPeriods = async (timetableId: string | Types.ObjectId) => {
    try {
        await Period.deleteMany({ timetableId });
        await Remark.deleteMany({ timetableId });

        const classes: IClass[] = await Class.find({});
        const classSubjects: IClassSubject[] = await ClassSubject.find()
            .populate('teacher')
            .populate('class')
            .populate('subject');
        const teacherAssignments = new Map<string, string>(); // Key: 'Monday-1-teacherId', Value: teacherId (Tracks global teacher conflict)

        await generateTimetable(timetableId, classes, classSubjects, teacherAssignments);
    } catch (error: any) {
        const errorMessage = `Error during bulk timetable creation: ${error.message}`;
        console.error(errorMessage, error);
        throw new Error(errorMessage);
    }
};

export const shufflePeriods = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { timetableId, classId } = req.body;

        await Period.deleteMany({ timetableId, class: classId });
        await Remark.deleteMany({ timetableId, class: classId });

        const clz: IClass | null = await Class.findById(classId);
        if (!clz) {
            throw new Error(`Class with ID ${classId} not found.`);
        }

        const currentClassSubjects: IClassSubject[] = await ClassSubject.find({ class: classId })
            .populate('teacher')
            .populate('class')
            .populate('subject');
        const periods = await Period.find({ timetableId });
        const teacherAssignments = new Map<string, string>
        periods.map(per => {
            const teacherSlotKey = `${per.day}-${per.period}-${per.teacher}`;
            teacherAssignments.set(teacherSlotKey, per.teacher.toString());
        }); // Key: 'Monday-1-teacherId', Value: teacherId (Tracks global teacher conflict)


        await generateTimetable(timetableId?.toString() ?? '', [clz], currentClassSubjects, teacherAssignments);
        sendApiResponse(res, 'OK', null, 'Successfully shuffled class periods');

    } catch (error) {
        next(error);
    }
};


export const getPeriods = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const _data = await Period.find({ timetableId: req.query.timetableId })

        const data: IPeriod[] = _data.map((per) => {

            return {
                ...per.toObject(),  // Convert mongoose document to a plain object

            };
        });

        sendApiResponse(res, 'OK', data, 'Successfully fetched list of Periods');
    } catch (error) {
        next(error);
    }
}

export const shuffleAllPeriods = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await createPeriods(req.params.id);
        sendApiResponse(res, 'OK', null, 'Successfully shuffled periods');
    } catch (error) {
        if ((error as any).message === 'PeriodNotFound') {
            sendApiResponse(res, 'NOT FOUND', null, 'Period Not Found');
        } else {
            next(error); // Pass the error to the error-handling middleware for unexpected errors
        }
    }
};

export const getPeriodByClzId = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const activeTT = await getActiveTT();
        
        const data = await Period.find({ timetableId: activeTT._id, class: req.params.classId})

        sendApiResponse(res, 'OK', data, 'Successfully fetched Periods by clz id');
    } catch (error) {
        if ((error as any).message === 'NoActiveTT') {
            sendApiResponse(res, 'NOT FOUND', null, 'Timetable Not Found');
        } else {
            next(error); // Pass the error to the error-handling middleware for unexpected errors
        }
    }
};