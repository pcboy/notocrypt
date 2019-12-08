import React, { Component } from "react";

import userStore from "./UserStore";

import ContentEditable from "react-contenteditable";

import styled from "styled-components";

const SNoteEditor = styled.div`
  width: 60rem;
  box-shadow: 0 3px 5px rgba(0, 0, 0, 0.2);
  color: #202124;
  margin-left: auto;
  margin-right: auto;
  border-radius: 8px;

  input {
    border: 0;
    resize: none;
  }

  .note-title,
  .note-content {
    padding: 10px 15px;
  }
  .note-content {
    min-height: 4.6rem;
  }

  .note-commands {
    height: 3.6rem;
  }

  button.submit-note {
    border: 0;
    background: transparent;
    cursor: pointer;
    float: right;
    padding: 8px 24px;
    font-weight: 500;
    &:hover {
      background-color: rgba(95, 99, 104, 0.039);
    }
  }
`;

class NoteEditor extends Component {
  state = { title: "Title", content: "Take a note..." };

  newNote = e => {
    e.preventDefault();

    userStore.addNote(this.state.content, this.state.title);
  };

  handleChangeTitle = e => {
    this.setState({ title: e.target.value });
  };

  handleChangeContent = e => {
    this.setState({ content: e.target.value });
  };

  render() {
    return (
      <SNoteEditor style={this.props.style}>
        <form onSubmit={this.newNote}>
          <ContentEditable
            name="title"
            className="note-title"
            html={this.state.title} // innerHTML of the editable div
            onChange={this.handleChangeTitle} // handle innerHTML change
          />

          <ContentEditable
            name="content"
            className="note-content"
            html={this.state.content} // innerHTML of the editable div
            onChange={this.handleChangeContent} // handle innerHTML change
          />

          <div className="note-commands">
            <button className="submit-note">Save</button>
          </div>
        </form>
      </SNoteEditor>
    );
  }
}

export default NoteEditor;
