let scheduleDisplay = document.getElementById('scheduleContainer');
let courseList = document.getElementById('desired_course_list');

let course_adder = document.getElementById('add_course');

let courses = {}

// Dom management is kind of tedious without libraries lol
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
    /*
            <!-- <div class="course">
                <div class="course_id">
                    <p>Class123</p>
                </div>
                <div class="course_requirements">
                    <button>Course Requirements</button>
                </div>
                <div class="offered_time">
                    <p> Offered: </p>
                    <p> F2024 </p>

                </div>
            </div> -->
    */
})

function addCourse(id, offered, prereq, coreq) {


    courses[id] = {
        'id': id,
    };
    if (offered !== '') {
        courses[id].offered = new Set(JSON.parse('[' + offered + ']'))
    }
    //might want to add a way for you to input without needing "" around each code
    if (prereq !== '') {
        courses[id].prereq = new Set(JSON.parse('[' + prereq + ']'))
    }
    if (coreq !== '') {
        courses[id].coreq = new Set(JSON.parse('[' + coreq + ']'))
    }

    let temp = document.createElement('p')

    let course = document.createElement('div');
    course.classList.add("course")

    let course_id = document.createElement('div');
    course_id.classList.add("course_id");
    temp.innerHTML = id;
    course_id.appendChild(temp);

    temp = document.createElement('p')
    let course_requirements = document.createElement('div');
    course_requirements.classList.add("course_requirements")
    temp.innerhtml = coreq;
    course_requirements.appendChild(temp);
    temp.innerhtml = prereq
    course_requirements.appendChild(temp);

    let offered_time = document.createElement('div');
    offered_time.classList.add("offered_time");
    course.appendChild(course_id);
    course.appendChild(course_requirements);
    courseList.appendChild(course);
}