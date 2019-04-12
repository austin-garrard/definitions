import React, { Component } from 'react';
import { welcomeBlurb } from "./utils/TextBlurbs";

function DisagreementBlurb(props) {
  return (
    <div className="blurb">Disagree with these definitions? <a href={props.addDefinitionUrl} target="new">Add your own</a></div>
  );
}

function LoadingDefinitionsBlurb(props) {
  return (<div className="blurb"> Loading definitions... </div>);
}

function NoDefinitionsBlurb(props) {
  return (
    <div className="blurb">
      No definitions yet. You can <a href={props.addDefinitionUrl} target="new">add one</a> or <a href={props.requestDefinitionUrl} target="new">request</a> that this term be defined.
    </div>
  );
}

function WelcomeBlurb(props) {
  return (<div className="blurb">{welcomeBlurb}</div>);
}

export {
  DisagreementBlurb,
  LoadingDefinitionsBlurb,
  NoDefinitionsBlurb,
  WelcomeBlurb
};
