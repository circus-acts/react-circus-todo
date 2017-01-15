jest.mock('../circuit')

import circuit from '../circuit'
import actions from '../actions'

const {filterBy, todos} = circuit.signals

describe('actions', () => {

    it('should expose channel signals - filters', () => {
        expect(actions.ALL).toBe(filterBy.ALL)
        expect(actions.ACTIVE).toBe(filterBy.ACTIVE)
        expect(actions.COMPLETED).toBe(filterBy.COMPLETED)
    })

    it('should wait until user hits return', () => {
        actions.add({keyCode: 65, target: {type: 'value', value: 'xxx'}})
        expect(todos.add).not.toHaveBeenCalled()
    })

    it('should extract event target value - add', () => {
        actions.add({keyCode: 13, target: {type: 'value', value: 'xxx'}})
        expect(todos.add).toHaveBeenCalledWith('xxx')
    })

    it('should bind identity to actions - remove', () => {
        actions.bind(123).remove()
        expect(todos.remove).toHaveBeenCalledWith(123)
    })

    it('should extract event values - update', () => {
        actions.bind(123).update({keyCode: 13, target: {type: 'value', value: 'xxx'}})
        expect(todos.update).toHaveBeenCalledWith({id: 123, value: 'xxx'})
    })

    it('should extract event values - complete', () => {
        actions.bind(123).complete({target: {type: 'checkbox', checked: true}})
        expect(todos.complete).toHaveBeenCalledWith({id: 123, value: true})
    })

})
