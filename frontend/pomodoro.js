var centesimas = 0;
var segundos = 0;
var minutos = 0;
var horas = 0;

function start() {
	control = setInterval(cronometro, 10);
	document.getElementById("start").disabled = true;
	document.getElementById("stop").disabled = false;
	document.getElementById("continue").disabled = true;
}

function stop() {
	clearInterval(control);
	document.getElementById("stop").disabled = true;
	document.getElementById("continue").disabled = false;
}

function reinicio() {
	clearInterval(control);
	centesimas = 0;
	segundos = 0;
	minutos = 0;
	horas = 0;
	Centesimas.innerHTML = "00";
	Segundos.innerHTML = "00";
	Minutos.innerHTML = "00";
	Horas.innerHTML = "00";
	document.getElementById("inicio").disabled = false;
	document.getElementById("parar").disabled = true;
	document.getElementById("continuar").disabled = true;
	document.getElementById("reinicio").disabled = true;
}

function cronometro() {
	if (centesimas < 99) {
		centesimas++;
		if (centesimas < 10) { centesimas = "0" + centesimas }
		Centesimas.innerHTML = centesimas;
	}
	if (centesimas == 99) {
		centesimas = -1;
	}
	if (centesimas == 0) {
		segundos++;
		if (segundos < 10) { segundos = "0" + segundos }
		Segundos.innerHTML = segundos;
	}
	if (segundos == 59) {
		segundos = -1;
	}
	if ((centesimas == 0) && (segundos == 0)) {
		minutos++;
		if (minutos < 10) { minutos = "0" + minutos }
		Minutos.innerHTML = minutos;
	}
	if (minutos == 59) {
		minutos = -1;
	}
	if ((centesimas == 0) && (segundos == 0) && (minutos == 0)) {
		horas++;
		if (horas < 10) { horas = "0" + horas }
		Horas.innerHTML = horas;
	}
}

/*
let hr = "0" + 0, min = "0" + 0, sec = "0" + 0, ms = "0" + 0, startTimer;

const startBtn = document.querySelector(".start"),
			stopBtn = document.querySelector(".stop"),
			resetBtn = document.querySelector(".reset");

startBtn.addEventListener("click", start);
stopBtn.addEventListener("click", stop);
resetBtn.addEventListener("click", reset);

function start() {
		startBtn.classList.add("active");
		stopBtn.classList.add("stopActive"); // Asumiendo que quieres agregar esta clase aquí

		startTimer = setInterval(() => {
				ms++;
				ms = ms < 10 ? "0" + ms : ms;

				if (ms == 100) {
						sec++;
						sec = sec < 10 ? "0" + sec : sec;
						ms = "0" + 0;
				}
				if (sec == 60) {
						min++;
						min = min < 10 ? "0" + min : min;
						sec = "0" + 0;
				}
				if (min == 60) {
						hr++;
						hr = hr < 10 ? "0" + hr : hr;
						min = "0" + 0;
				}

				putValue();

		}, 10);
}

function stop() {
		startBtn.classList.remove("active");
		stopBtn.classList.add("stopActive"); // Corregido para mantener consistencia
		clearInterval(startTimer);
}

function reset() {
		clearInterval(startTimer);
		startBtn.classList.remove("active");
		stopBtn.classList.remove("stopActive"); // Asegurarse de remover la clase correcta
		hr = min = sec = ms = "0" + 0;
		putValue();
}

function putValue() {
		document.querySelector('.millisecond').innerHTML = ms;
		document.querySelector('.second').innerHTML = sec;
		document.querySelector('.minute').innerHTML = min;
		document.querySelector('.hour').innerHTML = hr;
}
*/