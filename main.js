// console.log('Hello')
// import { state } from './store.js'

/* document.addEventListener('load', () => {
    console.log('load')
}) */

const detailsModal = function (id) {
    console.log('id = ', id)
    const item = state.items.find(i => i.id === id)
    if (item) {
        const modalText = document.querySelector('#details-modal > .modal-dialog > .modal-content > .modal-body')
        modalText.innerHTML = item.description
    }
}

function fillItems () {
    const cardsHtml = state.items.map(item => {
       return `<div class="col-12 col-sm-6 col-lg-4 col-xl-3 mt-3">
                <div data-id="${item.id}" class="card" style="width: 18rem;${item.done ? 'background-color:green' : ''}">
                    <div class="card-body">
                    <h5 class="card-title">${item.title}</h5>
                    <h6 class="card-subtitle mb-2 text-muted">${item.date.toLocaleString('ru').slice(0, 10)}</h6>
                    <p class="card-text ellipsed-text">${item.description}</p>
                    <button onclick="detailsModal(${item.id})" type="button" class="btn btn-outline-secondary" data-bs-toggle="modal" data-bs-target="#details-modal">Details</button>
                    <button type="button" class="btn btn-outline-secondary">Edit</button>
                    <button type="button" class="btn btn-outline-secondary">Done</button>
                    <button type="button" class="btn btn-outline-secondary">Delete</button>
                    </div>
                </div>
            </div>`
    }
    ).reduce((resultView, currentView) => resultView += currentView, '')
    const itemsRow = document.querySelector('#items > .row')
    itemsRow.innerHTML = cardsHtml
}

fillItems()









