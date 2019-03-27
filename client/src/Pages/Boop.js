import React, { Component } from 'react';


export default class Boop extends Component {
    constructor(props) {
        super(props);
        this.state = {message: 'default'};
    }
    componentDidMount() {
        this.setState({
            message: 'hello'
        })
    }

    render() {
        return (<div>{this.state.message}</div>)
    }
}
