import React from 'react'
import renderer from 'react-test-renderer'
import View, {Todo, Filter} from '../view'
import actions from '../actions'
import {ALL, ACTIVE, COMPLETED} from '../filters'

describe('view', () => {

    it('should render a todo', () => {
        const data = {
            description: 'item 1',
            completed: false
        }
        const component = renderer.create(
            <Todo data={data} actions={actions}/>
        );
        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    })

    it('should render a todo for editing', () => {
        const data = {
            description: 'item 1',
            completed: false
        }
        const component = renderer.create(
            <Todo editing data={data} actions={actions}/>
        );
        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    })

    it('should render a selected filter', () => {
        const component = renderer.create(
            <Filter by={ALL} filterBy={ALL}/>
        );
        let tree = component.toJSON();
        expect(tree.children[0].props.className).toBe('selected')
        expect(tree).toMatchSnapshot();
    })

    it('should render an un-selected filter', () => {
        const component = renderer.create(
            <Filter by={ALL} filterBy={ACTIVE}/>
        );
        let tree = component.toJSON();
        expect(tree.children[0].props.className).toBe('')
        expect(tree).toMatchSnapshot();
    })

    it('should render a view', () => {
        const data = {
            todos: []
        }
        const component = renderer.create(
            <View {...data}/>
        );
        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    })

})
