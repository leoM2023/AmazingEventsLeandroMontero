let urlData = 'https://mindhub-xj03.onrender.com/api/amazing'

async function traerDataEventos() {
    let todosLosEventos;
    let eventosJson;
    try {
        todosLosEventos = await fetch(urlData);
        eventosJson = await todosLosEventos.json();
        return eventosJson;
    }
    catch (error) {
        console.log("Error 1")
    }
}

const panelDeFiltros = document.querySelector(".panelFiltros")
const inputTexto = document.querySelector("#texto");
const contenedorDeTarjetas = document.querySelector(".contenedorTarjetas");
let arregloDeCheckBox=""

traerDataEventos().then((datos) => {
    data = datos;
    panelDeFiltros.innerHTML = crearFiltros(listarCategoriasDisponibles(data.events));
    arregloDeCheckBox = document.querySelectorAll(".form-check-input");
    contenedorDeTarjetas.innerHTML = generarContenidoPast(data.events, data.currentDate)
});

panelDeFiltros.addEventListener("change", () => {refrescarContenido(contenedorDeTarjetas);});


function crearTarjeta(evento) {
    return `<div class="card">
    <img src= ${evento.image} class="cardImg card-img-top" alt="image ${evento.name}">
    <div class="card-body row">
        <h5 class="card-title">${evento.name}</h5>
        <p class="card-text">${evento.description}</p>
        <p>Event date: ${evento.date}</p>
        <div class="d-flex flex-wrap justify-content-between">
            <p>Price: ${evento.price}</p>
            <a href="./Details.html?id=${evento._id} " class="btn btn-primary w-50 ">Details</a>
        </div>
    </div>
</div>`
}

function generarContenidoPast(arregloEventos, fechaActual) {
    let listaDeTarjetas = ""
    for (evento of arregloEventos) {
        if (evento.date <= fechaActual) {
            listaDeTarjetas += crearTarjeta(evento)
        }
    }
    return listaDeTarjetas
}


function obtenerCategoriasSeleccionadas() {
    const arregloDeCheckBox = document.querySelectorAll(".form-check-input")
    let arregloDeCategoriasSeleccionadas = [];
    for (element of arregloDeCheckBox) {
        if (element.checked)
            arregloDeCategoriasSeleccionadas.push(element.value);
    }
    return arregloDeCategoriasSeleccionadas;
}

function obtenerEventosPorCategoriasSeleccionadas(categorias, eventos) {
    let arregloDeEventosFiltrados = [];
    for (elem of categorias) {
        arregloDeEventosFiltrados = arregloDeEventosFiltrados.concat(eventos.filter((evento) =>
            evento.category.toLowerCase().includes(elem.toLowerCase())));
    }
    return arregloDeEventosFiltrados;
}

function refrescarContenido(contenedorDeTarjetas) {
    let categorias = obtenerCategoriasSeleccionadas();
    let listaEventos = [];
    if (categorias.length == 0) {
        listaEventos = data.events;
    } else {
        listaEventos = obtenerEventosPorCategoriasSeleccionadas(categorias, data.events);
    }
    contenedorDeTarjetas.innerHTML = generarContenidoPast(listaEventos, data.currentDate);
}

function listarCategoriasDisponibles(arregloEventos) {
    return arregloEventos.map((elemento) => elemento.category).filter((categoria, indice, categorias) => categorias.indexOf(categoria) === indice);
}

// Crea los elementos de HTML usando el listarCategoriasDisponibles como inputs arreglo
function crearFiltros(arregloDeCategorias) {
    let filtrosHtml = ""
    for (elemento of arregloDeCategorias) {
        filtrosHtml += ` 
            <div class="form-check w-auto col-lg-2 flex-grow-0  flex-wrap">
                <input class="form-check-input" type="checkbox" id= ${elemento.trim()} value= ${elemento}>
                <label class="form-check-label" for=${elemento.trim()}> ${elemento}</label>
            </div>`;
    }
    return filtrosHtml;
}

function filtrarPorNombre(arregloDeEventos, texto) {
    let resultadoFiltrado = arregloDeEventos.filter((evento) =>
        evento.name.toLowerCase().includes(texto.toLowerCase()));
    return resultadoFiltrado;
}

inputTexto.addEventListener("input", () => {
    let categoriasSeleccionadas = obtenerCategoriasSeleccionadas();
    let eventosAMostrar = [];
    if (categoriasSeleccionadas.length == 0) {
        eventosAMostrar = data.events;
    } else {
        eventosAMostrar = obtenerEventosPorCategoriasSeleccionadas(categoriasSeleccionadas, data.events);
    }
    let eventosFiltradosPorNombreYCategorias = filtrarPorNombre(eventosAMostrar, inputTexto.value);
    if (eventosFiltradosPorNombreYCategorias.length == 0) {
        contenedorDeTarjetas.innerHTML = "NOT FOUND";
    } else {
        contenedorDeTarjetas.innerHTML = generarContenidoPast(eventosFiltradosPorNombreYCategorias, data.currentDate);
    }
});





