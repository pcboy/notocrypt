import React, { Component } from "react";

import userStore from "./UserStore";

import ContentEditable from "react-contenteditable";
import sanitizeHtml from "sanitize-html";

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

  .note-title {
    min-height: 3.25rem;
  }

  .note-content {
    min-height: 4.6rem;
    line-height: 2rem;
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
  titlePlaceholder = "Title";
  contentPlaceholder = "Take a note...";

  state = {
    title: this.titlePlaceholder,
    content: this.contentPlaceholder,
    dirtyContent: false,
    dirtyTitle: false
  };

  sanitizeConf = {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(["br"]),
    allowedAttributes: {}
  };

  reset = () => {
    this.setState({
      title: this.titlePlaceholder,
      content: this.contentPlaceholder,
      dirtyContent: false,
      dirtyTitle: false
    });
  };

  newNote = e => {
    e.preventDefault();

    console.log("new note");

    userStore.addNote(this.state.content, this.state.title).then(() => {
      this.reset();
    });
  };

  handleChangeTitle = e => {
    const title = sanitizeHtml(e.target.value, this.sanitizeConf);
    this.setState({
      title: title,
      dirtyTitle: title ? true : false
    });
  };

  handleChangeContent = e => {
    const content = sanitizeHtml(e.target.value, this.sanitizeConf);
    this.setState({
      content: content,
      dirtyContent: content ? true : false
    });
  };

  handleFocusTitle = e => {
    if (!this.state.dirtyTitle) {
      this.setState({ title: "" });
    }
  };

  handleBlurTitle = e => {
    if (!this.state.dirtyTitle) {
      this.setState({ title: this.titlePlaceholder });
    }
  };

  handleFocusContent = e => {
    if (!this.state.dirtyContent) {
      this.setState({ content: "" });
    }
  };

  handleBlurContent = e => {
    if (!this.state.dirtyContent) {
      this.setState({ content: this.contentPlaceholder });
    }
  };

  render() {
    return (
      <SNoteEditor style={this.props.style}>
        <form onSubmit={this.newNote}>
          <ContentEditable
            name="title"
            className="note-title"
            onFocus={this.handleFocusTitle}
            onBlur={this.handleBlurTitle}
            html={this.state.title} // innerHTML of the editable div
            onChange={this.handleChangeTitle} // handle innerHTML change
          />

          <ContentEditable
            name="content"
            className="note-content"
            onFocus={this.handleFocusContent}
            onBlur={this.handleBlurContent}
            html={this.state.content} // innerHTML of the editable div
            onChange={this.handleChangeContent} // handle innerHTML change
            onSubmit={this.newNote}
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
