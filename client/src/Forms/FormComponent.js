import React, {Component} from 'react';
import '../stylesheets/Forms.css'; // Import css modules stylesheet as styles
import InputForm from '../Pages/InputFormComponent'
import {Button, Snackbar} from '../Libraries/ReactToolboxLibrary';

export default class Form extends Component {
  // Set default props
  static defaultProps = {
    inputs: [{labelInput: '', isRequired: true}],
    title: 'Default Title',
    content: (<div/>),
    stateBar: false,
    onSubmit: (e) => { e.preventDefault() },
    onClickSnackBar: (e, i) => { e.preventDefault() },
    onTimeoutSnackBar: (e,i) => { e.preventDefault() }
  }

  createInputs = (inputs) => {
    return inputs.map((input, index) => {
      return (<InputForm key={index} label={input.label} value={input.value} labelInput={input.labelInput}
                         isRequired={input.isRequired} showError={input.showError} errorStyle={input.errorStyle}
                         onChange={input.onChange}/>)
    })
  }

  render() {
    const {title, content, inputs, onSubmit, onClickSnackBar, onTimeoutSnackBar, stateBar, snackbarMessage} = this.props;
    return (
      <div className="flex-container">
        <form onSubmit={onSubmit}>
          <div className='form'>
            <div className='page-title'>{title}</div>
            {content}
            <span className='error' style={{padding: '0rem 1rem'}}>* Required</span>

            <div className='inputsBox'>
              {this.createInputs(inputs)}
            </div>
            <div className='submitBox'>
              <Button className='queerButton' onMouseUp={onSubmit} label='Submit' raised primary/>
            </div>

          </div>
        </form>

        <Snackbar
          action='Dismiss'
          active={stateBar}
          label={snackbarMessage}
          timeout={3000}
          type='accept'
          onClick={onClickSnackBar}
          onTimeout={onTimeoutSnackBar}
          className='queerSnackbar'
        />

      </div>
    )
  }
}