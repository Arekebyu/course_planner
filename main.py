from ortools.sat.python import cp_model

class CourseScheduler(cp_model.CpModel):
    def __init__(self, taken_courses, desired_courses, terms):
        '''
        Take a look at the example to see how to initialize.
        '''
        super().__init__()
        self.taken_courses = taken_courses
        self.desired_courses = desired_courses
        self.terms = terms
        self.enroll_vars = {} 
        self._create_variable()
        self._add_constraints()

    def _create_variable(self):
        for course in self.desired_courses:
            self.enroll_vars[course] = {}
            for term in self.terms:
                self.enroll_vars[course][term] = self.NewBoolVar(f'enroll_{course}_{term}')
    
    def _add_constraints(self):
        for course in self.desired_courses:
            self.AddExactlyOne(self.enroll_vars[course].values())
            if 'terms_offered' in self.desired_courses[course]:
                for term in self.terms:
                    if term not in self.desired_courses[course]['terms_offered']:
                        self.Add(self.enroll_vars[course][term] == 0)
            if 'prerequisites' in course:
                for prereq_id in self.desired_courses[course]['prerequisites']:
                    if prereq_id not in self.taken_courses:
                        for term_b_index, term_b in enumerate(self.terms):
                            for term_a_index, term_a in enumerate(self.terms):
                                if term_a_index >= term_b_index:
                                    self.AddImplication(self.enroll_vars[course][term_b], self.enroll_vars[prereq_id][term_a].Not())    
            if 'corequisitess' in course:
                for coreq_id in desired_courses[course]['coreqs']:
                    if coreq_id not in self.taken_courses:
                        for term_b_index, term_b in enumerate(self.terms):
                            for term_a_index, term_a in enumerate(self.terms):
                                if term_a_index > term_b_index:
                                    self.AddImplication(self.enroll_vars[course][term_b], self.enroll_vars[coreq_ids][term_a].Not())
        for term in self.terms:
            courses_in_term = []
            for course in self.desired_courses:
                if course in self.enroll_vars and term in self.enroll_vars[course]:
                    courses_in_term.append(self.enroll_vars[course][term])

            if courses_in_term:
                self.Add(sum(courses_in_term) <= 7)


# Example Data
taken_courses = {'MATH145', 'MATH147', 'CS135'}
# optionally add corequisites parameter to each section if needed
desired_courses = {
    "CS136": {"prerequisites": ["CS135"], "terms_offered": ["W2025",  "S2025"]},
    "MATH148": {"prerequisites": ["MATH147"], "terms_offered": ["W2025"]},
    "MATH146": {"prerequisites": ["MATH145"], "terms_offered": ["W2025"]},
    "MATH245": {"prerequisites": ["MATH146"], "terms_offered": ["F2025"]},
    "MATH247": {"prerequisites": ["MATH146, MATH148"], "terms_offered": ["F2025"]},
}
sequence = ["F2024", "W2025", "F2025", "S2026", "W2026", "F2027", "S2028", "W2029"]

# Solve
model = CourseScheduler(taken_courses, desired_courses, sequence)
solver = cp_model.CpSolver()
status = solver.Solve(model)

semester = {}
for term in sequence:
    semester[term] = []
if status == cp_model.OPTIMAL or status == cp_model.FEASIBLE:
    print("Solution found:")
    for course in desired_courses:
        for term, var in model.enroll_vars[course].items():
            if solver.Value(var) == 1:             
                semester[term].append(course)

else:
    print("No solution found.")
    exit

for sem in semester:
    print(f'\n{sem}')
    for course in semester[sem]:
        print(course)
    

