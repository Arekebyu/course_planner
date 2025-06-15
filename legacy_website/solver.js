/*
semesters: vector<set<string>>

desired_courses: vector<Course>

Class course {
    id: String
    prereqs: vector<String>
    coreq: vector<String>
    available_semesters: Set<int>
}

taken: Map<string, int>
*/

sem = [new Set(['Math137', 'Math145', 'Cs135', 'Phys121', 'Commst223']), new Set(), new Set()]
desired_courses = [
    // { 'id': 'Math148', 'prereqs': ['Math137'], 'offered': new Set([0, 1, 2, 3, 4, 5]) },
    { 'id': 'Math146', 'prereqs': ['Math145'], 'offered': new Set([0, 1, 2, 3, 4, 5]) },
    { 'id': 'Math148', 'prereqs': ['Math137'], 'offered': new Set([0, 1, 2, 3, 4, 5]) },
    { 'id': 'Math247', 'prereqs': ['Math146', 'Math148'], 'offered': new Set([0, 1, 2, 3, 4, 5]) },
]

taken = new Map([
    ['Math137', 0],
    ['Math145', 0],
    ['Cs135', 0],
    ['Phys121', 0],
    ['Commst223', 0]])

console.log(generate_schedule(sem, desired_courses, taken, [5, 5, 5]));

function generate_schedule(semesters, desired_courses, taken, max_courses_per_sem) {
    // base case
    if (desired_courses.length === 0) {
        return semesters;
    }
    nextcourse: for (let course_id = 0; course_id < desired_courses.length; ++course_id) {
        let course = desired_courses[course_id];
        let first_takable_sem = 0;
        for (let prereq_id = 0; "prereqs" in course && prereq_id < course.prereqs.length; ++prereq_id) {
            // if prerequisite has been taken, then we find the last semester of all prerequisite courses.
            if (taken.has(course.prereqs[prereq_id])) {
                first_takable_sem = Math.max(first_takable_sem, taken.get(course.prereqs[prereq_id]) + 1)
            }
            // otherwise the prerequisite hasnt been taken and so the course cannot be taken either.
            else {
                continue nextcourse;
            }
        }
        for (let coreq_id = 0; "coreqs" in course && coreq_id < course.coreqs.length; ++coreq_id) {
            if (taken.has(course.coreqs[coreq_id])) {
                first_takable_sem = max(first_takable_sem, taken[course.coreqs[coreq_id]])
            } else {
                continue nextcourse;
            }
        }
        for (let semester = semesters.length - 1; semester >= first_takable_sem; --semester) {
            if (semesters[semester].size === max_courses_per_sem[semester]) {
                continue;
            } else if (!course.offered.has(semester)) {
                continue;
            }
            let new_semesters = structuredClone(semesters)
            let new_desired_courses = structuredClone(desired_courses)
            let new_taken = structuredClone(taken)
            new_semesters[semester].add(course.id)
            new_desired_courses.splice(course.id, 1)
            new_taken.set(course.id, semester)
            let generated = generate_schedule(new_semesters, new_desired_courses, new_taken, max_courses_per_sem);
            if (generated != null) {
                return generated;
            }
        }
    }
    return null;
}