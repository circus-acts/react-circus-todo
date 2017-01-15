# circuit-js Todo

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

An application uses the circuit-js API to define a circuit, a signal based representation of an application's actions and values and how they relate to one another over time.

The basic idea, and this example is using circuits at a *very* basic level, is to propagate different values to different functions through a declarative syntax. The great thing about this is that we can say quite a lot about the shape of an application without having to define any of its functional behaviour. This leads to a very clean separation of concerns.

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

If [circuit-js](https://github.com/circus-acts/circuit-js) is new to you, you'll need to know a bit more about circuit syntax to make sense of this code:

* Circuits are constructed using standard object syntax.
* Key values (remember `{add}` is really `{add: add}`) define channels and join points.
* **add** is a channel. Channels introduce new values into the circuit through signals.
* **todos** is a join point. Join points control how signals propagate through the circuit.
* In [merge](https://github.com/circus-acts/circuit-js/merge) type join points, incoming signal values replace the current join point value.
* Circuits, channels and join points can all be [signalled](https://github.com/circus-acts/circuit-js/doc/signals.md).
* Functions are lifted into signal propagation through channel operators.

So, for example, a new item signalled on the **add** channel will be merged with the current list of todos and propagated through the circuit. Because the circuit is also a channel, any functions connected at this level (a view?) will be signalled with the latest circuit value which includes the new item.

### Testing
Circuits are functional units and they can be tested in isolation. This is particularly powerful when circuits become more complex - there are many exotic join points that control circuit propagation in lots of interesting ways.

But this circuit isn't quite ready to be tested. A small but annoying downside to standard object syntax, at least from our immediate point of view, is that all object references need to be defined. They can be imported:

```javascript
// circuit.js
import {add, update, complete, delete, purge, toggle} from './reducers'
import {ALL, ACTIVE, COMPLETED} from './filters'
...
```
Now the circuit can be tested:
```javascript
// __tests__/circuit.js

import circuit from '../circuit'
import {ACTIVE} from '../filter'

const {signals} = circuit

describe('circuit', () => {
  it('should add a new todo', () => {
     signals.todos.add('a new todo')
     expect(circuit.value().todos).toEqual('a new todo')
  })

  it('should set a filter constant', () => {
     signals.filterBy.ACTIVE()
     expect(circuit.value().filterBy).toEqual(ACTIVE)
  })
})

```

With the circuit defined, how does this impact on the rest of the application? It minimises boilerplate by removing the need to explicitly declare state or action types without sacrificing the identity of either.

* State is held by the circuit through its channels and does not need to be explicitly defined.
* State is accessed by tapping into the circuit at various points. No extraneous mapping is needed.
* Actions *do* exist, but usually as simple signal bindings.
* Signal propagation is the single mechanism responsible for setting circuit state and reacting to it.

### Circuit functions
The channels exposed by the circuit can be signalled. A signal is a propagation mechanism that accepts a value and (optionally) delivers it to a function. Ie, it *signals* the value to the function. The function arguments will depend on the [signal context](signal.context), and this will depend on how the signal is bound to the circuit.

When a signal is added to a merge join point, circuit-js binds it to a reducing context. This context allows the signal to deliver both the join point value and the channel value together. Any function lifted into the signal will receive both of these values. The value returned by the function will replace the join point value.

The add function adheres to this pattern looks like this...

```javascript
// reducers.js

export const add = (todos, description) => todos.concat({
  id: generate(),
  description,
  completed: false
})
```

It returns a new and amended todo list. This function is very easy to test.

The same pattern applies to all of the [other reducer functions]() including the filters.

The filter channels are also merged, and therefore also reducers. But the interesting aspect here is that CONSTANTS rather than functions are lifted into the channel signals. No further work is required:

```javascript
// filters.js
export const ALL = 'ALL'
export const ACTIVE = 'ACTIVE'
export const COMPLETED = 'COMPLETED'
```

There's not much magic going on. circuit-js just takes each value and wraps it in an identity function with the result that whenever a filter is signalled it will propagate a constant value. The net effect being that **filterBy** will switch between the three constant values ALL, ACTIVE and COMPLETE.

### The View
The view in this application is a set of React components. Its purpose, from a functional perspective, is to complete the circuit:

* The circuit propagates values through to the view.
* The view signals user input events on circuit channels.
* The signalled values propagate to the reducer functions.
* The reducers return new values to the circuit
* The circuit propagates...

The main view component will receive its props directly from the circuit and user input events are wired up to circuit channels through a set of imported helper functions called actions.

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

Actions simply reduce code clutter by abstracting the bindings required to connect input events to signals. the `actions.add` binding above is defined in the [actions.js]() module as (simplified here):

```javascript
// actions.js
import circuit from './circuit'

const {todos} = circuit.signals
const fromEvent = signal => ({target}) => signal(target.value)

export default actions = {
  add: fromEvent(todos.add),
  ...
```


### Putting it all together - the App

Circuits propagate values to functions. By lifting the view into the circuit, the view will receive circuit values whenever any of the channels are signalled.

```javascript
//index.js
import { render } from 'react-dom'
import circuit from './circuit'
import view from './view.jsx'

const app = component => render(component, document.querySelector('#todo'))

circuit.map(view).tap(app)
```

But hey! Circuits are channels and channels are lazy. This circuit is waiting for its first signal. This might be an asynchronous message from the server or a route change or it might be something as simple as a nudge - in this case by signalling the initial state...

```javascript
//index.js
...

circuit.signal({todos: []})
```

The circuit is complete and now that it has been signalled - it's active.

# Summary

* The architectural module in the TODO app is the circuit.
* The circuit defines the shape of the app in terms of channels and join points.
* It holds the state of the app and determines state changes through signalling.
* Reducer functions are lifted into the circuit's routing channels.
* The primary view is lifted into the circuit's outer channel.
* User events are wired up to channel signals.
* the whole thing is kick-started by signalling the circuit.


### Copyright

Source code is licensed under the ISC License (ISC). See [LICENSE](./LICENSE)
file in the project root. Documentation to the project is licensed under the
[CC BY 4.0](http://creativecommons.org/licenses/by/4.0/) license.
