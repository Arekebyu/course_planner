import { createRoot } from "react-dom/client";
import React from "react";
import Schedule from "./modules/Schedule"
import Courses from "./modules/Courses";
import Solver from "./modules/Solver";

function App() {
    function scheduleReducer(state, action) {
        switch (action.type) {
            case 'ADD_SEMESTER':
                return [...state, action.payload];
            case 'REMOVE_SEMESTER':
                return state.filter((_, index) => index !== action.payload);
            case 'UPDATE_SEMESTER':
                return state.map((semester, index) =>
                    index === action.payload.index ? action.payload.semester : semester
                );
            case 'SET_SEMESTERS':
                return action.payload;
            default:
                return state;
        }
    }
    function courseReducer(state, action) {
        switch (action.type) {
            case 'ADD_COURSE':
                return [...state, action.payload];
            case 'REMOVE_COURSE':
                return state.filter((_, index) => index !== action.payload);
            case 'UPDATE_COURSE':
                return state.map((course, index) =>
                    index === action.payload.index ? action.payload.course : course
                );
            case 'RESET':
                return [];
            default:
                return state;
        }
    }
    const [semesters, dispatchSemesters] = React.useReducer(scheduleReducer, []);
    const [course, dispatchCourses] = React.useReducer(courseReducer, []);

    return <>
        <Schedule semesters={semesters} dispatchSemesters={dispatchSemesters} />
        <Courses courses={course} dispatchCourses={dispatchCourses} />
        <Solver semesters={semesters} courses={course} dispatchSemesters={dispatchSemesters} dispatchCourses={dispatchCourses} />
    </>
}
const root = createRoot(document.getElementById('app'));
root.render(<App />);
