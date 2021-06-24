import Todo from './todo.js'

const BASE_URL = 'http://localhost:4000/api'
const state = {
    items: [],
    form: {
      dateInput: null
    },
    selectedItemId: null
}

async function fetchItems (fillItems, preloader) {
  preloader.show()

  try {
    const response = await fetch(`${BASE_URL}/items`)
    const items = (await response.json()).data
    
    items.forEach(item => state.items.unshift(
      new Todo(decodeURIComponent(item.title), decodeURIComponent(item.description), item.date, item.done, item.id),
    ))

    fillItems()
  } catch (error) {
    console.log('Error: ', error)
  }
  preloader.hide()
}

function getItemById (id) {
  return state.items.find(item => item.id === id)
}

async function createItem (newItem, preloader) {
  preloader.show()

  let result = true

  const newItemServer = Object.assign({}, newItem)
  newItemServer.title = encodeURIComponent(newItemServer.title)
  newItemServer.description = encodeURIComponent(newItemServer.description)

  try {
    const response = await fetch(`${BASE_URL}/items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newItemServer)
    })

    if (response.status === 201) {
      const responseBody = await response.json()
      newItem.id = responseBody.data.id
      state.items.unshift(newItem)
    } else {
      console.log('Server Error')
      result = false
    }
  } catch (error) {
    console.log('Error: ' + error)
    result = false
  } finally {
    preloader.hide()
    return result
  }
}

function updateItem (payload) {
  const selectedItem = getItemById(state.selectedItemId)
  if (selectedItem) {
    Object.assign(selectedItem, payload)
  }
}

async function deleteItem (id, preloader) {
  preloader.show()

  let result = true
  try {
    const response = await fetch(`${BASE_URL}/items/${id}`, {
      method: 'DELETE'
    })

    if (response.status === 204) {
      state.items = state.items.filter(i => i.id !== id) // using filter instead of splice because id isn't an order id (splice requires order id)
    } else {
      console.log('Server Error')
      result = false
    }
  } catch (error) {
    console.log('Error: ' + error)
    result = false
  } finally {
    preloader.hide()
    return result
  }  
}

export { state, createItem, updateItem, getItemById, fetchItems, deleteItem }