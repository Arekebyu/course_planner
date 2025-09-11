export function generate_schedule(semesters, desired_courses, taken) {
    if (desired_courses.length === 0) {
        return semesters;
    }
    nextcourse: for (let course_id = 0; course_id < desired_courses.length; ++course_id) {
        let course = desired_courses[course_id];
        let first_takable_sem = 0;
        for (let prereq_id = 0; "prereqs" in course && prereq_id < course.prereqs.length; ++prereq_id) {
            if (course.prereqs[prereq_id] === "") {
                continue;
            }
            if (taken.has(course.prereqs[prereq_id])) {
                first_takable_sem = Math.max(first_takable_sem, taken.get(course.prereqs[prereq_id]) + 1);
            } else {
                continue nextcourse;
            }
        }
        for (let coreq_id = 0; "coreqs" in course && coreq_id < course.coreqs.length; ++coreq_id) {
            if (course.coreqs[coreq_id] === "") {
                continue;
            }
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
            } else if (course.available_semesters.size != 0 && !course.available_semesters.has(semester)) {
                continue;
            }
            let new_semesters = structuredClone(semesters);
            let new_desired_courses = structuredClone(desired_courses);
            let new_taken = structuredClone(taken);
            new_semesters[semester].courses[firstEmpty] = course.id;
            new_desired_courses.splice(course_id, 1);
            new_taken.set(course.id, semester);
            return generate_schedule(new_semesters, new_desired_courses, new_taken);
        }
    }
    return null;
}