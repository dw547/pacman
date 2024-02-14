import React, {Component} from 'react';
import './App.css';
import Game from "./Game";
import {default as GameModel} from "./model/Game";

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      game: null,
      gesture: false
    };
  }

  _onMouseClick = () => {
    if (this.state.gesture) {
      return;
    }

    this.setState({
      gesture: true,
      game: new GameModel(),
    });
  };

  renderContent() {
    if (this.state.gesture && this.state.game) {
      return (
        <Game className="AppGame" dataSource={this.state.game} />
      );
    }

    return (
      <div className={"WaitingForGesture"}>
        <button onClick={this._onMouseClick} className={"begin-button"}>{"Click to Begin"}</button>
      </div>
    );
  }

  render() {
    return (
      <div className="App" style={{backgroundColor: "black"}}>
        {this.renderContent()}
      </div>
    );
  }
}

export default App;
