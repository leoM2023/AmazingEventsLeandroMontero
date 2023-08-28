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
            <a href="./Details.html" class="btn btn-primary w-50 ">Details</a>
        </div>
    </div>
</div>`
}

function generarContenidoHome(arregloEventos){
    let listaDeTarjetas = ""
    for (evento of arregloEventos) {
        listaDeTarjetas += crearTarjeta(evento)
    }
    return listaDeTarjetas
}

contenedorDeTarjetas.innerHTML = generarContenidoHome(data.events)