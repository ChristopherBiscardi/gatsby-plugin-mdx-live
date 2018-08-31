// import React from 'react';
import styled from "react-emotion";

const notificationTypes = {
  warning: {
    dark: "goldenrod",
    light: "papayawhip"
  },
  error: {
    dark: "firebrick",
    light: "rosybrown"
  },
  info: {
    dark: "cadetblue",
    light: "aliceblue"
  }
};

const getColor = (type = "info", shade = "dark") =>
  notificationTypes[type][shade];

const Notification = styled("section")`
  border: 1px solid ${props => getColor(props.type)};
  color: ${props => getColor(props.type)};
  background: ${props => getColor(props.type, "light")};
  display: grid;
  padding: 15px;
`;

export default Notification;
