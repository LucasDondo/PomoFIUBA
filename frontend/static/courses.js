const BASE_URL = "http://localhost:5000";

function deleteCourse(id) {
    fetch(`${BASE_URL}/delete_course_${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
    })
        .then(response => response.json())
        .then(document.getElementById(id).remove())
        .catch(error => console.error(error));
}

function editCourse(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const course = { "id": formData.get("id"), "name": formData.get("name"), "credits": formData.get("credits") };

    fetch(`${BASE_URL}/edit_course_${course.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(course) })
        .then(response => response.json())
        .then(buildCourse(course, document.getElementById(course.id)))
        .catch(error => console.error(error));
}

function startEditingCourse(course) {
    const li = document.getElementById(course.id);
    li.innerHTML = `
        <form onsubmit="editCourse(event)">
          <input name="id" type="hidden" value="${course.id}"/>
          El curso se llama
          <input name="name" value="${course.name}" required>
          de
          <input name="credits" type="number" min="1" max="144" value="${course.credits}" required>
          créditos.
          <button type="submit">✔️</button>
        </form>`;
}

function buildCourse(course) {
    const container = document.getElementById(course.id);

    const deleteButton = document.createElement("button");
    deleteButton.innerHTML = "🗑️";
    deleteButton.onclick = () => deleteCourse(course.id);

    const editButton = document.createElement("button");
    editButton.innerHTML = "✏️";
    editButton.onclick = () => startEditingCourse({ "id": course.id, "name": course.name, "credits": course.credits });

    container.innerHTML = `${course.name} (${course.credits} créditos)`;

    container.appendChild(editButton);
    container.appendChild(deleteButton);
}

function addCourseToList(coursesList, course, newCourseForm) {
    const li = document.createElement("li");
    coursesList.insertBefore(li, newCourseForm);
    li.id = `${course.id}`;
    buildCourse(course);
}

function showCourses(courses) {
    const coursesList = document.getElementById("courses_list");
    const newCourseForm = document.getElementById("new_course_form");
    for (let i = 0; i < courses.length; i++) {
        addCourseToList(coursesList, courses[i], newCourseForm);
    }
}

function createNewCourse(event) {
    event.preventDefault();

    const newCourse = new FormData(event.target);
    const newCourseName = newCourse.get("name");
    const newCourseCredits = newCourse.get("credits");

    fetch(`${BASE_URL}/new_course`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "name": newCourseName,
            "credits": newCourseCredits
        })
    })
        .then(response => response.json())
        .then(content => content.course)
        .then(course => {
            addCourseToList(document.getElementById("courses_list"), course, document.getElementById("new_course_form"));
        })
        .catch(error => console.error(error));
}

// function setPluralOrSingular() {
//     const credits = document.getElementById("credits");
//     if (credits.value == 1) {
//         document.getElementById("plural").style.display = "none";
//     } else {
//         document.getElementById("plural").style.display = "inline-block";
//     }
// }

fetch(`${BASE_URL}/courses`).then(response => response.json()).then(showCourses).catch(error => console.error(error));
// setPluralOrSingular();