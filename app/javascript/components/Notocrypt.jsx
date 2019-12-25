import ReactModal from "react-modal";

import sodium from "libsodium-wrappers";

import React, { Component } from "react";

import { userStore } from "./UserStore";
import { observer } from "mobx-react";
import styled from "styled-components";

import Note from "./Note";
import NoteEditor from "./NoteEditor";

const SPasswordForm = styled.div`
  text-align: center;
  max-width: 50rem;
  margin: auto;
  h1 {
    margin-bottom: 5rem;
    font-size: 3rem;
    font-weight: bold;
  }
`;

@observer
class Notocrypt extends Component {
  state = { acountExists: false };

  async componentDidMount() {
    ReactModal.setAppElement("body");

    await userStore.initSodium();

    userStore.getNotes();

    if (this.props.salt && this.props.challenge_nonce) {
      this.setState({ accountExists: true });
    }
  }

  handleSubmitPassword = async e => {
    e.preventDefault();
    let formData = new FormData(e.target);
    let password = formData.get("password");

    // Account exists, so try to log in
    if (this.state.accountExists) {
      userStore
        .authenticate(this.props.salt, this.props.challenge_nonce, password)
        .then(response => {
          userStore.notes.forEach(n => n.unlock());
        });
    } else {
      userStore.register(userStore.uid, password);
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
          <SPasswordForm>
            {this.state.accountExists ? (
              <>
                <h1>This vault is protected.</h1>
                <h1>Enter password.</h1>
              </>
            ) : (
              <>
                <h1>This is a new vault. </h1>
                <h1>Enter a password to protect it.</h1>
              </>
            )}
            <form onSubmit={this.handleSubmitPassword}>
              <input type="text" name="password" placeholder="password"></input>
            </form>
          </SPasswordForm>
        </ReactModal>
        <div className="container">
          <div className="columns is-multiline is-centered">
            <div className="column is-8">
              <NoteEditor style={{ marginTop: "3rem" }} />
            </div>
          </div>
          <div className="columns is-multiline ">
            {userStore.notes.length > 0 &&
              userStore.notes.map(note => (
                <Note key={note.nonce} note={note} />
              ))}
          </div>
        </div>
      </div>
    );
  }
}

export default Notocrypt;
