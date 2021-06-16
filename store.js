import Todo from './todo.js'
const state = {
    items: [
        /* new Todo('Todo title 1', '1Some quick example text to build on the card title and make up the bulk of the card\'s content. Some quick example text to build on the card title and make up the bulk of the card\'s content.', new Date('2021-06-12')),
        new Todo('Todo title 2', '2Some quick example text to build on the card title and make up the bulk of the card\'s content. Some quick example text to build on the card title and make up the bulk of the card\'s content.', new Date('2021-06-15')),
        new Todo('Todo title 3', '3Some quick example text to build on the card title and make up the bulk of the card\'s content. Some quick example text to build on the card title and make up the bulk of the card\'s content.', new Date('2021-06-12')),
        new Todo('Todo title 4', '4Some quick example text to build on the card title and make up the bulk of the card\'s content. Some quick example text to build on the card title and make up the bulk of the card\'s content.', new Date('2021-07-01')),
        new Todo('Todo title 5', '5Some quick example text to build on the card title and make up the bulk of the card\'s content.', new Date('2021-06-20')) */
    ],
    selectedItemId: null
}

async function fetchItems (fillItems, loadingDiv) {
  loadingDiv.style.display = 'block'
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
    const response = await fetch('https://jsonplaceholder.typicode.com/todos')
    const items = await response.json()
    items.forEach(item => state.items.unshift(
      new Todo(item.title, 'No Content', new Date(), item.completed),
    ))
  fillItems()
  } catch (error) {
    console.log('Error: ', error)
  }
  loadingDiv.style.display = 'none'
}
function getItemById (id) {
  return state.items.find(item => item.id === id)
}
function updateItem (payload) {
  const selectedItem = getItemById(state.selectedItemId)
  if (selectedItem) {
    Object.assign(selectedItem, payload)
  }
}
export { state, updateItem, getItemById, fetchItems }