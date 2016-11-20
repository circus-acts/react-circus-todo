import React from 'react'

// User actions are bound to the circuit input channels through a set of helper functions.
import actions from './actions'

import {ALL, ACTIVE, COMPLETED} from './filters'

export const Todo = ({editing, data, actions}) => {
  const { description, completed } = data

  return editing
  ? <input
      className="edit"
      defaultValue={description}
      onKeyUp={actions.update}
      onBlur={actions.update}
      autoFocus />

  : <li className={completed && 'completed'}>
    <div className="view">
      <input
        className="toggle"
        type="checkbox"
        checked={completed}
        onChange={actions.complete} />
      <label onDoubleClick={actions.edit}>{description}</label>
      <button
        className="destroy"
        type="checkbox"
        onClick={actions.remove} />
    </div>
  </li>
}

const cap = str => str[0] + str.substr(1).toLowerCase()

export const Filter = ({by, filterBy}) => (
  <li><a className={filterBy===by ? 'selected' : ''} onClick={actions[by]}>{cap(by)}</a></li>
)

// The main view will receive its props directly from the circuit.
export default ({todos, editing, remaining, total, filterBy}) => (
  <div className="todoapp">
    <div className="header">
      <h1>todos</h1>
      <input
        className="new-todo"
        placeholder="What needs to be done?"
        onKeyUp={actions.add}
        autoFocus />
    </div>
    <section className="main">
      <input
        type="checkbox"
        className="toggle-all"
        onClick={actions.toggle} />
      <ul className="todo-list">
        {todos.map(todo =>
          <Todo
            key={todo.id}
            editing={todo.id===editing}
            actions={actions.bind(todo.id)}
            data={todo}
          />
        )}
      </ul>
    </section>
    {!!total && <footer className="footer">
      <span className="todo-count">{`${remaining} item${remaining === 1 ? '' : 's'} left`}</span>
      <ul className="filters">
        <Filter {...{filterBy, by: ALL}}/>
        <Filter {...{filterBy, by: ACTIVE}}/>
        <Filter {...{filterBy, by: COMPLETED}}/>
      </ul>
      <button className="clear-completed" onClick={actions.purge}>Clear completed</button>
    </footer>}
  </div>
)
