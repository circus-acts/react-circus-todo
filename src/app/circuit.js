import Circuit from 'circuit-js'

import {add, update, complete, remove, purge, toggle} from './reducers'
import filterBy, {ALL, ACTIVE, COMPLETED} from './filters'

const {circuit, merge, channel} = new Circuit()

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
  editing: channel().pulse()

}).map(filterBy)
