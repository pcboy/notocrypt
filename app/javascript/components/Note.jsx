import React, { Component } from "react";
import userStore from "./UserStore";
import { observer } from "mobx-react";
import styled from "styled-components";

const SNote = styled.div`
  background: white;
  text-align: left;
  padding: 4px 16px 12px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  min-height: 60px;

  transition-duration: 0.218s;
  transition-property: background, border, opacity, box-shadow, transform;
  transition-timing-function: ease-in;

  p.title {
    font-family: Open Sans;
    font-weight: 500;
    font-size: 1rem;
    line-height: 1.5rem;
  }

  &:hover {
    box-shadow: 0 1px 2px 0 rgba(60, 64, 67, 0.302),
      0 1px 3px 1px rgba(60, 64, 67, 0.149);
  }
`;

@observer
class Note extends Component {
  state = {};

  componentDidMount() {
    this.props.note.unlock();
  }

  render() {
    const title = this.props.note.metadata && this.props.note.metadata.title;
    return (
      <div className="column is-2">
        <SNote>
          <p className="title">{title}</p>
          <p className="content">{this.props.note.content}</p>
        </SNote>
      </div>
    );
  }
}

export default Note;
