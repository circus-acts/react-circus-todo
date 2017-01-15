import { render } from 'react-dom'
import circuit from './circuit'
import view from './view.jsx'
import {ALL} from './filters'

// Set up some mock data to initialize the circuit
const testData = {
  todos:[
    { id: 1, description: '1st todo', completed: false },
    { id: 2, description: '2nd todo', completed: true }
  ],
  filterBy: ALL
}

const app = component => render(component, document.querySelector('#todo'))

// In this example, the model is already lifted into the circuit,
// so we just need to map over it and tap the output.
circuit.map(view).tap(app)

// signal the mocked data to start the app - circuits are lazy
circuit.signal(testData)
