import React from "react";
import { Segment } from "../Segment/Segment";
export function Paragraph(props) {
  const { id, style, segments } = props.paragraph;
  return (
    <div id={id} style={style}>
      {segments.map((segment) => {
        return <Segment key={segment.id} segment={segment} />;
      })}
    </div>
  );
}
