import Todo from './todo.js'
// const BASE_URL = 'https://jsonplaceholder.typicode.com/todos'
const BASE_URL = 'http://localhost:4000/api'
const state = {
    items: [
        /* new Todo('Todo title 1', '1Some quick example text to build on the card title and make up the bulk of the card\'s content. Some quick example text to build on the card title and make up the bulk of the card\'s content.', new Date('2021-06-12')),
        new Todo('Todo title 2', '2Some quick example text to build on the card title and make up the bulk of the card\'s content. Some quick example text to build on the card title and make up the bulk of the card\'s content.', new Date('2021-06-15')),
        new Todo('Todo title 3', '3Some quick example text to build on the card title and make up the bulk of the card\'s content. Some quick example text to build on the card title and make up the bulk of the card\'s content.', new Date('2021-06-12')),
        new Todo('Todo title 4', '4Some quick example text to build on the card title and make up the bulk of the card\'s content. Some quick example text to build on the card title and make up the bulk of the card\'s content.', new Date('2021-07-01')),
        new Todo('Todo title 5', '5Some quick example text to build on the card title and make up the bulk of the card\'s content.', new Date('2021-06-20')) */
    ],
    form: {
      dateInput: null
    },
    selectedItemId: null
}

async function fetchItems (fillItems, preloader) {
  preloader.show()
  /* // отправка запроса по указанному адресу
  fetch('https://jsonplaceholder.typicode.com/todos')
  // установка обработчика получения ответа сервера
  .then(response => response.json())
  // установка обработчика парсинга данных из ответа сервера
  .then(items => {
    items.forEach(item => state.items.unshift(
      new Todo(item.title, 'No Content', new Date(), item.completed),
    ))
    fillItems()
  })
  .catch(reason => console.log('Error: ', reason))
  .finally(() => loadingDiv.style.display = 'none')
  // пока ожидается ответ сервера -
  // продолжится выполнение ниже расположенного кода */
  try {
    const response = await fetch(`${BASE_URL}/items`)
    const items = (await response.json()).data
    /* items.forEach(item => state.items.unshift(
      new Todo(item.title, 'No Content', new Date(), item.completed),
    )) */
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