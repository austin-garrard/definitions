import React, { Component } from 'react';
import { TooltipButton, Button, Card, CardTitle, CardText } from "../Libraries/ReactToolboxLibrary";

//TODO: tooltip explanation that one is the author and one is the author's identity?
//TODO: stop inline styling

//todo: link identities too?
//todo: why did i make a lowerCase() fn?

class ResultCard extends Component {
  constructor(props) {
    super();
    this.state = {visible: true}
    this.rejectPotential = this.rejectPotential.bind(this);
    this.acceptPotential = this.acceptPotential.bind(this);
    this.reportEntry = this.reportEntry.bind(this);
  }

  titleCase(str) {
    return str.toLowerCase().split(' ').map(function(word) {
      return (word.charAt(0).toUpperCase() + word.slice(1));
    }).join(' ');
  }

  lowerCase(str) {
    return str.toLowerCase();
  }

  defWithLinks(def) {
    if (def === undefined) {
      return;
    }
    return def.split('`').map(function(word, index) {
      var url = "/search/" + word;
      var newWord = index % 2 !== 0 ? <a href={url} key={url + index}>{word}</a> : word; ////
      return newWord;
    });
  }

  paragraphsAndLinks(def) {
    if (def === undefined) {
      return;
    }
    var paragraphs = def.split("\n");
    if (paragraphs.length === 1) {return this.defWithLinks(def);}
    return paragraphs.map((paragraph, index) => {
      if (paragraph === "") {return "";}
      if (paragraphs.length - 1 === index) {return this.defWithLinks(paragraph);}
      return <div key={paragraph + index}>{this.defWithLinks(paragraph)}<br /><br /></div>
    });
  }

   rejectPotential(){
     this.props.entry.rejectCb()
     this.setState({visible: false});
   }

   acceptPotential(){
     this.props.entry.acceptCb()
     this.setState({visible: false});
   }

  reportEntry(){
    if (confirm("Are you sure you want to report this definition for " + this.props.entry.term + "? ")) {
      fetch('/entries/setstatus/4/id/' + this.props.entry.entry_id, {method: 'POST'});
      alert("Reported definition for " + this.props.entry.term + ". This will be reviewed ASAP.\nIf you have time, please email info@queerundefined.com with a brief explanation of why you reported this definition. Please include the definition id: " + this.props.entry.entry_id + ". Thank you!");
    }
  }

  render() {
    return(
      <div>
       {this.state.visible && 
        <Card style={{width: '350px', margin: '10px'}}>
        <CardTitle
          title={this.lowerCase(this.props.entry["term"])}
        />
        <div style={{textAlign: 'right', marginTop: '-65px', marginBottom: '25px', paddingRight: '5px'}}>
         {(this.props.entry["action"] === 1) && this.props.entry["entry_id"]}
         <TooltipButton icon='outlined_flag' tooltip="flag for removal"  onClick={this.reportEntry} style={{minWidth:'30px', padding:'0', paddingLeft:'6px', marginRight:'-6px', color:'#BABABA'}}/>
       </div>
        <CardText>{this.paragraphsAndLinks(this.props.entry["definition"])}<br /><br />{this.defWithLinks(this.props.entry["explanation"])}<p style={{textAlign: 'right', color: '#606060', fontSize: '16px', paddingTop: '10px'}}>{this.props.entry["name"]}</p><p style={{textAlign: 'right', color: '#606060', fontSize: '12px', lineHeight: '12px'}}>{this.props.entry["identity"]}</p></CardText>
        {(this.props.entry["action"] === 1) && <div><Button label="reject" onClick={this.rejectPotential} raised style={{"width":"175px"}}/>
                                     <Button label="accept" onClick={this.acceptPotential} raised primary style={{"width":"175px"}}/></div>}
        {(this.props.entry["action"] === 4) && <div><Button label="dismiss" onClick={this.acceptPotential} raised style={{"width":"175px"}}/>
                                     <Button label="reject" onClick={this.rejectPotential} raised primary style={{"width":"175px"}}/></div>}
      </Card>}
    </div>
    );
  }


}

export default ResultCard;
