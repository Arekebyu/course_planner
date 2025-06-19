import React from "react";

export default function Courses({ courses, dispatchCourses }) {
    function ADD_COURSE(course) {
        const payload = {
            type: 'ADD_COURSE',
            payload: {
                ...course,
                index: courses.length
            }
        };
        dispatchCourses(payload);
    }

    function REMOVE_COURSE(index) {
        const payload = {
            type: 'REMOVE_COURSE',
            payload: index
        };
        dispatchCourses(payload);
    }

    function UPDATE_COURSE(index, updatedCourse) {
        const payload = {
            type: 'UPDATE_COURSE',
            payload: {
                index,
                course: updatedCourse
            }
        };
        dispatchCourses(payload);
    }

    courses.map((course, index) => {
        course.index = index;
    });

    React.useEffect(() => {
    }, [courses]);

    return (
        <div className="courses">
            <CoursesList
                courses={courses} changeCourse={UPDATE_COURSE} removeCourse={REMOVE_COURSE} />
            <CourseAdder onAddCourse={ADD_COURSE} />
        </div>
    );
}

function CoursesList({ courses, changeCourse, removeCourse }) {
    return (
        <>
            {courses.map((course, key) => (
                <Course
                    key={key}
                    course={course}
                    changeCourse={changeCourse}
                    removeCourse={removeCourse}
                />
            ))}
        </>
    );
}

function Course({ course, changeCourse, removeCourse }) {
    const [courseName, setCourseName] = React.useState(course.id);
    const [prereqs, setPrereqs] = React.useState(course.prereqs.join(", "));
    const [coreq, setCoreq] = React.useState(course.coreq.join(", "));
    const [availableSemesters, setAvailableSemesters] = React.useState(Array.from(course.available_semesters).join(", "));

    const handleUpdate = () => {
        changeCourse(course.index, {
            ...course,
            id: courseName,
            prereqs: prereqs.split(",").map(p => p.trim()),
            coreq: coreq.split(",").map(c => c.trim()),
            available_semesters: new Set(availableSemesters === "" ? [] : availableSemesters.split(",").map(s => parseInt(s.trim())))
        });
    };
    React.useEffect(handleUpdate, [courseName, prereqs, coreq, availableSemesters]);

    return (
        <div className="course">
            <input
                type="text"
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
                placeholder="Course Name"
            />
            <input
                type="text"
                value={prereqs}
                onChange={(e) => setPrereqs(e.target.value)}
                placeholder="Prerequisites (comma separated)"
            />
            <input
                type="text"
                value={coreq}
                onChange={(e) => setCoreq(e.target.value)}
                placeholder="Corequisites (comma separated)"
            />
            <input
                type="text"
                value={availableSemesters}
                onChange={(e) => setAvailableSemesters(e.target.value)}
                placeholder="Available Semesters (comma separated)"
            />
            {/* <button onClick={handleUpdate}>Update Course</button> */}
            <button onClick={() => removeCourse(course.index)}>Remove Course</button>
        </div>
    );
}

function CourseAdder({ onAddCourse, onremoveCourse }) {
    const [courseName, setCourseName] = React.useState("");

    const handleAddCourse = () => {
        if (courseName.trim() !== "") {
            onAddCourse({ id: courseName, prereqs: [], coreq: [], available_semesters: new Set() });
            setCourseName("");
        }
    };

    return (
        <div className="course-adder">
            <input
                type="text"
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
                placeholder="Add a course"
            />
            <button onClick={handleAddCourse}>Add Course</button>
        </div>
    );
}