const queryString = location.search
const params = new URLSearchParams(queryString)
const id = params.get("id")


function pintarDetails(evento) {
    let container = document.querySelector(".mainDetails");
    let div = document.createElement('div');
    let concurrencia = ''
    let assiOrEsti = ''
    if (evento.hasOwnProperty('assistance')) {
        concurrencia = evento.assistance
        assiOrEsti = "Assistance"
    }
    else {
        concurrencia = evento.estimate
        assiOrEsti = "Estimate"
    }
    div.className = 'cardDetails';
    div.style.maxWidth = '70%';
    div.innerHTML = `<div class="row g-0">
        <div class="p-2 col-md-8">
            <img src="${evento.image}" class="img-fluid rounded-2 m-2" style="border: 2px solid black; background-color: #f8f9fa;" alt="image">
        </div>
        <div class="g-2 col-md-4">
            <div class="cardbodyDetails p-2">
                <h5 class="card-title">${evento.name}</h5>
                <p class="card-text">Date: ${evento.date}</p>
                <p class="card-text">Description: ${evento.description}</p>
                <p class="card-text">Category: ${evento.category}</p>
                <p class="card-text">Place: ${evento.place}</p>
                <p class="card-text">Capacity: ${evento.capacity}</p>
                <p class="card-text">${assiOrEsti}: ${concurrencia}</p>
                <p class="card-text">Price: ${evento.price}</p>
            </div>
        </div>
    </div>`;
    container.appendChild(div);
}

function buscarEvento(id) {
    return data.events.find(elemento => elemento._id == id);
}

pintarDetails(buscarEvento(id))
