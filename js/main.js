// Seleção de elementos HTML
const todoForm = document.querySelector('#todoForm');
const todoInput = document.querySelector('#todoInput');
const editForm = document.querySelector('#editForm');
const editInput = document.querySelector('#editInput');
const searchForm = document.querySelector('#searchForm');
const searchInput = document.querySelector('#searchInput');
const localStorageForm = document.querySelector('#localStorageForm')
const cancelEditBtn = document.querySelector('#cancelEditBtn');
const filter = document.querySelector('#filterSelect');
const todoList = document.querySelector('#todoList');

//Array de tarefas para o localStorage
let todos = []

// Funções
const saveTodo = (text) => {

    if (todos.length > 0) {
        todos.forEach((item) => {
            if (item.id != `todo-${text.replace(/\s/g, '-')}`) {
                todos.push({
                    id: `todo-${text.replace(/\s/g, '-')}`,
                    nome: text,
                    done: false,
                    display: true
                })
            } else {
                alert('Essa tarefa já existe!')
            }
        })
    } else {
        todos.push({
            id: `todo-${text.replace(/\s/g, '-')}`,
            nome: text,
            done: false,
            display: true
        })
    }

    todoInput.value = ""
    todoInput.focus()

    addToLocalStorage(todos)
    renderTodos()
}

const renderTodos = () => {
    todoList.innerHTML = ''

    todos.forEach((item) => {

        const todo = document.createElement('div')
        todo.classList.add('todo')

        todo.setAttribute('id', `${item.id}`)

        const todoTitle = document.createElement('h3')
        todoTitle.innerText = item.nome

        const doneBtn = document.createElement('button')
        doneBtn.classList.add('finishTodo')
        doneBtn.innerHTML = "<i class='fa-solid fa-check'></i>"

        const editBtn = document.createElement('button')
        editBtn.classList.add('editTodo')
        editBtn.innerHTML = "<i class='fa-solid fa-pen'></i>"
    
        const removeBtn = document.createElement('button')
        removeBtn.classList.add('removeTodo')
        removeBtn.innerHTML = "<i class='fa-solid fa-xmark'></i>"

        if (item.done) {
            todo.classList.add('done')
        }

        if (!item.display) {
            todo.setAttribute('style', 'display: none;')
        }

        todo.append(todoTitle, doneBtn, editBtn, removeBtn)
        todoList.append(todo)
    })
}

const editTodos = (oldText, newText) => {

    todos.forEach((item) => {
        if (item.id == `todo-${oldText.replace(/\s/g, '-')}`) {
            item.nome = newText
            item.id = `todo-${newText.replace(/\s/g, '-')}`
        }
    })

    addToLocalStorage(todos)
    renderTodos()
    toggleForms()
}

const searchTodos = (search) => {

    todos.forEach((item) => {
        if(search && item.id != `todo-${search.replace(/\s/g, '-')}`) {
            item.display = false
        } else {
            item.display = true
        }
    })

    renderTodos()
}

const filterTodos = (filter) => {

    todos.forEach((item) => {
        if (filter == 'done') {
            
            if (item.done) {
                item.display = true
            } else {
                item.display = false
            }
        } else if (filter == 'ongoing') {
            
            if (item.done) {
                item.display = false
            } else {
                item.display = true
            }
        } else if (filter == 'all') {
            item.display = true
        }
    })

    addToLocalStorage(todos)
    renderTodos()
}

const toggleForms = () => {
    todoForm.classList.toggle('hide')
    editForm.classList.toggle('hide')
    todoList.classList.toggle('hide')
}

const addToLocalStorage = (todos) => {
    localStorage.setItem('todos', JSON.stringify(todos))
    
}

const getFromLocalStorage = () => {
    if (localStorage.getItem('todos')) {
        todos = JSON.parse(localStorage.getItem('todos'))
        renderTodos(todos)
    }
}

// Event listeners
todoForm.addEventListener('submit', (e) => {
    e.preventDefault()

    if(todoInput.value) {
        saveTodo(todoInput.value)
    }
})

editForm.addEventListener('submit', (e) => {
    e.preventDefault()

    if(e.submitter.id == 'cancelEditBtn') {
        toggleForms()
    } else if (e.submitter.id == 'editConfirm') {
        editTodos(e.submitter.name, editInput.value)
    }
})

searchForm.addEventListener('submit', (e) => {
    e.preventDefault()

    if (e.submitter.id == 'searchButton') {
        searchTodos(searchInput.value)

    } else if (e.submitter.id == 'eraseButton') {
        searchInput.value = ''

        document.querySelectorAll('.todo').forEach(todo => {
            todo.removeAttribute('style')
        })
    }
})

filter.addEventListener('change', (e) => {
    filterTodos(e.target.value)
})

document.addEventListener('click', (e) => {

    if (e.target.classList.contains('finishTodo')) {

        todos.forEach((item) => {
            
            if (item.id == e.target.closest('div').id && item.done) {
                item.done = false
            } else if (item.id == e.target.closest('div').id) {
                item.done = true
            }
        })

        addToLocalStorage(todos)
        renderTodos()
    }

    if(e.target.classList.contains('editTodo')) {

        editInput.value = e.target.closest('div').innerText
        document.querySelector('#editConfirm').setAttribute('name', `${e.target.closest('div').innerText}`)

        toggleForms()
    }

    if (e.target.classList.contains('removeTodo')) {

        todos.forEach((item) => {
            if (item.id == e.target.closest('div').id) {
                todos.splice(todos.indexOf(item), 1)
            }
        })

        addToLocalStorage(todos)
        renderTodos()
    }
})

getFromLocalStorage()
