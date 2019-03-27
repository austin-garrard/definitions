import React, { Component } from 'react';
//import Auth from './Auth.js';

import { ResultList } from '../Libraries/ComponentsLibrary';
import { theme, ThemeProvider } from '../Libraries/ReactToolboxLibrary';

import '../assets/react-toolbox/theme.css';

class PotentialDefs extends Component {

    constructor() {
        super();
        this.state = {
            potentials: []
        }
    }

  componentDidMount(){
      let { auth } = this.props;
      if(!auth.isAuthenticated()) { auth.login(); }

      fetch('/entries/potentials').then(res => {return res.json()}).then((res) => this.setState({potentials: res}));
  }

  render() {
    //fix this up:
    return (
    <ThemeProvider theme={theme}>
      <div>
        {this.props.auth.isAuthenticated() && <ResultList style={{display:"flex", flexDirection:"column", alignContent:"center"}} entries={this.state.potentials}/>}
      </div>
    </ThemeProvider>
    );
  }

}

export default PotentialDefs;