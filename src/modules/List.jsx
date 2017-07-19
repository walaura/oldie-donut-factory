import React from 'react';

export default class List extends React.Component {
    render() {
        return (
            <div>
                {
                    this.props.items.map(item => (
                        <div>donut ({item.value})</div>
                    ))
                }
            </div>
        )
    }
}
