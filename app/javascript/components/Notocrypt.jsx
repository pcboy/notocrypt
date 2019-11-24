import ReactModal from "react-modal";

import sodium from "libsodium-wrappers";

import React, { Component } from "react";

import { userStore } from "./UserStore";
import { observer } from "mobx-react";

import Note from "./Note";

@observer
class Notocrypt extends Component {
  state = {};

  async componentDidMount() {
    ReactModal.setAppElement("body");

    await userStore.initSodium();

    userStore.getNotes();
  }

  newNote = e => {
    e.preventDefault();
    let formData = new FormData(e.target);
    let content = formData.get("content");

    userStore.addNote(content);
  };

  handleSubmitPassword = async e => {
    e.preventDefault();
    let formData = new FormData(e.target);
    let password = formData.get("password");
    console.log(password);

    // Not new account
    if (this.props.salt) {
      userStore.checkPassword(this.props.salt, password);
    } else {
      userStore.register(userStore.uid(), password);
    }
  };

  render() {
    return (
      <div>
        <ReactModal
          closeTimeoutMS={200}
          isOpen={!userStore.isLoggedIn}
          onAfterOpen={() => true}
          onRequestClose={() => true}
        >
          <form onSubmit={this.handleSubmitPassword}>
            <input type="text" name="password" placeholder="password"></input>
          </form>
        </ReactModal>

        <form onSubmit={this.newNote}>
          <input
            type="text"
            name="content"
            placeholder="write a new note"
          ></input>
        </form>
        {userStore.notes.length > 0 &&
          userStore.notes.map(note => <Note key={note.id} note={note} />)}
      </div>
    );
  }
}

export default Notocrypt;
