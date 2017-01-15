import {utils} from 'circuit-js'

const circuit = require.requireActual('../circuit').default

export default {
    signals: utils.map(circuit, signal => jest.fn())
}
