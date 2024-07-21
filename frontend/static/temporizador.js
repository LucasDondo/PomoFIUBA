let horas = 0, minutos = 0, segundos = 0, centesimas = 0;
let cronometroInterval;

function iniciarCronometro() {
    centesimas++;
    if (centesimas > 99) {
        centesimas = 0;
        segundos++;
        if (segundos > 59) {
            segundos = 0;
            minutos++;
            if (minutos > 59) {
                minutos = 0;
                horas++;
            }
            document.getElementById("Minutos").innerHTML = minutos < 10 ? "0" + minutos : minutos;
        }
        document.getElementById("Segundos").innerHTML = segundos < 10 ? "0" + segundos : segundos;
    }
    document.getElementById("Centesimas").innerHTML = centesimas < 10 ? "0" + centesimas : centesimas;
}

function start() {
    cronometroInterval = setInterval(iniciarCronometro, 10);
    document.getElementById("start").disabled = true;
    document.getElementById("stop").disabled = false;
    document.getElementById("reset").disabled = false;
}

function stop() {
    clearInterval(cronometroInterval);
    document.getElementById("stop").disabled = true;
    document.getElementById("continue").disabled = false;
}

function continueReloj() {
    cronometroInterval = setInterval(iniciarCronometro, 10);
    document.getElementById("continue").disabled = true;
    document.getElementById("stop").disabled = false;
}

function reset() {
    clearInterval(cronometroInterval);
    horas = 0;
    minutos = 0;
    segundos = 0;
    centesimas = 0;
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
        const minsStudied = parseInt(document.getElementById('Minutos').textContent); // Obtener los minutos estudiados del front

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

