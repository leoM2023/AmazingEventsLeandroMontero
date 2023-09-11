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


//Event with Highest Assistance
//1) armar un arreglo con eventos pasados
//2) declaramos un evento como el de mayor assistencia y lo comparamos 
//con cada uno de los elementos del array.  Cuando comparamos, usamos la funcion
//calcular porventage de asistencia

function calcularPorcentajeAsistencia(evento) {
    return ((evento.assistance / evento.capacity) * 100);
}

function generarArregloPastEvents(arregloTodosLosEventos, fechaActual) {
    return arregloTodosLosEventos.filter((evento) => evento.date <= fechaActual);
}

async function obtenerEventoMayorAsistencia() {
    try {
        let data = await traerDataEventos();
        let eventosPasados = generarArregloPastEvents(data.events, data.currentDate);
        if (eventosPasados.length > 0) {
            let eventoBuscado = eventosPasados[0];
            for (elemento of eventosPasados) {
                if (calcularPorcentajeAsistencia(elemento) > calcularPorcentajeAsistencia(eventoBuscado)) {
                    eventoBuscado = elemento;
                }
            }
            let eventoNombreId = { name: eventoBuscado.name, _id: eventoBuscado._id };
            return eventoNombreId;
        }
    }
    catch (error) { console.log("error"); }
}

let celdaMayorAsistencia = document.getElementById('mayorAsistencia');
obtenerEventoMayorAsistencia().then((eventoNombreId) => {
    celdaMayorAsistencia.innerHTML = `<a href="./Details.html?id=${eventoNombreId._id}" class="nav-link">${eventoNombreId.name} </a>`
});


//Event with Lowest Assistance

async function obtenerEventoMenorAsistencia() {
    try {
        let data = await traerDataEventos();
        let eventosPasados = generarArregloPastEvents(data.events, data.currentDate);
        if (eventosPasados.length > 0) {
            let eventoBuscado = eventosPasados[0];
            for (elemento of eventosPasados) {
                if (calcularPorcentajeAsistencia(elemento) < calcularPorcentajeAsistencia(eventoBuscado)) {
                    eventoBuscado = elemento;
                }
            }
            let eventoNombreId = { name: eventoBuscado.name, _id: eventoBuscado._id };
            return eventoNombreId;
        }
    }
    catch (error) { console.log("error"); }
}

let celdaMenorAsistencia = document.getElementById('menorAsistencia');
obtenerEventoMenorAsistencia().then((eventoNombreId) => { celdaMenorAsistencia.innerHTML = `<a href="./Details.html?id=${eventoNombreId._id}" class="nav-link">${eventoNombreId.name} </a>` });

//Buscar Evento con Mayor capacidad
async function obtenerEventoMayorCapacidad() {
    try {
        let data = await traerDataEventos();
        let arregloEventos = data.events
        if (arregloEventos.length > 0) {
            let eventoBuscado = arregloEventos[0];
            for (elemento of arregloEventos) {
                if (elemento.capacity > eventoBuscado.capacity) {
                    eventoBuscado = elemento;
                }
            }
            let eventoNombreId = { name: eventoBuscado.name, _id: eventoBuscado._id };
            return eventoNombreId;
        }
    }
    catch (error) { console.log("error"); }
}

let celdaMayorCapacidad = document.getElementById('mayorCapacidad');
obtenerEventoMayorCapacidad().then((eventoNombreId) => { celdaMayorCapacidad.innerHTML = `<a href="./Details.html?id=${eventoNombreId._id}" class="nav-link">${eventoNombreId.name} </a>` });

// Upcoming events statistics by category

// generar contenido
//generar un arreglo de categorias
//generar una fila de HTML por cada categoria
//generar un arreglo de eventos por cada categoria y fecha
//calcular ganancia por evento 
//sumar ganancias de todos los eventos
//
// inyectar

function generarArregloUpcomingCategoryEvents(arregloTodosLosEventos, fechaActual, categoria) {
    return arregloTodosLosEventos.filter((evento) => evento.date > fechaActual).filter((evento) => evento.category.toLowerCase() == categoria.toLowerCase())
}

function obtenerGananciasUpcoming(eventosPorCategoria) {
    let resultado = 0;
    if (eventosPorCategoria.length > 0) {
        for (evento of eventosPorCategoria) {
            resultado += (evento.price) * (evento.estimate)
        }
        return resultado;
    }
}

function obtenerPorcentajeAsistenciaEstimada(eventosPorCategoria) {
    let porcentajeEstimadoEventos = 0;
    if (eventosPorCategoria.length > 0) {
        for (evento of eventosPorCategoria) {
            porcentajeEstimadoEventos += ((evento.estimate * 100) / (evento.capacity))
        }
        return (porcentajeEstimadoEventos / eventosPorCategoria.length)
    }
}

