import deepFreeze from 'deep-freeze'

import * as reducers from '../reducers'

jest.mock('shortid', () => ({generate: jest.fn(() => 42)}))

describe('reducers', () => {

    let todo, list

    beforeEach(() => {

        todo = deepFreeze({
            id: 42,
            description: 'xxx',
            completed: true
        })

        list = deepFreeze([{...todo, completed: false}])
    })

    it('should add a new todo', () => {
        const result = reducers.add([], 'xxx')
        expect(result).toEqual(list)
    })

    it('should update a todo with a new description', () => {
        const expected = [{...list[0], description: 'yyy'}]
        const result = reducers.update(list, {id: 42, value: 'yyy'})
        expect(result).toEqual(expected)
    })

    it(`should update a todo's completion state`, () => {
        const expected = [todo]
        const result = reducers.complete(list, {id: 42, value: true})
        expect(result).toEqual(expected)
    })

    it('should remove a todo', () => {
        const result = reducers.remove(list, 42)
        expect(result).toEqual([])
    })

    it('should remove completed todos', () => {
        const completed = [{...list[0], completed: true}]
        const result = reducers.purge(completed)
        expect(result).toEqual([])
    })

    it('should toggle completed todos', () => {
        const result = reducers.toggle(list)
        expect(result).toEqual([todo])
    })

    it('should return new data', () => {
        var result = reducers.remove(list, 1)
        expect(result).not.toBe(list)
    })

})
