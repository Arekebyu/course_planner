import React, { useEffect } from "react";
import "./schedule.css";

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

    // React.useEffect(() => {
    // }, [semesters]);
    if (semesters.length === 0) {
        return (
            <div className="schedule">
                <p style={{ position: "absolute", left: "40%", top: "46%" }}>No semesters added yet. Please add a semester.</p>
                <SemesterAdder onAddSemester={ADD_SEMESTER} />
            </div>
        );
    }
    return (
        <>
            <div className="schedule">
                <SemestersList
                    semesters={semesters} changeSemester={UPDATE_SEMESTER} removeSemester={REMOVE_SEMESTER} />
            </div>
            <SemesterAdder onAddSemester={ADD_SEMESTER} />
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
    let [courseCount, setCourseCount] = React.useState(semester.courseCount);

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
            <div style={{ width: "100%", display: "flex", justifyContent: "flex-end" }}>
                <input
                    className="semesterName"
                    defaultValue={semester.name}
                    placeholder={"Sem " + (semester.index + 1)}
                    onChange={e => {
                        const updatedSemester = {
                            ...semester,
                            name: e.target.value
                        }
                        changeSemester(semester.index, updatedSemester);
                    }} />
                <button
                    className="removeSemester"
                    onClick={removeSemester}>
                    <svg fill="#ffffff" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff">
                        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                        <g id="SVGRepo_iconCarrier">
                            <path d="M697.4 759.2l61.8-61.8L573.8 512l185.4-185.4-61.8-61.8L512 450.2 326.6 264.8l-61.8 61.8L450.2 512 264.8 697.4l61.8 61.8L512 573.8z"></path>
                        </g>
                    </svg>
                </button>
            </div>
            <p style={{ margin: "0.2em 0em" }}> Max courses: &nbsp;
                <input
                    className="semesterCourseCount"
                    type="number"
                    min="0"
                    value={courseCount}
                    onChange={e => {
                        setCourseCount(Number(e.target.value));
                    }}
                    onKeyDown={e => {
                        if (e.key === "Enter") {
                            const updatedSemester = {
                                ...semester,
                                courseCount: courseCount
                            }
                            changeSemester(semester.index, updatedSemester);
                        }
                    }} />
            </p>
            {
                courses.map((course, index) => (
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
                ))
            }
        </div >
    );
}

function Course({ course, index, changeCourse }) {
    return (
        <div className="course">
            <input
                type="text"
                placeholder={"Course " + (index + 1)}
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
            <p>Name:</p >
            <input
                type="text"
                placeholder="Semester Name"
                value={name}
                onChange={e => setName(e.target.value)}
                style={{ width: "8.5em" }}
            />
            <p># Courses:</p>
            <input
                type="number"
                min="0"
                placeholder="Course Count"
                value={courseCount}
                onChange={e => {
                    setCourseCount(e.target.value)
                }}
                required
                style={{ width: "2em" }}
            />
            <button type="submit">Add Semester</button>
        </form>
    );
}
