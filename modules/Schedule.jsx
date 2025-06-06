export function Semester({ semester }) {
    <div className="semester" id={"semester_" + semester.name} key={semester.id}>
        <button className="removeSemester" onClick={() => {
            removeSemester(semester.name);
        }}>x</button>
        <h1 className="semesterName">{semester.name}</h1>
        <input className="semesterCourseCount" value={semester.courseCount}></input>
        {semester.courses.map((course, index) => (
            <div className="course" key={index}>
                <input value={course}></input>
            </div>
        ))}
    </div>
}

function removeSemester(semesterName) {
    const semesterElement = document.getElementById("semester_" + semesterName);
    if (semesterElement) {
        semesterElement.remove();
    }
    // Additional logic to update the state or notify parent component can be added here
}