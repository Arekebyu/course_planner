let scheduleContainer = document.getElementById('scheduleTable');
let courseList = document.getElementById('desired_course_list');

let course_adder = document.getElementById('add_course');
let semester_adder = document.getElementById('semester_adder');

let semesters = [];
let courses = new Map()

renderCourseList()

course_adder.addEventListener('click', () => {
    let manager = document.getElementById("management_container");
    manager.style.display = "flex";

    let course = document.getElementById("courseid");
    let offered = document.getElementById("offeredtimes");
    let prereq = document.getElementById("prerequisites");
    let coreq = document.getElementById("corequisites");

    let completitionButton = document.getElementById("finished_adding_button");

    function completion_handler() {
        addCourse(course.value, offered.value, prereq.value, coreq.value);

        manager.style.display = "none";
        completitionButton.removeEventListener('click', completion_handler)
    }
    completitionButton.addEventListener('click', completion_handler);
})

semester_adder.addEventListener('click', () => {

    addSemester();
    renderSemesters();
})

function addCourse(id, offered, prereq, coreq) {
    courses.set(id, { 'id': id, })
    if (offered !== '') {
        courses.get(id).offered = new Set(JSON.parse('[' + offered + ']'))
    }
    //might want to add a way for you to input without needing "" around each code
    if (prereq !== '') {
        courses.get(id).prereq = new Set(JSON.parse('[' + prereq + ']'))
    }
    if (coreq !== '') {
        courses.get(id).coreq = new Set(JSON.parse('[' + coreq + ']'))
    }
    renderCourseList()
}

function addSemester() {

}


// Dom management is kind of tedious without libraries lol
function renderCourseList() {
    courseList.innerHTML = "";
    courses.forEach((value, key, map) => {

        const id = key;
        const offerings = value.offered;
        const prereqs = value.prereq;
        const coreqs = value.coreq;

        let temp = document.createElement('p');

        let course = document.createElement('div');
        course.classList.add("course")

        let course_id = document.createElement('div');
        course_id.classList.add("course_id");
        temp.innerHTML = id;
        course_id.appendChild(temp);

        let course_requirements = document.createElement('div');
        course_requirements.classList.add("course_requirements");

        temp = document.createElement('p');
        temp.innerHTML += "prereqs: ";
        if ("prereq" in value) {
            for (const prereq of prereqs) {
                temp.innerHTML += prereq + " ";
            }
        } else {
            temp.innerHTML += "None";
        }
        course_requirements.appendChild(temp);

        temp = document.createElement('p');
        temp.innerHTML += "coreqs: ";
        if ("coreq" in value) {
            for (const coreq of coreqs) {
                console.log(coreq);
                temp.innerHTML += coreq + " ";
            }
        } else {
            temp.innerHTML += "None";
        }
        course_requirements.appendChild(temp);

        let offered_time = document.createElement('div');
        offered_time.classList.add("offered_time");
        temp = document.createElement('p');
        temp.innerHTML += "offered: ";
        if ("offered" in value) {
            for (const offer of offerings) {
                temp.innerHTML += offer + " ";
            }
        } else {
            temp.innerHTML += "None";
        }
        offered_time.appendChild(temp);


        course.appendChild(course_id);
        course.appendChild(course_requirements);
        course.appendChild(offered_time);
        courseList.prepend(course);
    });
}

function renderSemesters() {
    // removes everything except for the buttons.
    let retain = document.getElementById("sem_adder_container");
    scheduleContainer.innerHTML = "";
    for (semester of semesters) {
        let temp = document.createElement('div')
        temp.classList.add('table_entry');
        for (course of semester) {
            let c = document.createElement('input');
            c.classList.add('table_value');
            c.value = course;
            temp.appendChild(c);
        }
        scheduleContainer.appendChild(temp);
    }
    scheduleContainer.appendChild(retain)
}
renderSemesters()