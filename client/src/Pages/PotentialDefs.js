import React, { Component } from 'react';

import { ResultList } from '../Libraries/ComponentsLibrary';
import { theme, ThemeProvider } from '../Libraries/ReactToolboxLibrary';

import '../assets/react-toolbox/theme.css';

const formatForResultList = apiResponse => apiResponse.map(record => 
  Object.assign(record, {
    rejectCb: function () {
       alert("reject potential definition: " + this.term + " id: " + this.entry_id);
       fetch('/entries/setstatus/3/id/' + this.entry_id, {method: 'POST'});
    },

    acceptCb: function () {
       alert("reject potential definition: " + this.props.entry.term + " id: " + this.props.entry.entry_id);
       fetch('/entries/setstatus/3/id/' + this.props.entry.entry_id, {method: 'POST'});
    }
  })
)

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

    fetch('/entries/potentials')
      .then(res => {return res.json()})
      .then(formatForResultList)
      .then(res => this.setState({potentials: res}));
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
