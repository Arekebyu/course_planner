import React, { useEffect } from "react";


export default function Schedule({ semesters, dispatchSemesters }) {
    function ADD_SEMESTER(semester) {
        const payload = {
            type: 'ADD_SEMESTER',
            payload: {
                ...semester,
                index: semesters.length
            }
        };
        dispatchSemesters(payload);
    }

    function REMOVE_SEMESTER(index) {
        const payload = {
            type: 'REMOVE_SEMESTER',
            payload: index
        };
        dispatchSemesters(payload);
    }

    function UPDATE_SEMESTER(index, updatedSemester) {
        const payload = {
            type: 'UPDATE_SEMESTER',
            payload: {
                index,
                semester: updatedSemester
            }
        };
        dispatchSemesters(payload);
    }

    semesters.map((semester, index) => {
        semester.index = index;
    });

    React.useEffect(() => {
        // const scheduleDiv = document.querySelector('.schedule');
        // if (scheduleDiv) {
        //     while (scheduleDiv.firstChild) {
        //         scheduleDiv.removeChild(scheduleDiv.firstChild);
        //     }
        // }
    }, [semesters]);
    return (
        <>
            <div className="schedule">
                <SemestersList
                    semesters={semesters} changeSemester={UPDATE_SEMESTER} removeSemester={REMOVE_SEMESTER} />
                <SemesterAdder onAddSemester={ADD_SEMESTER} />
            </div>
        </>
    );
}
function SemestersList({ semesters, changeSemester, removeSemester }) {
    return <>
        {semesters.map((semester, key) => (
            <Semester
                semester={semester}
                key={key}
                changeSemester={changeSemester}
                removeSemester={() => removeSemester(semester.index)}
            />
        ))}
    </>
}

function Semester({ semester, changeSemester, removeSemester }) {
    let courses = Array.from({ length: Number(semester.courseCount) }, (_, i) => semester.courses[i] || "");

    React.useEffect(() => {
        if (courses.length !== semester.courses.length) {
            const updatedSemester = {
                ...semester,
                courses: courses
            };
            changeSemester(semester.index, updatedSemester);
        }
    }, [semester.courseCount]);

    return (
        <div
            className="semester"
            id={"semester_" + semester.index}
            key={semester.id}>
            <button
                className="removeSemester"
                onClick={removeSemester}
            >x</button>
            <input
                className="semesterName"
                defaultValue={semester.name}
                onChange={e => {
                    const updatedSemester = {
                        ...semester,
                        name: e.target.value
                    }
                    changeSemester(semester.index, updatedSemester);
                }} />
            <input
                className="semesterCourseCount"
                type="number"
                min="0"
                value={semester.courseCount}
                onChange={e => {
                    const updatedSemester = {
                        ...semester,
                        courseCount: Number(e.target.value)
                    }
                    changeSemester(semester.index, updatedSemester);
                }} />
            {courses.map((course, index) => (
                <Course
                    key={index}
                    course={course}
                    index={index}
                    changeCourse={(newCourse, index) => {
                        const updatedCourses = [...semester.courses];
                        updatedCourses[index] = newCourse;
                        const updatedSemester = {
                            ...semester,
                            courses: updatedCourses
                        };
                        changeSemester(semester.index, updatedSemester);
                    }}
                />
            ))}
        </div>
    );
}

function Course({ course, index, changeCourse }) {
    return (
        <div className="course">
            <input
                type="text"
                placeholder="Course Name"
                value={course}
                onChange={e => {
                    changeCourse(e.target.value, index);
                }}
            />
        </div>
    );
}

function SemesterAdder({ onAddSemester }) {
    const [name, setName] = React.useState("");
    const [courseCount, setCourseCount] = React.useState(1);

    const handleSubmit = (e) => {
        e.preventDefault();
        onAddSemester({
            name,
            courseCount: Number(courseCount),
            courses: Array(Number(courseCount)).fill("")
        });
        setName("");
        setCourseCount(1);
    };

    return (
        <form className="semester-adder" onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Semester Name"
                value={name}
                onChange={e => setName(e.target.value)}
            />
            <input
                type="number"
                min="0"
                placeholder="Course Count"
                value={courseCount}
                onChange={e => setCourseCount(e.target.value)}
                required
            />
            <button type="submit">Add Semester</button>
        </form>
    );
}
