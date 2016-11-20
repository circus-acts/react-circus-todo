import {generate} from 'shortid'

// The circuit reducing pattern merges incoming signal channels into an outgoing
// reducing channel: A, B -> A

export const add = (todos, description) => todos.concat({
  id: generate(),
  description,
  completed: false
})

export const update = (todos, {id, value}) => todos.map(todo => {
  return todo.id !== id? todo : {...todo, description: value }
})

export const complete =(todos, {id, value}) => todos.map(todo => {
  return todo.id !== id? todo : {...todo, completed: value }
})

export const remove = (todos, id) => todos.filter(todo => todo.id !== id)

export const purge = todos => todos.filter(todo => !todo.completed)

export const toggle = (completed => todos => {
  completed = !completed
  return todos.map(todo => ({...todo, completed}))
})(false)
