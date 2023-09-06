let contenedorDeTarjetas = document.querySelector(".contenedorTarjetas");

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

function generarContenidoHome(arregloEventos) {
    let listaDeTarjetas = ""
    for (evento of arregloEventos) {
        listaDeTarjetas += crearTarjeta(evento)
    }
    return listaDeTarjetas
}


function inyectarContenido(que, donde) {
    donde.innerHTML = generarContenidoHome(que)
}

inyectarContenido(data.events, contenedorDeTarjetas)

const panelDeFiltros = document.querySelector(".panelFiltros")
panelDeFiltros.innerHTML = crearFiltros(listarCategoriasDisponibles(data.events))
const arregloDeCheckBox = document.querySelectorAll(".form-check-input")
panelDeFiltros.addEventListener("change", () => { refrescarContenido(contenedorDeTarjetas) })


function obtenerCategoriasSeleccionadas() {
    let arregloDeCategoriasSeleccionadas = []
    for (element of arregloDeCheckBox) {
        if (element.checked)
            arregloDeCategoriasSeleccionadas.push(element.value)
    }
    return arregloDeCategoriasSeleccionadas
}

function obtenerEventosPorCategoriasSeleccionadas(categorias, eventos) {
    let arregloDeEventosFiltrados = []
    for (elem of categorias) {
        arregloDeEventosFiltrados = arregloDeEventosFiltrados.concat(eventos.filter(evento =>
            evento.category.toLowerCase().includes(elem.toLowerCase())))
    }
    return arregloDeEventosFiltrados
}

function refrescarContenido(contenedorDeTarjetas) {
    let categorias = obtenerCategoriasSeleccionadas()
    let listaEventos = []
    if (categorias.length == 0)
        listaEventos = data.events
    else
        listaEventos = obtenerEventosPorCategoriasSeleccionadas(categorias, data.events)
    inyectarContenido(listaEventos, contenedorDeTarjetas)
}


function listarCategoriasDisponibles(arregloEventos) {
    return arregloEventos.map(elemento => elemento.category).filter((categoria, indice, categorias) => categorias.indexOf(categoria) === indice)
}


// Crea los elementos de HTML usando el listarCategoriasDisponibles como inputs arreglo
function crearFiltros(arregloDeCategorias) {
    let filtrosHtml = ""
    for (elemento of arregloDeCategorias) {
        filtrosHtml += ` <div class="form-check w-auto col-lg-2 flex-grow-0  flex-wrap">
<input class="form-check-input" type="checkbox" id= ${elemento.trim} value= ${elemento}>
<label class="form-check-label" for=${elemento.trim}> ${elemento}</label>
</div>`
    }
    return filtrosHtml;

}


const inputTexto = document.querySelector("#texto");

function filtrarPorNombre(arregloDeEventos, texto) {
    let resultadoFiltrado = arregloDeEventos.filter(evento =>
        evento.name.toLowerCase().includes(texto.toLowerCase()))
    return resultadoFiltrado
}


inputTexto.addEventListener("input", () => {
    let categoriasSeleccionadas = obtenerCategoriasSeleccionadas()
    let eventosAMostrar = []
    if (categoriasSeleccionadas.length == 0) {
        eventosAMostrar = data.events
    }
    else {
        eventosAMostrar = obtenerEventosPorCategoriasSeleccionadas(categoriasSeleccionadas, data.events)
    }
    let eventosFiltradosPorNombreYCategorias = filtrarPorNombre(eventosAMostrar, inputTexto.value)
    if (eventosFiltradosPorNombreYCategorias.length == 0) {
        contenedorDeTarjetas.innerHTML = "NO ENCONTRADO"
        contenedorDeTarjetas.innerHTML = generarContenidoHome(eventosFiltradosPorNombreYCategorias)
    }

})
