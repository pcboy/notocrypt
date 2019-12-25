import React, { Component } from "react";
import userStore from "./UserStore";
import { observer } from "mobx-react";
import styled from "styled-components";
import ContentEditable from "react-contenteditable";

import { MdDelete } from "react-icons/md";

const SNote = styled.div`
  background: white;
  text-align: left;
  padding: 4px 16px 12px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  min-height: 60px;
  position: relative;

  transition-duration: 0.218s;
  transition-property: background, border, opacity, box-shadow, transform;
  transition-timing-function: ease-in;

  p.title {
    font-family: Open Sans;

    font-weight: 500;
  }

  p.content {
    font-family: Roboto;
  }

  p.title,
  p.content {
    font-size: 1.6rem;
    line-height: 2.4rem;
  }

  .delete-icon {
    display: none;
    cursor: pointer;
    position: absolute;
    top: 1rem;
    right: 1rem;
    font-size: 2rem;
  }

  &:hover {
    box-shadow: 0 1px 2px 0 rgba(60, 64, 67, 0.302),
      0 1px 3px 1px rgba(60, 64, 67, 0.149);

    .delete-icon {
      display: block;
    }
  }
`;

@observer
class Note extends Component {
  state = {};

  componentDidMount() {
    this.props.note.unlock();
  }

  deleteNote = () => {
    this.props.note.delete();
  };

  saveNote = () => {
    this.props.note.save();
  };

  changeContent = e => {
    const content = e.target.value; // sanitize later
    this.props.note.content = content;
  };

  changeTitle = e => {
    const title = e.target.value; // sanitize later
    this.props.note.metadata.title = title;
  };

  render() {
    const title = this.props.note.metadata && this.props.note.metadata.title;
    return (
      <div className="column is-2">
        <SNote>
          <MdDelete className="delete-icon" onClick={this.deleteNote} />
          <ContentEditable
            name="title"
            className="note-title"
            onBlur={this.saveNote}
            html={title || ""} // innerHTML of the editable div
            onChange={this.changeTitle}
          />

          <ContentEditable
            name="content"
            className="note-content"
            onBlur={this.saveNote}
            onChange={this.changeContent}
            html={this.props.note.content || ""} // innerHTML of the editable div
          />
        </SNote>
      </div>
    );
  }
}

export default Note;
