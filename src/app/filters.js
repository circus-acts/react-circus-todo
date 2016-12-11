//Export some constants to share through the app.
export const ALL = 'ALL'
export const ACTIVE = 'ACTIVE'
export const COMPLETED = 'COMPLETED'

// This function will be mapped over the circuit output so its signature
// is going to match the values provided by the primary circuit channels.

export default channels => {
  const {todos = [], filterBy} = channels
  return {
    ...channels,
    todos: todos.filter(todo => {
      switch (filterBy) {
        case COMPLETED: return todo.completed
        case ACTIVE: return !todo.completed
        default: return true
      }
    }),
    total: todos.length,
    remaining: todos.reduce((r, todo) => r + (todo.completed? 0 : 1), 0)
  }
}
