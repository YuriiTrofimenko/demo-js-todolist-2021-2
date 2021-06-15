import Todo from './todo.js'
import { state, updateItem, getItemById } from './store.js'

const addItemFab = document.getElementById('fab')

const $saveModal =
  new bootstrap.Modal(document.getElementById('save-modal'), {})
const $deleteModal =
  new bootstrap.Modal(document.getElementById('delete-modal'), {})

const saveModalForm = document.querySelector('#save-modal form')
const formSubmitEvent = new Event('submit', {'cancelable': true})

const saveModalSave = document.getElementById('save-modal__save')
const deleteModalDelete = document.getElementById('delete-modal__delete')

addItemFab.addEventListener('click', (ev) => {
  state.selectedItemId = null
  saveModalForm.classList.remove('was-validated')
  saveModalForm.reset()
})

saveModalSave.addEventListener('click', (ev) => {
  saveModalForm.dispatchEvent(formSubmitEvent)
})
deleteModalDelete.addEventListener('click', (ev) => {
  state.items = state.items.filter(i => i.id !== state.selectedItemId) // using filter instead of splice because id isn't an order id (splice requires order id)
  
  $deleteModal.hide()
  fillItems()
})

saveModalForm.addEventListener('submit', (ev) => {
  ev.preventDefault()
  if (saveModalForm.checkValidity()) {
    const saveModalFormTitle = document.querySelector('#save-modal form #title')
    const saveModalFormDescription = document.querySelector('#save-modal form #description')
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
    const selectedItem = getItemById(id)
    if (selectedItem) {
        const modalTitle = document.querySelector('#details-modal > .modal-dialog > .modal-content .modal-title')
        const modalText = document.querySelector('#details-modal > .modal-dialog > .modal-content > .modal-body')
        modalTitle.innerText = selectedItem.title
        modalText.innerText = selectedItem.description
    }
}

const doneToggler = function (id) {
  const item = getItemById(id)
  item.done = !item.done

  fillItems()
}

const saveModal = function (id) {
    state.selectedItemId = id
    const selectedItem = getItemById(id)

    const saveModalFormTitle = document.querySelector('#save-modal form #title')
    const saveModalFormDescription = document.querySelector('#save-modal form #description')
    if (selectedItem) {
      saveModalFormTitle.value = selectedItem.title
      saveModalFormDescription.value = selectedItem.description
      $saveModal.show()
    }
}

const deleteModal = function (id) {
    state.selectedItemId = id
    $deleteModal.show()
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
       return `<div class="col-12 col-sm-6 col-md-3 m-2 card-container">
                <div data-id="${item.id}" class="card ${item.done ? 'bg-success text-white' : ''}">
                    <div class="card-body">
                    <h5 class="card-title ellipsed-title">${item.title}</h5>
                    <h6 class="card-subtitle mb-2 ${item.done ? '' : 'text-muted'}">${item.date.toLocaleString('ru').slice(0, 10)}</h6>
                    <p class="card-text ellipsed-text">${item.description}</p>
                    <button data-id="${item.id}" data-action="details" type="button" class="btn ${item.done ? 'btn-outline-light' : 'btn-outline-secondary'} m-1" data-bs-toggle="modal" data-bs-target="#details-modal">Подробнее</button>
                    <button data-id="${item.id}" data-action="edit" type="button" class="btn ${item.done ? 'btn-outline-light' : 'btn-outline-secondary'} m-1">Редактировать</button>
                    <button data-id="${item.id}" data-action="toggle-done"  type="button" class="btn ${item.done ? 'btn-outline-light' : 'btn-outline-secondary'} m-1">Готово</button>
                    <button data-id="${item.id}" data-action="delete" type="button" class="btn ${item.done ? 'btn-danger' : 'btn-outline-danger'} m-1">Удалить</button>
                    </div>
                </div>
            </div>`
    }
    ).reduce((resultView, currentView) => resultView += currentView, '')
    const itemsRow = document.querySelector('#items > .row')
    itemsRow.innerHTML = cardsHtml
}

fillItems()









