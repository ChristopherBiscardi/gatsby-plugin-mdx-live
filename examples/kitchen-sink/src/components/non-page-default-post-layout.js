import React, { Component } from "react";

export default class DefaultPageLayout extends Component {
  render() {
    return (
      <div>
        <h1>The Non-page Default Post Layout</h1>
        <div>{this.props.children}</div>
      </div>
    );
  }
}
