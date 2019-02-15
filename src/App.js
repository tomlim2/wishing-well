import React, { Component } from 'react';
import './App.css';

var wisdoms = [
  "Semper Ubi Sub Ubi. (Always wear underwear.)",
  "Floss your teeth every day.",
  "You will pay for your sins. If you have already paid, please disregard this message.",
  "Today is a day for firm decisions!! Or is it?",
  "Caution: Keep out of reach of children.",
  "You're growing out of some of your problems, but there are others that you're growing into.",
  "Every cloud engenders not a storm."
]

var authors = [
  "Coffee",
  "Cocoa",
  "Milk",
  "LemonTea",
  "Capucino",
  "Prape",
  "ChocoChip"
]


class App extends Component {
  constructor(props) {
    super(props);

    var index = Math.floor(Math.random() * wisdoms.length);

    this.state = {
      wisdom: wisdoms[index],
      author: authors[index]
    };

    this.setRandomWisdom = this.setRandomWisdom.bind(this);
    this.addWisdom = this.addWisdom.bind(this);

    this.connectWebsocket();
  }

  connectWebsocket() {
    if (this.websocket) {
      this.websocket.close();
      delete this.websocket;
    }

    this.websocket = new WebSocket('ws://' + window.location.host + '/comm');
    this.websocket.onmessage = this.handleMessage.bind(this);
    this.websocket.onclose = () => setTimeout(() => this.connectWebsocket(), 500);
  }

  handleMessage(event) {
    // get the actual message data
    var message = JSON.parse(event.data);

    // add a new wisdom to the array, using the message's wisdom property
    var wisdom = message.wisdom;
    var author = message.author
    // modify wisdom somehow before pushing?
    wisdom = wisdom.replace("smile", "😃")
    if (wisdom.includes("tree")) {
      wisdom = wisdom + "🌲";
    }

    wisdoms.push(wisdom);
    authors.push(author);

    // show the last wisdom
    this.setWisdom(wisdoms.length-1);
  }



  setRandomWisdom() {
    var index = Math.floor(Math.random() * wisdoms.length);

    this.setWisdom(index);
  }

  setWisdom(index) {
    // set wisdom based on an index
    this.setState({
      wisdom: wisdoms[index],
      author: authors[index]
    });
  }

  addWisdom() {
    // ask for wisdom
    var wisdom = prompt("What new wisdom do you offer?");
    var author
    if (! author) {
      var author = prompt("Who is author?");
      this.setState({
        name: author,
        // name: prompt("What is your name??")
      });
    }

    // if there's no name set, ask for name
    // if (! this.state.name) {
    //   var author = prompt("Who is author?");
    //   this.setState({
    //     name: author,
    //     // name: prompt("What is your name??")
    //   });
    // }

    // make a message object
    var message = {
      type: "broadcast",
      wisdom: wisdom,
      author: author
    };

    // send it as a string to all other browsers
    this.websocket.send(JSON.stringify(message));
  }

  lastListItems(count = 5) {
    // wrap last five wisdoms + authors each in a <li> element
    // var lastFiveAuthors = authors.slice(authors.length-count);
    // var lastFiveWisdoms = wisdoms.slice(wisdoms.length-count);
    var lastFiveAuthors = authors.slice(authors.length-count);
    var lastFiveWisdoms = wisdoms.slice(wisdoms.length-count);

    return lastFiveWisdoms.map((wisdom, index) =>
      <li>
        <span className="wisdom">{lastFiveWisdoms[index]}</span>
        <span className="author authorList">({lastFiveAuthors[index]})</span>
      </li>);
  }

  removeCurrentWisdom() {
    var index = wisdoms.indexOf(this.state.wisdom);
    wisdoms.splice(index, 1);
  }

  addLike(){
    // this.state.wisdom;
  }

  render() {
    return (
      <div className="App">
        {this.state.wisdom}
        &mdash;
        <div className="author">
        {this.state.author}
        </div>
        <button className="more" onClick={this.setRandomWisdom}>Another</button>
        <button className="more like" onClick={this.addLike}>like</button>

        <button className="new-wisdom" onClick={this.addWisdom}>New</button>

        <div className="lastListItems">
          <div> : </div>
          {this.lastListItems()}
        </div>

      </div>
    );
  }
}

export default App;
