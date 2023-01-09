// Seleção de elementos HTML
const todoForm = document.querySelector('#todoForm');
const todoInput = document.querySelector('#todoInput');
const editForm = document.querySelector('#editForm');
const editInput = document.querySelector('#editInput');
const searchForm = document.querySelector('#searchForm');
const searchInput = document.querySelector('#searchInput');
const cancelEditBtn = document.querySelector('#cancelEditBtn');
const filter = document.querySelector('#filterSelect');
const todoList = document.querySelector('#todoList');

// Funções
const saveTodo = (text) => {
    const todo = document.createElement('div')
    todo.classList.add('todo')
    todo.setAttribute('id', `todo-${text}`)

    const todoTitle = document.createElement('h3')
    todoTitle.innerText = text

    const doneBtn = document.createElement('button')
    doneBtn.classList.add('finishTodo')
    doneBtn.innerHTML = "<i class='fa-solid fa-check'></i>"

    const editBtn = document.createElement('button')
    editBtn.classList.add('editTodo')
    editBtn.innerHTML = "<i class='fa-solid fa-pen'></i>"
    
    const removeBtn = document.createElement('button')
    removeBtn.classList.add('removeTodo')
    removeBtn.innerHTML = "<i class='fa-solid fa-xmark'></i>"

    todo.append(todoTitle, doneBtn, editBtn, removeBtn)
    todoList.append(todo)

    todoInput.value = ""
    todoInput.focus()
}

const toggleForms = () => {
    todoForm.classList.toggle('hide')
    editForm.classList.toggle('hide')
    todoList.classList.toggle('hide')
}

const editTodos = (oldText, newText) => {
    let todo = document.querySelector(`#todo-${oldText}`)
    todo.firstChild.innerText = newText
    todo.id = `todo-${newText}`

    toggleForms()
}

const searchTodos = (search) => {
    const allTodos = document.querySelectorAll('.todo')

    allTodos.forEach(todo => {
        if(search && todo.id != `todo-${search}`) {
            todo.setAttribute('style', 'display: none;')
        }
    });
}

const filterTodos = (filter) => {
    const allTodos = document.querySelectorAll('.todo')

    if (filter == 'done') {
        allTodos.forEach(todo => {
            if (!todo.classList.contains('done')) {
                todo.setAttribute('style', 'display: none;')
            } else {
                todo.removeAttribute('style')
            }
        })
    } else if (filter == 'ongoing') {
        allTodos.forEach(todo => {
            if (todo.classList.contains('done')) {
                todo.setAttribute('style', 'display: none;')
            } else {
                todo.removeAttribute('style')
            }
        })
    } else if (filter == 'all') {
        allTodos.forEach(todo => {
            todo.removeAttribute('style')
    })
}}

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
        e.target.closest('div').classList.toggle('done')
    }

    if(e.target.classList.contains('editTodo')) {
        toggleForms()
        editInput.value = e.target.closest('div').innerText
        document.querySelector('#editConfirm').setAttribute('name', `${e.target.closest('div').innerText}`)
    }

    if (e.target.classList.contains('removeTodo')) {
        e.target.closest('div').remove()
    }
})