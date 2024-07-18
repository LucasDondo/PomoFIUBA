const BASE_URL = "http://localhost:5000";

function foo(vari) {
    console.log(String(vari));
}

fetch(`${BASE_URL}/cursos`).then(response => response.json()).then(foo);