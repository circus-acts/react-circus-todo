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
// In this example, the model is already lifted into the circuit, so we just
// need to tap it into a mounted view.
circuit.tap(data =>
    render(view(data), document.querySelector('#todo'))
)

// push the mocked data to start the app - circuits are lazy
circuit.input(testData)
