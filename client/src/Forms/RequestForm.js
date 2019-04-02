import React, {Component} from 'react';
import Form from './FormComponent';
import {theme, ThemeProvider} from "../Libraries/ReactToolboxLibrary";

export default class RequestForm extends Component {
  constructor(props) {
    super(props);
    this.state = {Term:'', showErrorTerm: false, stateBar: false, snackbarMessage: ''};
  }

  createContent = () => {
    return (<div>
      <p>I'm collecting informal definitions to help people understand LGBTQ+ terms they don't know!</p>
      <p>You can request a term here that you want someone else to define.</p>
      <p> Check out the <a href='http://queerundefined.com/about'>about</a> page to read more about this project.</p>
    </div>)
  }

  handleSubmit(e) {
    if(e) e.preventDefault();
    const term = this.state.Term;
    if(term.trim().length === 0) {
      const snackBarMessage = 'You should provide a term!'
      this.setState({stateBar: true, showErrorTerm: true, snackbarMessage: snackBarMessage})
    }
    else {
      fetch('/requested/' + term, {method: 'POST'})
        .then(response => {
          let snackBarMessage = 'Your request for '.concat(term).concat(' was successful')
          if(response.status !== 200)
            snackBarMessage = 'Oh no! Something went wrong, please try again.'

          this.setState({stateBar: true, Term: '', snackbarMessage: snackBarMessage})
        });
    }
  }

  handleSnackbarClick = (event, instance) => {
    this.setState({ stateBar: false, snackbarMessage: ''});
  };

  handleSnackbarTimeout = (event, instance) => {
    this.setState({stateBar: false, snackbarMessage: ''});
  };

  handleChange = (label, isRequired, showError, value) => {
    if(value.length === 0 && isRequired)
      this.setState({...this.state, [label]: value, [showError]: true});
    else
      this.setState({...this.state, [label]: value, [showError]: false});
  };

  render() {
    const { showErrorTerm, Term, stateBar, snackbarMessage } = this.state;

    return (
      <ThemeProvider theme={theme}>
        <Form title='Request a Term'
              content={this.createContent()}
              inputs={[
                {labelInput: 'What term do you want defined?', isRequired: true, label:'Term', value: Term,
                  onChange:this.handleChange, showError: showErrorTerm}
                ]}
              onSubmit={this.handleSubmit.bind(this)}
              onClickSnackBar={this.handleSnackbarClick.bind(this)}
              onTimeoutSnackBar={this.handleSnackbarTimeout.bind(this)}
              stateBar={stateBar}
              snackbarMessage={snackbarMessage}
        >
        </Form>
      </ThemeProvider>
    )
  }
}