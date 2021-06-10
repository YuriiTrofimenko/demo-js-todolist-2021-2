import Todo from './todo.js'
import { state, updateItem, getItemById } from './store.js'

const addItemFab = document.getElementById('fab')
const $saveModal =
  new bootstrap.Modal(document.getElementById('saveModal'), {})
const saveModalForm = document.querySelector('#saveModal form')
const formSubmitEvent = new Event('submit', {'cancelable': true})
const saveModalSave = document.getElementById('saveModal__save')

addItemFab.addEventListener('click', (ev) => {
  state.selectedItemId = null
  saveModalForm.classList.remove('was-validated')
  saveModalForm.reset()
})

saveModalSave.addEventListener('click', (ev) => {
  saveModalForm.dispatchEvent(formSubmitEvent)
})

saveModalForm.addEventListener('submit', (ev) => {
  ev.preventDefault()
  if (saveModalForm.checkValidity()) {
    const saveModalFormTitle = document.querySelector('#saveModal form #title')
    const saveModalFormDescription = document.querySelector('#saveModal form #description')
    if (!state.selectedItemId) {
      state.items.unshift(new Todo(saveModalFormTitle.value, saveModalFormDescription.value, new Date()))
    } else {
      updateItem({
        'title': saveModalFormTitle.value,
        'description': saveModalFormDescription.value
      })
    }
    saveModalForm.classList.remove('was-validated')
    saveModalForm.reset()
    $saveModal.hide()
    fillItems()
  } else {
    saveModalForm.classList.add('was-validated')
  }
})

const detailsModal = function (id) {
    // console.log('id = ', id)
    const item = state.items.find(i => i.id === id)
    if (item) {
        const modalTitle = document.querySelector('#details-modal > .modal-dialog > .modal-content .modal-title')
        const modalText = document.querySelector('#details-modal > .modal-dialog > .modal-content > .modal-body')
        modalTitle.innerText = item.title
        modalText.innerText = item.description
    }
}

const doneToggler = function (id) {
    console.log('doneToggler call, model id = ' + id)
}

const saveModal = function (id) {
    // console.log('saveModal call, model id = ' + id)
    state.selectedItemId = id
    const saveModalFormTitle = document.querySelector('#saveModal form #title')
    const saveModalFormDescription = document.querySelector('#saveModal form #description')
    const selectedItem = getItemById(id)
    if (selectedItem) {
      saveModalFormTitle.value = selectedItem.title
      saveModalFormDescription.value = selectedItem.description
      $saveModal.show()
    }
}

const deleteModal = function (id) {
    console.log('deleteModal call, model id = ' + id)
}

document.addEventListener('click', ev => {
    const target = ev.target
    const action = target.dataset.action
    const id = Number(target.dataset.id)
    if (action === 'details' && id) {
        detailsModal(id)
    } else if (action === 'toggle-done' && id) {
        doneToggler(id)
    } else if (action === 'edit' && id) {
        saveModal(id)
    } else if (action === 'delete' && id) {
        deleteModal(id)
    }
})

function fillItems () {
    const cardsHtml = state.items.map(item => {
       return `<div class="col-12 col-sm-6 col-lg-4 col-xl-3 mt-3">
                <div data-id="${item.id}" class="card" style="width: 20rem;${item.done ? 'background-color:green' : ''}">
                    <div class="card-body">
                    <h5 class="card-title">${item.title}</h5>
                    <h6 class="card-subtitle mb-2 text-muted">${item.date.toLocaleString('ru').slice(0, 10)}</h6>
                    <p class="card-text ellipsed-text">${item.description}</p>
                    <button data-id="${item.id}" data-action="details" type="button" class="btn btn-outline-secondary" data-bs-toggle="modal" data-bs-target="#details-modal">Details</button>
                    <button data-id="${item.id}" data-action="edit" type="button" class="btn btn-outline-secondary">Edit</button>
                    <button data-id="${item.id}" data-action="toggle-done"  type="button" class="btn btn-outline-secondary">Done</button>
                    <button data-id="${item.id}" data-action="delete" type="button" class="btn btn-outline-danger">Delete</button>
                    </div>
                </div>
            </div>`
    }
    ).reduce((resultView, currentView) => resultView += currentView, '')
    const itemsRow = document.querySelector('#items > .row')
    itemsRow.innerHTML = cardsHtml
}

fillItems()









