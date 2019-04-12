import React, { Component } from 'react';
import { TooltipButton } from './Libraries/ReactToolboxLibrary';

function Tooltips(props) {
  return (
    <div style={{position: 'fixed', bottom: '15px', right: '15px'}}>
      {props.auth.isAuthenticated() && <TooltipButton icon="clear" onClick={props.auth.logout} mini floating primary style={{margin: '5px'}} tooltip="logout"/>}
      <TooltipButton className="queerButton" icon='feedback' mini floating primary href={props.addDefinitionUrl} target="_blank" style={{margin: '5px'}} tooltip='define'/>
      <TooltipButton className="queerButton" icon='live_help' mini floating primary style={{margin: '5px'}} tooltip='request' href={props.requestDefinitionUrl} target="_blank" />
      <TooltipButton className="queerButton" icon='info' onClick={props.aboutOnClick} mini floating primary style={{margin: '5px'}} tooltip="info"/>

    </div>
  );
}

export { Tooltips };
