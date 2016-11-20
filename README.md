# CircuitJS Todo

Applying basic circuit principles to the standard TODO demonstrating:

* functional units with strong separation of concerns
* app state as circuit values
* minimal boilerplate

## Start

`npm install`

`npm start`

Go to `localhost:8080`

## Test

`npm test` or `npm test -- --watch`

## Circuit recap...

An application uses the CircuitJS API to define a circuit, a signal based representation of an application's actions and values and how they relate to one another over time.

The basic idea, and this example is using circuits at a *very* basic level, is to propagate different values to different functions using a declarative syntax. The great thing about this is that we can say quite a lot about the shape of an application without having to define any of its functional behaviour. This leads to a very clean separation of concerns.

The following circuit captures the essential shape of a TODO app in terms of its actions and values:

```javascript
// circuit.js
import Circuit from 'circuit-js'

const {circuit, merge} = new Circuit()

export default circuit({
  todos: merge({
    add,
    update,
    complete,
    remove,
    purge,
    toggle
  }),
  filterBy: merge({
    ALL,
    ACTIVE,
    COMPLETED
  }),
  editing
})
```

If CircuitJS is new to you, you'll need to know a bit more about circuit syntax to make sense of this code:

* Circuits are constructed using standard object syntax.
* Key values (remember `{add}` is really `{add: add}`) define channels and join points.
* **add** is a channel. Channels introduce new values into the circuit.
* **todos** is a join point. Join points control how values propagate through the circuit.
* In [merge](merge) type join points, incoming channel values replace the current join point value.
* Circuits, channels and join points are all [signals](signals).

### Testing
Circuits are functional units and they can be tested in isolation. This is particularly powerful when circuits become more complex - there are many exotic join points that control circuit propagation in lots of interesting ways.

But this circuit isn't quite ready to be tested. A small but annoying downside to standard object syntax, from our immediate point of view, is that all object references need to be defined. They need to be imported:

```javascript
// circuit.js
import {add, update, complete, delete, purge, toggle} from './reducers'
import {ALL, ACTIVE, COMPLETED} from './filters'
...
```
Now the circuit can be tested. Using Jest to mock the reducers:
```javascript
// __tests__/circuit.js
jest.mock('../reducers')

import circuit from '../circuit'
import {ACTIVE} from '../filter'

const {channels, signals} = circuit

describe('circuit', () => {
  it('should add a new todo', () => {
     channels.todos.add('a new todo')
     expect(signals.todos.value()).toEqual('a new todo')
  })

  it('should set a filter constant', () => {
     channels.filterBy.ACTIVE()
     expect(signals.filterBy.value()).toEqual(ACTIVE)
  })
})

```

With the circuit defined, how does this impact on the rest of the application? It minimises boilerplate.

### Reducers
The channels exposed by the circuit are signals. A signal is a mechanism that accepts a value and (optionally) delivers it to a function. Ie, it *signals* the value to the function. The function arguments will depend on the [signal context](signal.context), and this will depend on how the signal is bound to the circuit.

When a signal is added to a merge join point, CircuitJS binds it to a reducing context. This context allows the signal to deliver both the join point value and the channel value together. Any function lifted into the signal will receive both of these values. The value returned by the function will replace the join point value.

The add function looks like this...

```javascript
// reducers.js

export const add = (todos, description) => todos.concat({
  id: generate(),
  description,
  completed: false
})
```

...and it returns a new, amended todo list. This function is very easy to test.

The same pattern applies to all of the other reducer functions:
```javascript
...

export const update = (todos, {id, value}) => todos.map(todo => {
  return todo.id !== id? todo : {...todo, description: value }
})

export const complete = (todos, {id, value}) => todos.map(todo => {
  return todo.id !== id? todo : {...todo, completed: value }
})

export const remove = (todos, id) => todos.filter(todo => todo.id !== id)

export const purge = todos => todos.filter(todo => !todo.completed)

export const toggle = completed => todos => {
  completed = !completed
  return todos.map(todo => ({...todo, completed}))
}(false)
```
All of these reducer functions are just that - pure JavaScript functions. They are made special by lifting them into signals, which in this simple example happens when the circuit function is called with an object that directly references the reducer functions. In more advanced circuits, functions can be lifted into signals and these in turn lifted into the circuit. Circuits are composable.

### Filters
The filter channels are also merged, and therefore also reducers. But the interesting aspect here is that CONSTANTS rather than functions are lifted into the channel signals. No further work is required:

```javascript
// filters.js
export const ALL = 'ALL'
export const ACTIVE = 'ACTIVE'
export const COMPLETED = 'COMPLETED'
```

There's not much magic going on. CircuitJS just takes each value and wraps it in an identity function with the result that whenever a filter is signalled it will propagate a constant value. The net effect being that **filterBy** will switch between the three constant values ALL, ACTIVE and COMPLETE.

### The View
The view in this application is a set of React components. Its purpose, from a functional perspective, is to complete the circuit:

* The circuit propagates values through to the view.
* The view signals user input events on circuit channels.

A schematic diagram might help here.  **v1** and **v2** are input event values signalled on the **add** channel at arbitrary points in time. The direction of value propagation is towards the circuit:
```
PROPAGATION
| SIGNALS   TIMELINE ->
| add:      ------------v1----------------v2---------------------->
| todos:    []-----------[v1]--------------[v1, v2]--------------->
V circuit:  {todos: []}---{todos: [v1]}-----{todos: [v1, v2]}----->
```

The main view component will receive its props directly from the circuit. User input events are wired up to circuit channels; either directly, or through a HOF that extracts relevant event data.

To reduce clutter, all of the event handlers required to wire up the view are defined in helper module called [actions.js](actions).

In the view:

```javascript
// view.js
import actions from './actions'
export default props => (<div>
  ...
    <input className="new-todo"
        placeholder="What needs to be done?"
        onChange={actions.add} />
  ...
</div>)
```

A typical channel binding:

```javascript
// actions.js
import circuit from './circuit'

const {todos} = circuit.channels

const fromEvent = channel => ({target}) => {
  channel(target.value)
}

export default actions = {
  add: fromEvent(todos.add),
  ...
```


### Putting it all together - the App
This TODO app uses React and this works very well with CircuitJS. But the fact is, CircuitJS is completely view agnostic.

Circuits propagate values to functions. By lifting the view into the circuit, the view will receive circuit values whenever any of the values are signalled.

```javascript
//index.js
import { render } from 'react-dom'
import circuit from './circuit'
import view from './view.jsx'

circuit.tap(data =>
  render(view(data), document.querySelector('#todo'))
)
```

But hey! Circuits are signals and signals are lazy. This circuit is waiting to be signalled. This might be an asynchronous message from the server or a route change or it might be something as simple as a nudge. A good time to set the initial state...

```javascript
//index.js
...

circuit.input({todos: []})
```

The circuit is complete and now it's active.

# Summary

* The defining module in the TODO app is the circuit - it defines the shape of the app in terms of channels and join points.
* Reducer functions are lifted into the circuit's routing channels.
* The primary view is lifted into the circuit's outer channel.
* User events are wired up to channel inputs.
* the whole thing is kick-started by signalling the circuit.


### Copyright

Source code is licensed under the ISC License (ISC). See [LICENSE](./LICENSE)
file in the project root. Documentation to the project is licensed under the
[CC BY 4.0](http://creativecommons.org/licenses/by/4.0/) license.
