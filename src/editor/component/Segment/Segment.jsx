import React from "react";
export function Segment(props) {
  const { id, text = "", style } = props.segment;
  return (
    <span id={id} style={style}>
      {text}
    </span>
  );
}
