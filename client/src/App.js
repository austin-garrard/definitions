import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import DocumentTitle from 'react-document-title';
import { Helmet } from 'react-helmet'
import ReactGA from 'react-ga';
import { trackPageViewInGoogleAnalytics } from "./utils/UtilityFunctions";
import './assets/react-toolbox/theme.css';
import './stylesheets/App.css';
import './stylesheets/queerButton.css';
import './stylesheets/queerInput.css';
import './stylesheets/queerSnackbar.css';

import {Autocomplete, theme, ThemeProvider} from './Libraries/ReactToolboxLibrary';
import { ResultList } from './Libraries/ComponentsLibrary';
import history from './history';
import {
  DisagreementBlurb,
  LoadingDefinitionsBlurb,
  NoDefinitionsBlurb,
  WelcomeBlurb
} from "./blurbs";
import { Tooltips } from "./tooltips";

const add_definition_url = "https://docs.google.com/forms/d/e/1FAIpQLSfKF0yyleI5XdPVtl-bEuQUGy2HZPfnUU-e2sDjL31eLuygUA/viewform?usp=sf_link";
const request_definition_url = "https://goo.gl/forms/xrZyTzaVo8Addq8d2";

class App extends Component {
  constructor(props) {

    if (process.env["NODE_ENV"] === "production") {
      ReactGA.initialize('UA-58549536-5');
    }
    trackPageViewInGoogleAnalytics(); //where is the best place to track the page view?

    super();
    this.state = {
      def: '',
      my_term: props.term,
      entries: [],
      terms: [],
      entriesLoading: true
    };

    fetch('/terms').then(res => {return res.json()}).then(res => {this.setState({terms: res.sort()})}); //i think this is causing an error
    this.handleChange = this.handleTermChange.bind(this);

  }

  componentDidMount() {
    this.getDefListWithSortAs(this.state.my_term.toLowerCase());
  }

  getDefListWithSortAs(searchterm) {
    this.setState({entries: []});
    if (searchterm === "") {return [];}

    this.setState({entriesLoading: true});
    var url = '/entries/' + encodeURIComponent(searchterm.toLowerCase());
    fetch(url).then(res => {return res.json()}).then(res => {this.setState({entries: res, entriesLoading: false})});
  }

  aboutOnClick = () => {
    this.setState({my_term: ""});
    this.getDefListWithSortAs("");
    history.push("/about");
    trackPageViewInGoogleAnalytics();
  };

  handleTermChange = (value) => {
    var new_query = value === "" ? "" : "search/" + encodeURIComponent(value);
    this.setState({my_term: value});
    history.push("/" + new_query);

    this.getDefListWithSortAs(value);

    trackPageViewInGoogleAnalytics();
  };

  render() {
    const terms = this.state.terms;
    const my_entries = this.state.entries;
    const pageTitle = this.state.my_term === "" ? "Queer Undefined" : this.state.my_term + " | Queer Undefined" ;
    const description = this.state.my_term === "about" ? "Queer Undefined: a crowd-sourced dictonary of LGBTQ+ terms. You can also submit your own definitions or request a word you want to be defined." : "Queer Undefined: a crowd-sourced dictonary of LGBTQ+ terms. Find the definition of " + this.state.my_term + " and more! You can also submit your own definitions or request a word you want to be defined."
    const showLoading = this.state.entriesLoading;
    const locationStrings = window.location.href.split(".com/");
    const canonicalUrl = "https://www.queerundefined.com/" + locationStrings[1];

    const any_term = this.state.my_term !== "";
    const any_entries = my_entries && my_entries.length > 0;
    const at_starting_url = window.location.pathname === "/";

  return(
    <DocumentTitle title={pageTitle}>
    <ThemeProvider theme={theme}>
    <div>
    <Helmet>
      <meta property="og:image" content="http://queerundefined.com/quthumbnail.png" />
      <meta property="og:description" content={description} />
      <meta property="description" content={description} />
      <meta property="og:site_name" content="Queer Undefined"/>
      <meta property="og:title" content={pageTitle}/>
      <link rel="canonical" href={canonicalUrl} />
      
    </Helmet>
    <div className="header-wrapper">
      <a className="header" href="/">queer undefined</a>
      <Autocomplete
        allowCreate
        direction="down"
        selectedPosition="above"
        label="enter a term"
        onChange={this.handleTermChange}
        source={terms}
        value={this.state.my_term}
        suggestionMatch="anywhere"
        showSuggestionsWhenValueIsSet={false}
        multiple={false}
        className="queerInput"
      />
    </div>

    {(any_term && showLoading) && <LoadingDefinitionsBlurb />}
    {(!showLoading && any_term && !any_entries) &&
        <NoDefinitionsBlurb
          addDefinitionUrl={add_definition_url}
          requestDefinitionUrl={request_definition_url}
        />
    }
    {(any_entries) && <DisagreementBlurb addDefinitionUrl={add_definition_url} />}
    {(!any_term && at_starting_url) && <WelcomeBlurb />}

      <ResultList style={{display:"flex", flexDirection:"column", alignContent:"center"}} entries={my_entries} />
      <Tooltips
        auth={this.props.auth}
        aboutOnClick={this.aboutOnClick.bind(this)}
        addDefinitionUrl={add_definition_url}
        requestDefinitionUrl={request_definition_url}
      />
    </div>
    </ThemeProvider>
    </DocumentTitle>
  );
  }
}

export default withRouter(App);
