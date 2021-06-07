/* export default */ class Todo {
    static lastId = 0
    constructor (title, description, date, done, id) {
        if (id) {
            this.id = id
        } else {
            this.id = ++Todo.lastId
        }
        this.title = title
        this.description = description
        this.date = date
        this.done = done ?? false
    }
}