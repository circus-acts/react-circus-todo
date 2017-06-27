import { render } from 'react-dom'
import { router } from './router'
import actions from './actions'
import circuit from './circuit'
import view from './view.jsx'

// Set up some mock data to prime the circuit
const testData = {
  todos:[
    { id: 1, description: '1st todo', completed: false },
    { id: 2, description: '2nd todo', completed: true }
  ]
}

const app = component => render(component, document.querySelector('#todo'))

// In this example, the model is already lifted into the circuit,
// so we just need to map over it and tap the output.
circuit.map(view).tap(app).prime(testData)

router.switch({
  '/completed' : actions.COMPLETED,
  '/active' : actions.ACTIVE,
  '/*' : actions.ALL
}).signal()