function obtenerPorcentajeAsistenciaPast(eventosPorCategoria) {
    let porcentajeEstimadoEventos = 0;
    if (eventosPorCategoria.length > 0) {
        for (evento of eventosPorCategoria) {
            porcentajeEstimadoEventos += ((evento.assistance * 100) / (evento.capacity))
        }
        return (porcentajeEstimadoEventos / eventosPorCategoria.length)
    }
}

function obtenerCategoriasDisponibles(arregloEventos) {
    return arregloEventos.map((elemento) => elemento.category).filter((categoria, indice, categorias) => categorias.indexOf(categoria) === indice);
}


function crearFilaCategoria(categoria, ganancia, asistencia) {
    let fila = document.createElement('tr');
    fila.innerHTML = `<td>${categoria}</td> <td>$ ${ganancia}</td><td> ${asistencia}% </td>`;
    return fila;
}

async function calcularUpcomingEventsStatsByCategory() {
    let tabla = document.querySelector('#upcomingStats');
    let fila;
    let encabezadoUpcomingStats = document.createElement('tr');
    let subtituloUpcomingStats = document.createElement('tr');

    try {
        let data = await traerDataEventos();
        let arregloTodosEventos = data.events;
        let fechaActual = data.currentDate;
        let arregloUpcoming = [];
        let categoriasDisponibles = obtenerCategoriasDisponibles(arregloTodosEventos);
        if (categoriasDisponibles.length > 0) {
            encabezadoUpcomingStats.innerHTML = `
                        <th colspan="3" class="colored-row">Upcoming events statistics by category</th>`
            subtituloUpcomingStats.innerHTML = `   
                        <td class="subt colored-row" >Categories</td>
                        <td class="subt colored-row">Revenues</td>
                        <td class="subt colored-row">Percentage of assistance</td>`
            tabla.appendChild(encabezadoUpcomingStats);
            tabla.appendChild(subtituloUpcomingStats);
            for (categoria of categoriasDisponibles) {
                arregloUpcoming = generarArregloUpcomingCategoryEvents(arregloTodosEventos, fechaActual, categoria);
                if (arregloUpcoming.length > 0) {
                    fila = crearFilaCategoria(categoria, obtenerGananciasUpcoming(arregloUpcoming), obtenerPorcentajeAsistenciaEstimada(arregloUpcoming));
                    tabla.appendChild(fila);
                }
            }
        }
    }
    catch (error) { console.log("error"); }
}

calcularUpcomingEventsStatsByCategory();

// Past Events Statistics by category

function generarArregloPastCategoryEvents(arregloTodosLosEventos, fechaActual, categoria) {
    return arregloTodosLosEventos.filter((evento) => evento.date <= fechaActual).filter((evento) => evento.category.toLowerCase() == categoria.toLowerCase())
}

function obtenerGananciasPast(eventosPorCategoria) {
    let resultado = 0;
    if (eventosPorCategoria.length > 0) {
        for (evento of eventosPorCategoria) {
            resultado += (evento.price) * (evento.assistance)
        }
        return resultado;
    }
}

async function calcularPastEventsStatsByCategory() {
    let tabla = document.querySelector('#upcomingStats');
    let fila;
    let encabezadoPastStats = document.createElement('tr');
    let subtituloPastStats = document.createElement('tr');

    try {
        let data = await traerDataEventos();
        let arregloTodosEventos = data.events;
        let fechaActual = data.currentDate;
        let arregloPast = [];
        let categoriasDisponibles = obtenerCategoriasDisponibles(arregloTodosEventos);
        if (categoriasDisponibles.length > 0) {
            encabezadoPastStats.innerHTML = `
                        <th colspan="3" class="colored-row">Past events statistics by category</th>`
            subtituloPastStats.innerHTML = `   
                        <td class="subt colored-row">Categories</td>
                        <td class="subt colored-row">Revenues</td>
                        <td class="subt colored-row">Percentage of assistance</td>`
            tabla.appendChild(encabezadoPastStats);
            tabla.appendChild(subtituloPastStats);
            for (categoria of categoriasDisponibles) {
                arregloPast = generarArregloPastCategoryEvents(arregloTodosEventos, fechaActual, categoria);
                if (arregloPast.length > 0) {
                    fila = crearFilaCategoria(categoria, obtenerGananciasPast(arregloPast), obtenerPorcentajeAsistenciaPast(arregloPast));
                    tabla.appendChild(fila);
                }
            }
        }
    }
    catch (error) { console.log("error"); }
}

calcularPastEventsStatsByCategory();