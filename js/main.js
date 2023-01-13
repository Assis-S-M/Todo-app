// Nota importante: Todas as tarefas tem o prefixo 'todo-' nos seus id's seguidos de seus textos com traços '-' no lugar de espaços

// Inicia o aplicativo de tarefas mostrando todas as tarefas
window.addEventListener('load', () => {
    getFromLocalStorage()

    todos.forEach((item) => {
        item.display = true
    })

    addToLocalStorage(todos)
    renderPage(todos)
    renderTodos(todos)
})

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
const paginas = document.querySelector('#paginas')

// Array de tarefas para o localStorage, muito importante já que quase quase tudo no sistema usa esse array como referencia
let todos = []

// Array de itens filtrados, importante para exibi-los corretamente no modo de filtragem
let filteredItens = []

// Variaveis de paginação
let paginaAtual = 0
let numeroPaginas = Math.floor(todos.length / 5)
let minIndex = (5 * paginaAtual)
let maxIndex = (minIndex + 4)

//Variáveis de pesquisa
let inSearch = false
let inFilter = false

// Funções
const saveTodo = (text) => {

    // Mapeia o array inicial e cria um novo somente com o id dos objetos, faz um check para saber se já não tem um objeto com o mesmo id (mesmo nome) no array
    if (text && todos.map(e => e.id).indexOf(`todo-${text.replace(/\s/g, '-')}`) == -1) {
        todos.push({
            id: `todo-${text.replace(/\s/g, '-')}`,
            nome: text,
            done: false,
            display: true
        })
        
        addToLocalStorage(todos)
    } else {
        alert('Nome de tarefa invalido ou tarefa já existe!')
    }

    todoInput.value = ""
    todoInput.focus()
    
    renderPage(todos)
    renderTodos(todos)
}

// Atualiza as listas de tarefas
const renderTodos = () => {
    todoList.innerHTML = ''

    if (inFilter) {

        // O que esse loop forEach faz é pegar somente os itens que estão em display (itens filtrados pelo filter.addEventListener) e os organizar em um novo array
        todos.forEach((item) => {
            if (item.display) {
                filteredItens.push(item)
            }
        })

        // Renderiza a paginação com o novo array, se esssa função não fosse chamada a paginação não ficaria sincronizada
        renderPage(filteredItens)

        filteredItens.forEach((item) => {
            if (inSearch || filteredItens.indexOf(item) >= minIndex && filteredItens.indexOf(item) <= maxIndex) {
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
            }
        })

        filteredItens = []
    } else {
    
        todos.forEach((item) => {

        if (inSearch || todos.indexOf(item) >= minIndex && todos.indexOf(item) <= maxIndex) {

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
        }
    })
}}

const editTodos = (oldText, newText) => {

    // A variavel oldText vem do botão de submit do formulario de edição, do seu atributo name pra ser especifico
    // A variavel newText vem do inpout de edição, o que é o comportamento normal

    // Loop forEach que faz um check de equalidade com o newText transformado em id até achar um item correspondente e altera-lo
    todos.forEach((item) => {
        if (item.id == `todo-${oldText.replace(/\s/g, '-')}`) {
            item.nome = newText
            item.id = `todo-${newText.replace(/\s/g, '-')}`
        }
    })

    addToLocalStorage(todos)
    renderPage(todos)
    renderTodos(todos)
    toggleForms()
}

const searchTodos = (search) => {

    // Loop forEach que faz um check de equalidade com a search transformada em id até achar um item correspondente e altera-lo
    todos.forEach((item) => {
        if(search && item.id == `todo-${search.replace(/\s/g, '-')}`) {
            item.display = true
        } else {
            item.display = false
        }
    })

    addToLocalStorage(todos)
    renderPage(todos)
    renderTodos(todos)
}

const filterTodos = (filter) => {

    // Loop forEach e condicionais para 'filtrar' (esconder) as tarefas que não cumpram os requesitos
    todos.forEach((item) => {
        if (filter == 'done') {
            
            inFilter = true

            if (item.done) {
                item.display = true
            } else {
                item.display = false
            }
        } else if (filter == 'ongoing') {

            inFilter = true

            if (item.done) {
                item.display = false
            } else {
                item.display = true
            }
        } else if (filter == 'all') {
            inFilter = false
            item.display = true
        }
    })

    addToLocalStorage(todos)
    renderPage(todos)
    renderTodos(todos)
}

const toggleForms = () => {
    todoForm.classList.toggle('hide')
    editForm.classList.toggle('hide')
    todoList.classList.toggle('hide')
}

// Função de atualização de paginas (Atualiza as variaveis de paginação de acordo com o tamanho do array)
const renderPage = (array) => {
    numeroPaginas = Math.floor(array.length / 5)
    minIndex = (5 * paginaAtual)
    maxIndex = (minIndex + 4)

    if (array.length > 5) {
      paginas.removeAttribute('style')
    } else if (array.length <= 5 && paginaAtual == 0) {
      paginas.setAttribute('style', 'display: none;')
    }
}

// Função que transforma o array das tarefas em String e envia para o armazenamento interno do dispositivo
const addToLocalStorage = (todos) => {
    localStorage.setItem('todos', JSON.stringify(todos))
    
}

// Função oposta a addToLocalStorage
const getFromLocalStorage = () => {
    if (localStorage.getItem('todos')) {
        todos = JSON.parse(localStorage.getItem('todos'))
    }
}

// Event listeners
todoForm.addEventListener('submit', (e) => {
    e.preventDefault()

    if(todoInput.value) {
        saveTodo(todoInput.value.trim())
    }
})

editForm.addEventListener('submit', (e) => {
    e.preventDefault()

    if(e.submitter.id == 'cancelEditBtn') {
        toggleForms()
    } else if ((editInput.value.trim() != '') && e.submitter.id == 'editConfirm') {
        editTodos(e.submitter.name.trim(), editInput.value.trim())
    }
})

searchForm.addEventListener('submit', (e) => {
    e.preventDefault()

    if ((searchInput.value.trim() != '') && e.submitter.id == 'searchButton') {
        inSearch = true
        searchTodos(searchInput.value.trim())

    } else if (e.submitter.id == 'eraseButton') {

        todos.forEach((item) => {
            item.display = true
        })

        searchInput.value = ''
        inSearch = false

        addToLocalStorage(todos)
        renderPage(todos)
        renderTodos(todos)
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
        renderPage(todos)
        renderTodos(todos)
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
        renderPage(todos)
        renderTodos(todos)
    }

    if (e.target.classList.contains('pageDown') && paginaAtual > 0) {
        paginaAtual--

        renderPage(todos)
        renderTodos(todos)
    }

    if (e.target.classList.contains('pageUp') && paginaAtual < numeroPaginas) {
        paginaAtual++

        renderPage(todos)
        renderTodos(todos)
    }
})