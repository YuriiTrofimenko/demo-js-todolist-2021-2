// console.log('Hello')
import { state } from './store.js'
// console.log(state)
let cardsHtml = ''
state.items.forEach(item => {
    cardsHtml += `
    <div class="col-12 col-sm-6 col-lg-4 col-xl-3">
        <div data-id="${item.id}" class="card" style="width: 18rem;${item.done ? 'background-color:green' : ''}">
            <div class="card-body">
            <h5 class="card-title">${item.title}</h5>
            <h6 class="card-subtitle mb-2 text-muted">${item.date.toLocaleString('ru').slice(0, 10)}</h6>
            <p class="card-text ellipsed-text">${item.description}</p>
            <a href="#" class="card-link">Details</a>
            <a href="#" class="card-link">Edit</a>
            <a href="#" class="card-link">Done</a>
            <a href="#" class="card-link">Delete</a>
            </div>
        </div>
    </div>
    `.trim()
})
const itemsRow = document.querySelector('#items > .row')
itemsRow.innerHTML = cardsHtml