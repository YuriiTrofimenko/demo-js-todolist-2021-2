import moment from './node_modules/moment/dist/moment.js'
import Todo from './todo.js'
import { state, createItem, updateItem, getItemById, fetchItems, deleteItem } from './store.js'

const addItemFab = document.getElementById('fab')

const $saveModal =
  new bootstrap.Modal(document.getElementById('save-modal'), {})
const $deleteModal =
  new bootstrap.Modal(document.getElementById('delete-modal'), {})

const saveModalForm = document.querySelector('#save-modal form')
const formSubmitEvent = new Event('submit', {'cancelable': true})

const saveModalSave = document.getElementById('save-modal__save')
const deleteModalDelete = document.getElementById('delete-modal__delete')

const todoItemFormDateInput = document.getElementById('date')
const todoItemFormDateOutput = document.getElementById('todo-item-date-output')

const preloader = {
  spinner: document.querySelector('.spinner-border'),
  show () {
    this.spinner.style.display = 'block'
  },
  hide () {
    this.spinner.style.display = 'none'
  }
}

function clearForm(form, modal) {
  form.classList.remove('was-validated')
  form.reset()
  document.getElementById('todo-item-date-output').attributes.removeNamedItem('data-date')

  if (modal) {
    modal.hide() 
  }
}

addItemFab.addEventListener('click', (ev) => {
  state.selectedItemId = null
  clearForm(saveModalForm)
})

saveModalSave.addEventListener('click', (ev) => {
  saveModalForm.dispatchEvent(formSubmitEvent)
})
deleteModalDelete.addEventListener('click', (ev) => {
  deleteItem(state.selectedItemId, preloader).then(
    result => {
      $deleteModal.hide()
      if (result) {
        fillItems()
      }
    }
  )
})

saveModalForm.addEventListener('submit', async (ev) => {
  ev.preventDefault()
  if (saveModalForm.checkValidity()) {
    const saveModalFormTitle = document.querySelector('#save-modal form #title')
    const saveModalFormDescription = document.querySelector('#save-modal form #description')
    const saveModalFormDate = document.querySelector('#save-modal form #date')
    let result
    if (!state.selectedItemId) {
      console.log(saveModalFormDate.value, typeof saveModalFormDate.value)
      result = await createItem(
        new Todo(saveModalFormTitle.value, saveModalFormDescription.value, new Date(saveModalFormDate.value)),
        preloader
      )
    } else {
      updateItem({
        'title': saveModalFormTitle.value,
        'description': saveModalFormDescription.value,
        'date': new Date(saveModalFormDate.value)
      })
      result = true
    }
    clearForm(saveModalForm, $saveModal)
    if (result) {
      fillItems()
    }
  } else {
    saveModalForm.classList.add('was-validated')
  }
})

let shouldDateInputChangeEmitting = true
todoItemFormDateInput.addEventListener('change', (ev) => {
  if (shouldDateInputChangeEmitting) {
    state.form.dateInput = ev.target.value
    todoItemFormDateOutput.dataset.date =
      moment(state.form.dateInput, "YYYY-MM-DD").format(todoItemFormDateInput.dataset.dateFormat)
    const formDateInputChangeEvent = new Event('change', {'cancelable': true})
    shouldDateInputChangeEmitting = false
    console.log(todoItemFormDateInput.dispatchEvent(formDateInputChangeEvent))
  } else {
    shouldDateInputChangeEmitting = true 
  }
})
todoItemFormDateOutput.addEventListener('click', (ev) => {
  const formDateInputClickEvent = new Event('click', {'cancelable': true})
  console.log(todoItemFormDateInput.dispatchEvent(formDateInputClickEvent))
})

const detailsModal = function (id) {
    const item = getItemById(id)
    if (item) {
        const modalTitle = document.querySelector('#details-modal > .modal-dialog > .modal-content .modal-title')
        const modalText = document.querySelector('#details-modal > .modal-dialog > .modal-content > .modal-body')
        modalTitle.innerText = item.title
        modalText.innerText = item.description
    }
}

const doneToggler = function (id) {
  const item = getItemById(id)
  item.done = !item.done

  fillItems()
}

const saveModal = function (id) {
    state.selectedItemId = id
    const item = getItemById(id)
    
    if (item) {
      const saveModalFormTitle = document.querySelector('#save-modal form #title')
      const saveModalFormDescription = document.querySelector('#save-modal form #description')
      const saveModalFormDate = document.querySelector('#save-modal form #date')
      saveModalFormTitle.value = item.title
      saveModalFormDescription.value = item.description
      saveModalFormDate.valueAsDate = new Date(item.date)
      todoItemFormDateOutput.dataset.date =
        moment(item.date, "YYYY-MM-DD").format(todoItemFormDateInput.dataset.dateFormat)
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
                    <h6 class="card-subtitle mb-2 ${item.done ? '' : 'text-muted'}">${moment(item.date).format("DD.MM.YYYY")/* item.date.toLocaleString('ru').slice(0, 10) */}</h6>
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

fetchItems(fillItems, preloader)
