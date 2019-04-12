import React, { Component } from 'react';

import { ResultList } from '../Libraries/ComponentsLibrary';
import { theme, ThemeProvider } from '../Libraries/ReactToolboxLibrary';

import '../assets/react-toolbox/theme.css';

const formatForResultList = apiResponse => apiResponse.map((record, index) => ({
  term: record.term,
  action: record.action,
  entry_id: index,

  rejectCb: function () {
    fetch(`/requested/${record.term}?action=rejected`, {
      method: 'POST'
    })
  },

  acceptCb: function () {
    fetch(`/requested/${record.term}?action=accepted`, {
      method: 'POST'
    })
  }
}))


export default class PotentialTerms extends Component {
  state = {
    terms: []
  }

  componentDidMount () {
    const { auth } = this.props
    if (!auth.isAuthenticated()) { auth.login(); }

    fetch('/requested')
      .then(res => res.json())
      .then(formatForResultList)
      .then(terms => this.setState({ terms }))
  }

  render() {
    const { terms } = this.state
    const { auth } = this.props

    const results = terms.length === 0
      ? <h5 style={{textAlign: 'center'}}>No potential terms</h5>
      : <ResultList
            style={{display:"flex", flexDirection:"column", alignContent:"center"}}
            entries={terms} />
    return (
      <ThemeProvider theme={theme}>
        <div>
          {auth.isAuthenticated() && results}
        </div>
      </ThemeProvider>
    )
  }
}
