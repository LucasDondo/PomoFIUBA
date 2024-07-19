/*
const BASE_URL = "http://localhost:5000";

function foo(vari) {
    console.log(String(vari));
}

fetch(`${BASE_URL}/cursos`).then(response => response.json()).then(foo);
*/
// Define la URL base de la API
const BASE_URL = "http://localhost:5000";


function foo(vari) {
    console.log("Datos recibidos:", vari);
}


function handleError(error) {
    console.error("Error en la solicitud:", error);
}


fetch(`${BASE_URL}/cursos`)
    .then(response => {
        
        if (!response.ok) {
            
            throw new Error(`Error HTTP: ${response.status}`);
        }

        return response.json();
    })
    .then(foo) 
    .catch(handleError); 