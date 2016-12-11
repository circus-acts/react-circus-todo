jest.mock('../reducers')

import {add, remove} from '../reducers'
import circuit from '../circuit'
import {ACTIVE} from '../filters'

const {channels, signals} = circuit

describe('circuit', () => {

  beforeEach(() => {
    circuit.prime({todos: ['td1']})
  })

  it('should signal to reducers', () => {
    channels.todos.remove(0)
    expect(remove).toHaveBeenCalledWith(['td1'], 0)
  })

  it('should propagate state changes', () => {
    add.mockImplementation((a, v) => a.concat(v))
    channels.todos.add('a new todo')
    expect(circuit.value().todos).toEqual(['td1', 'a new todo'])
  })

  it('should set a filter constant', () => {
    channels.filterBy.ACTIVE()
    expect(circuit.value().filterBy).toEqual(ACTIVE)
  })
})
