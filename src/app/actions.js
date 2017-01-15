// The actions defined here simply push event values into circuit signals.

import circuit from './circuit'
const {filterBy, editing, todos} = circuit.signals

// Create a helper function to get event value by type and push it into a signal.
const fromEvent = (signal, id) => ({keyCode, type, target}) => {
  if (keyCode === 13 || type === 'blur' || target.type === 'checkbox') {
    const value = target[target.type === 'checkbox' ? 'checked' : 'value']
    if (id === 'add') {
      signal(value)
      target.value = ''
    }
    else signal({id, value})
  }
}

const actions = {
  add: fromEvent(todos.add, 'add'),
  // the following signals are wrapped in a binding identity
  bind: id => ({
    update: fromEvent(todos.update, id),
    complete: fromEvent(todos.complete, id),
    remove: () => todos.remove(id),
    edit: () => editing(id)
  }),

  // pass these signals through unchanged - just for convenience really
  purge: todos.purge,
  toggle: todos.toggle,
  ALL: filterBy.ALL,
  ACTIVE: filterBy.ACTIVE,
  COMPLETED: filterBy.COMPLETED
}

export default actions
