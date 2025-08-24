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
// Sort subjects by noOfHours, with a random tie-breaker

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
): IClassSubject | null => {

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
    return topSubjects[Math.floor(Math.random() * topSubjects.length)];
};


// ---

export const createPeriods = async (timetableId: string | Types.ObjectId) => {
    try {
        await Period.deleteMany({ timetableId });
        const classes: IClass[] = await Class.find({});

        // Fetch ALL ClassSubjects once
        const classSubjects: IClassSubject[] = await ClassSubject.find()
            .populate('teacher')
            .populate('class')
            .populate('subject');

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
        const timetableSlots = new Map<string, string>(); // Key: 'Monday-1', Value: classId (Tracks class-slot conflict)
        const teacherAssignments = new Map<string, string>(); // Key: 'Monday-1-teacherId', Value: teacherId (Tracks global teacher conflict)
        
        // This set will only track subjects assigned on a given day for a class during PHASE 1.
        // It will NOT persist across days in PHASE 2.
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
                    // The once-per-day key for Phase 1
                    const daySubKey = `${pref.day}-${clzSub._id}`; 

                    // Check for all conflicts before assigning.
                    if (
                        // 1. Slot is not already taken by another preferred subject for this CLASS
                        !timetableSlots.has(classSlotKey) &&
                        // 2. Teacher is not assigned elsewhere at this time (Global check)
                        !teacherAssignments.has(teacherSlotKey) &&
                        // 3. Subject is not assigned yet on this day for this CLASS (once-per-day rule)
                        !phase1DayAssignments.has(daySubKey) &&
                        // 4. Subject still needs hours
                        assignedCount < clzSub.noOfHours
                    ) {
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
                        timetableSlots.set(classSlotKey, classId); // Track class-slot
                        teacherAssignments.set(teacherSlotKey, teacherId); // Track global teacher
                        assignedHoursMap.set(clzSub._id.toString(), (assignedCount || 0) + 1);
                        phase1DayAssignments.add(daySubKey);
                        createRemark(timetableId, clzSub._id, `Assigned preferred slot at ${pref.day} ${pref.period}.`, 1);
                    }
                }
            }
        }

        // =================================================================
        // PHASE 2: FILL REMAINING SLOTS (Iterate over all classes, then days/periods)
        // =================================================================
        console.log("--- PHASE 2: Filling Remaining Slots ---");
        
        for (const clz of classes) {
            console.log(`Starting Phase 2 for class: ${clz.name}`);
            const classId = clz._id.toString();
            const currentClassSubjects = classSubjectsMap.get(classId) || [];

            // 2. Fill remaining slots with non-preferred subjects.
            for (const day of daysList) {
                // *** CRITICAL FIX ***: This set must be local to the day loop 
                // to correctly enforce the "once-per-day" rule.
                const currentDayAssignments = new Set<string>();
                
                // Add subjects already assigned today in Phase 1 to this local tracker
                currentClassSubjects.forEach(sub => {
                    const phase1Key = `${day}-${sub._id}`;
                    if (phase1DayAssignments.has(phase1Key)) {
                        currentDayAssignments.add(sub._id.toString());
                    }
                });

                for (const period of periodsList) {
                    const slotKey = `${day}-${period}`;
                    const classSlotKey = `${slotKey}-${classId}`;

                    // Check if the slot is already filled for THIS CLASS (by Phase 1)
                    if (timetableSlots.has(classSlotKey)) {
                        continue;
                    }

                    // Get the best subject that needs hours and hasn't been assigned TODAY
                    let bestSubject = findBestSubjectForSlot(currentClassSubjects, assignedHoursMap, day, currentDayAssignments);

                    if (bestSubject) {
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
                            timetableSlots.set(classSlotKey, classId); // Track class-slot
                            teacherAssignments.set(teacherSlotKey, teacherId); // Track global teacher
                            currentDayAssignments.add(bestSubject._id.toString()); // Track for the current day

                            createRemark(timetableId, bestSubject._id, `Assigned to general slot ${day} ${period}.`, 1);
                        } else {
                            // Teacher conflict found, need to skip or try next best subject
                            console.log(`Teacher conflict for slot ${slotKey}. Skipping.`);
                        }
                    } else {
                        console.log(`No suitable subject found for slot ${slotKey} for class ${clz.name}.`);
                    }
                }
            }
        }
        
        console.log("Timetable generation completed successfully.");
    } catch (error: any) {
        const errorMessage = `Error during timetable creation: ${error.message}`;
        console.error(errorMessage, error);
        throw new Error(errorMessage);
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

export const getPeriodByIdReq = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data: IPeriod = await getPeriodById(req.params.id);
        sendApiResponse(res, 'OK', data, 'Successfully fetched class');
    } catch (error) {
        if ((error as any).message === 'PeriodNotFound') {
            sendApiResponse(res, 'NOT FOUND', null, 'Period Not Found');
        } else {
            next(error); // Pass the error to the error-handling middleware for unexpected errors
        }
    }
};
export const getPeriodById = async (id: string | Types.ObjectId): Promise<IPeriod> => {
    const _data = await Period.findById(id)
        .sort({ 'name': 1 });

    if (!_data) {
        throw new Error('PeriodNotFound'); // Throw an error if the class is not found
    }

    const data: IPeriod = {
        ..._data.toObject(),

    };

    return data; // Return the data to the controller function
};


export const updatePeriod = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const _updatedPeriod = req.body;
        const prevPeriod = await Period.findById(req.params.id)
        // .populate('logo').populate('manager.img');
        if (!prevPeriod) {
            return sendApiResponse(res, 'NOT FOUND', null, 'Period Not Found');
        }


        const updatedPeriod = await Period.findByIdAndUpdate(req.params.id, _updatedPeriod);
        if (!updatedPeriod) {
            return sendApiResponse(res, 'CONFLICT', null, 'Period Not Updated');
        }

        sendApiResponse(res, 'OK', _updatedPeriod,
            `Period updated successfully`);
    } catch (error) {
        next(error);
    }
}

