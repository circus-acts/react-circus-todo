jest.mock('../reducers')

import {add} from '../reducers'
import circuit from '../circuit'
import {ACTIVE} from '../filters'

const {channels, signals} = circuit

describe('circuit', () => {

  beforeEach(() => {
    circuit.prime({todos: ['td1']})
  })

  it('should add a new todo', () => {
   channels.todos.add('a new todo')
   expect(add).toHaveBeenCalledWith(['td1'], 'a new todo')
  })

  it('should set a filter constant', () => {
   channels.filterBy.ACTIVE()
   expect(signals.filterBy.value()).toEqual(ACTIVE)
  })
})
