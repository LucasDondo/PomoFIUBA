const BASE_URL = "http://localhost:5000";

function delete_course(id) {
    fetch(`${BASE_URL}/eliminar_curso_${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
    })
        .then(response => response.json())
        .then(document.getElementById(id).remove())
        .catch(error => console.error(error));
}

function edit_course(event) {
    event.preventDefault();
    const form_data = new FormData(event.target);
    const course = { "id": form_data.get("id"), "name": form_data.get("name"), "credits": form_data.get("credits") };

    fetch(`${BASE_URL}/editar_curso_${course.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(course) })
        .then(response => response.json())
        .then(build_course(course, document.getElementById(course.id)))
        .catch(error => console.error(error));
}

function start_editing_course(course) {
    const li = document.getElementById(course.id);
    li.innerHTML = `
        <form onsubmit="edit_course(event)">
          <input name="id" type="hidden" value="${course.id}"/>
          El curso se llama
          <input name="name" value="${course.name}" required>
          de
          <input name="credits" type="number" min="1" max="144" value="${course.credits}" required>
          créditos.
          <button type="submit">✔️</button>
        </form>`;
}

function build_course(course) {
    const container = document.getElementById(course.id);

    const delete_button = document.createElement("button");
    delete_button.innerHTML = "🗑️";
    delete_button.onclick = () => delete_course(course.id);

    const edit_button = document.createElement("button");
    edit_button.innerHTML = "✏️";
    edit_button.onclick = () => start_editing_course({ "id": course.id, "name": course.name, "credits": course.credits });

    container.innerHTML = `${course.name} (${course.credits} créditos)`;

    container.appendChild(edit_button);
    container.appendChild(delete_button);
}

function add_course_to_list(courses_list, course, new_course_form) {
    const li = document.createElement("li");
    courses_list.insertBefore(li, new_course_form);
    li.id = `${course.id}`;
    build_course(course);
}

function show_courses(courses) {
    const courses_list = document.getElementById("courses_list");
    const new_course_form = document.getElementById("new_course_form");
    for (let i = 0; i < courses.length; i++) {
        add_course_to_list(courses_list, courses[i], new_course_form);
    }
}

function create_new_course(event) {
    event.preventDefault();
    const new_course = new FormData(event.target);
    const new_course_name = new_course.get("name");
    const new_course_credits = new_course.get("credits");
    fetch(`${BASE_URL}/nuevo_curso`, {
        method: "POST",
        body: JSON.stringify({
            name: new_course_name,
            credits: new_course_credits
        }),
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(response => response.json())
        .then(content => content.course)
        .then(course => {
            add_course_to_list(document.getElementById("courses_list"), course, document.getElementById("new_course_form"));
        })
        .catch(error => console.error(error));
}

function set_plural_or_singular() {
    const credits = document.getElementById("credits");
    if (credits.value == 1) {
        document.getElementById("plural").style.display = "none";
    } else {
        document.getElementById("plural").style.display = "inline-block";
    }
}

fetch(`${BASE_URL}/cursos`).then(response => response.json()).then(show_courses).catch(error => console.error(error));
set_plural_or_singular();