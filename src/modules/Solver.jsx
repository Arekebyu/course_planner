import React from "react";
import { generate_schedule } from "./generate.js";


export default function Solver({ semesters, courses, dispatchSemesters, dispatchCourses }) {
    function solve() {
        let cloned_semester = structuredClone(semesters);
        let desired_courses = structuredClone(courses);
        let taken = new Map();
        for (let semester_num = 0; semester_num < semesters.length; semester_num++) {
            for (let course_id = 0; course_id < semesters[semester_num].courses.length; ++course_id) {
                let course = semesters[semester_num].courses[course_id];
                if (taken.has(course)) {
                    continue;
                } else if (course !== "") {
                    taken.set(course, semester_num);
                }
            }
        }
        let schedule = generate_schedule(cloned_semester, desired_courses, taken);
        if (schedule === null) {
            return null;
        }
        const payload = {
            type: 'SET_SEMESTERS',
            payload: schedule
        };
        dispatchSemesters(payload);
        dispatchCourses({ type: 'RESET' });

    }

    return (
        <div className="solver">
            <button onClick={solve}>find schedule</button>
        </div>
    );
}