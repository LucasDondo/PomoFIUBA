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
