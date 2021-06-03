import Todo from './todo.js'
const state = {
    items: [
        new Todo('Todo title 1', '1Some quick example text to build on the card title and make up the bulk of the card\'s content.', new Date('2021-06-12')),
        new Todo('Todo title 2', '2Some quick example text to build on the card title and make up the bulk of the card\'s content.', new Date('2021-06-15')),
        new Todo('Todo title 3', '3Some quick example text to build on the card title and make up the bulk of the card\'s content.', new Date('2021-06-12')),
        new Todo('Todo title 4', '4Some quick example text to build on the card title and make up the bulk of the card\'s content.', new Date('2021-07-01')),
        new Todo('Todo title 5', '5Some quick example text to build on the card title and make up the bulk of the card\'s content.', new Date('2021-06-20'))
    ]
}
export { state }