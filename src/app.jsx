import React from 'react';
import List from './modules/List';
import Donut from './objects/donut';

export default class App extends React.Component {

    constructor(props) {
        super(props);

        this.addDonut = this.addDonut.bind(this);
        this.state = {
            items: []
        };
    }

    addDonut() {
        this.setState({
            items: [...this.state.items, new Donut()]
        });
    }

    render() {
        return (
            <div>
                {
                    this.state.items.map((item,k) => (
                        <div key={k}>donut ({item.value})</div>
                    ))
                }
                <button onClick={this.addDonut}>+</button>
            </div>
        )
    }
}
