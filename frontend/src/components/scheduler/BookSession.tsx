import React, { Component } from "react";
import { InlineWidget } from "react-calendly";
export default class BookSession extends Component {
  componentDidMount() {
    // whatever stuff you need here
  }
  componentWillUnmount() {
    // whatever cleanup stuff you need here
  }
  render() {
    return (
      <div>
        <InlineWidget url="https://calendly.com/tarunmeena6846/swot-session" />
      </div>
    );
  }
}
