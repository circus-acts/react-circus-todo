import deepFreeze from 'deep-freeze'

import filter, {ALL, COMPLETED, ACTIVE} from '../filters'

describe('filters', () => {

    const data = deepFreeze({
        todos: [
            {completed: true},
            {completed: false}
        ],
        filterBy: ALL
    })

    it('should filter by all data', () => {
        expect(filter(data).todos).toEqual(data.todos)
    })

    it('should filter by completed data', () => {
        expect(filter({...data, filterBy: COMPLETED}).todos).toEqual([data.todos[0]])
    })

    it('should filter by active data', () => {
        expect(filter({...data, filterBy: ACTIVE}).todos).toEqual([data.todos[1]])
    })

    it('should return denormalised data', () => {
        expect(filter(data).remaining).toBe(1)
        expect(filter(data).total).toBe(2)
    })

})
