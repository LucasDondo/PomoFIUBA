let hours = 0, mins = 0, secs = 0, hundredths = 0;

function loop() {
    hundredths++;
    if (hundredths > 99) {
        hundredths = 0;
        secs++;
        if (secs > 59) {
            secs = 0;
            mins++;
            if (mins > 59) {
                mins = 0;
                hours++;
            }
            document.getElementById("Minutos").innerHTML = mins < 10 ? "0" + mins : mins;
        }
        document.getElementById("Segundos").innerHTML = secs < 10 ? "0" + secs : secs;
    }
    document.getElementById("Centesimas").innerHTML = hundredths < 10 ? "0" + hundredths : hundredths;
}

function start() {
    interval_id = setInterval(loop, 10);
    document.getElementById("start").disabled = true;
    document.getElementById("stop").disabled = false;
    document.getElementById("reset").disabled = false;
}

function stop() {
    clearInterval(interval_id);
    document.getElementById("stop").disabled = true;
    document.getElementById("continue").disabled = false;
}

function continue_pomodoro() {
    interval_id = setInterval(loop, 10);
    document.getElementById("continue").disabled = true;
    document.getElementById("stop").disabled = false;
}

function reset() {
    clearInterval(interval_id);
    hours = 0;
    mins = 0;
    secs = 0;
    hundredths = 0;
    document.getElementById("Horas").innerHTML = "00";
    document.getElementById("Minutos").innerHTML = "00";
    document.getElementById("Segundos").innerHTML = "00";
    document.getElementById("Centesimas").innerHTML = "00";
    document.getElementById("start").disabled = false;
    document.getElementById("stop").disabled = true;
    document.getElementById("continue").disabled = true;
    document.getElementById("reset").disabled = true;
}

document.addEventListener('DOMContentLoaded', function() {
    // Función para obtener y cargar los cursos en el select
    function fetchCourses() {
        fetch('http://localhost:5000/cursos') // Asegúrate de usar la URL completa si estás ejecutando el frontend en un puerto diferente
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
            .catch(error => {
                console.error('Error:', error);
            });
    }

    fetchCourses(); // Cargar los cursos al cargar la página

    const form = document.getElementById('session-form');
    
    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevenir el envío por defecto del formulario

        const courseId = document.getElementById('course-select').value;
        const minsStudied = parseInt(document.getElementById('Minutos').textContent); // Obtener los mins estudiados del front

        // Verificar que se haya seleccionado un curso
        if (!courseId) {
            alert('Por favor, selecciona un curso.');
            return;
        }

        fetch('http://localhost:5000/nueva_sesion', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                course_id: courseId,
                mins_studied: minsStudied
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                alert(data.message); // Muestra el mensaje de error si existe
            } else {
                console.log(data.session); // Muestra los datos de la sesión creada
                // Aquí puedes hacer otras acciones, como actualizar la interfaz
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });
});
