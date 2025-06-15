import React from "react";

function generate_schedule(semesters, desired_courses, taken) {
    // base case
    if (desired_courses.length === 0) {
        return semesters;
    }
    nextcourse: for (let course_id = 0; course_id < desired_courses.length; ++course_id) {
        let course = desired_courses[course_id];
        let first_takable_sem = 0;
        for (let prereq_id = 0; "prereqs" in course && prereq_id < course.prereqs.length; ++prereq_id) {
            if (taken.has(course.prereqs[prereq_id])) {
                first_takable_sem = Math.max(first_takable_sem, taken.get(course.prereqs[prereq_id]) + 1);
            } else {
                continue nextcourse;
            }
        }
        for (let coreq_id = 0; "coreqs" in course && coreq_id < course.coreqs.length; ++coreq_id) {
            if (taken.has(course.coreqs[coreq_id])) {
                first_takable_sem = Math.max(first_takable_sem, taken.get(course.coreqs[coreq_id]));
            } else {
                continue nextcourse;
            }
        }
        for (let semester = semesters.length - 1; semester >= first_takable_sem; --semester) {
            let firstEmpty = semesters[semester].courses.findIndex((courseId) => courseId === "");
            if (firstEmpty === -1) {
                continue;
            } else if (!course.available_semesters.has(semester)) {
                continue;
            }
            let new_semesters = structuredClone(semesters);
            let new_desired_courses = structuredClone(desired_courses);
            let new_taken = structuredClone(taken);
            new_semesters[semester][firstEmpty] = course.id;
            new_desired_courses.splice(course_id, 1);
            new_taken.set(course.id, semester);
            return generate_schedule(new_semesters, new_desired_courses, new_taken);
        }
    }
    return null;
}

export default function Solver({ semesters, courses, dispatchSemesters, dispatchCourses }) {
    function solve() {
        let cloned_semester = structuredClone(semesters);
        let desired_courses = structuredClone(courses);
        let taken = new Map();
        console.log(cloned_semester)
        console.log(desired_courses);
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
        console.log(taken);
        console.log("going")
        let schedule = generate_schedule(cloned_semester, desired_courses, taken);
        console.log("done: ", schedule)
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
            <h2>Solver</h2>
            <button onClick={solve}>Solve Schedule</button>
        </div>
    );
}