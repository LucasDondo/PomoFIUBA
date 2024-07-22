const BASE_URL = "http://localhost:5000";
const INIT_TIMES = 0, ZERO = "0", DOUBLE_ZERO = "00";
let hours = INIT_TIMES, mins = INIT_TIMES, secs = INIT_TIMES, hundredths = INIT_TIMES;
let intervalId, sessionId;
let playing = false;

function loop() {
    hundredths++;
    if (hundredths > 99) {
        hundredths = INIT_TIMES;
        secs++;
        if (secs > 59) {
            secs = INIT_TIMES;
            mins++;
            saveSession(mins);
            if (mins > 59) {
                mins = INIT_TIMES;
                hours++;
            }
        }
    }

    const hoursElem = document.getElementById("hours");
    const minsElem = document.getElementById("mins");
    const secsElem = document.getElementById("secs");
    const hundredthsElem = document.getElementById("hundredths");

    if (hoursElem && minsElem && secsElem && hundredthsElem) {
        minsElem.innerHTML = mins < 10 ? ZERO + mins : mins;
        secsElem.innerHTML = secs < 10 ? ZERO + secs : secs;
        hundredthsElem.innerHTML = hundredths < 10 ? ZERO + hundredths : hundredths;
    } else {
        console.error("Not all time elements (hours, mins, secs and hundredths) appear in the HTML document.");
    }
}

function changeStatus() {
    if (!playing) {
        intervalId = setInterval(loop, 10);
        playing = true;
    } else if (playing) {
        clearInterval(intervalId);
        playing = false;
    }
}

function reset() {
    clearInterval(intervalId);
    hours = INIT_TIMES, mins = 5, secs = 59, hundredths = INIT_TIMES;

    document.getElementById("hours").innerHTML = DOUBLE_ZERO;
    document.getElementById("mins").innerHTML = DOUBLE_ZERO;
    document.getElementById("secs").innerHTML = DOUBLE_ZERO;
    document.getElementById("hundredths").innerHTML = DOUBLE_ZERO;
}

function createSession(courseId, minsStudied) {
    fetch(`${BASE_URL}/new_session`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "course_id": courseId,
            "mins_studied": minsStudied
        })
    })
        .then(response => response.json())
        .then(data => {
            if (data.session) {
                sessionId = data.session.id;
            } else {
                throw new Error("Error while creating the new session. No session object was returned.");
            }
        })
        .catch(error => {
            console.error(error);
            alert("Ocurrió un error al crear la sesión. Seguí estudiando, a ver si se resuelve.");
        });
}

function editSession(id, minsStudied) {
    fetch(`${BASE_URL}/edit_session`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "id": id,
            "mins_studied": minsStudied
        })
    })
        .then(response => response.json())
        .catch(error => {
            console.error(error);
            alert("Ocurrió un error al editar la sesión. Seguí estudiando, a ver si se resuelve.");
        });
}

function saveSession(minsStudied) {
    const courseId = document.getElementById('course-select').value;

    if (minsStudied > 0) {
        if (sessionId) {
            editSession(sessionId, minsStudied);
        } else {
            createSession(courseId, minsStudied);
        }
    } else {
        console.error("To save the session, the studying time must be of at least a minute.");
    }
}

function loadCourses() {
    fetch(`${BASE_URL}/courses`)
        .then(response => response.json())
        .then(data => {
            const courseSelect = document.getElementById('course-select');
            data.forEach(course => {
                const option = document.createElement('option');
                option.value = course.id;
                option.textContent = course.name;
                courseSelect.appendChild(option);
            });
        })
        .catch(error => console.error(error));
}

loadCourses();