import React, { Component } from "react";
import userStore from "./UserStore";
import { observer } from "mobx-react";

@observer
class Note extends Component {
  state = {};

  unlock = e => {
    //userStore.unlockNote(this.props.note);
    this.props.note.unlock();
  };

  render() {
    return (
      <div>
        {this.props.note.content}
        <button onClick={this.unlock}>unlock</button>
      </div>
    );
  }
}

export default Note;
