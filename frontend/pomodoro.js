let horas = 0, minutos = 0, segundos = 0, centesimas = 0;
let tiempoTotalEnMinutos = 0;
let tiempoTotalEnSegundos = 0;
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

    tiempoTotalEnSegundos = horas * 3600 + minutos * 60 + segundos;
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

function continue_studying() {
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

function actualizarTiempoTotal() {
    tiempoTotalEnMinutos = horas * 60 + minutos;
}
/* 	INTENTO DE ENVIAR DATOS A UN SERVIDOR QUE NO ME SALIO ;C
function enviarTiempoDeEstudioAlServidor() {
    const urlDelServidor = "http://localhost:5000";

    const datosDeTiempo = {
        tiempoDeEstudio: tiempoTotalEnSegundos
    };

    fetch(urlDelServidor, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(datosDeTiempo)
    })
    .then(response => response.json())
    .then(data => {
        console.log("Datos enviados con éxito:", data);
    })
    .catch(error => {
        console.error("Error al enviar los datos:", error);
    });
}

function enviarDatosASesion() {
    actualizarTiempoTotal(); // Asegúrate de actualizar el tiempo total antes de enviar los datos
    const datos = {
        mins_studied: tiempoTotalEnMinutos // Envía el tiempo total en minutos
    };

    fetch('/guardar-sesion', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(datos),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

document.getElementById("start").addEventListener("click", start);
document.getElementById("stop").addEventListener("click", stop);
document.getElementById("continue").addEventListener("click", continue_studying);
document.getElementById("reset").addEventListener("click", reset);
document.getElementById("guardarSesion").addEventListener("click", enviarDatosASesion);
*/