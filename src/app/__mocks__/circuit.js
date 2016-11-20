import {utils} from 'circuuit-js'

const circuit = require.requireActual('../circuit').default

export default {
    channels: utils.map(circuit, signal => jest.fn())
}
