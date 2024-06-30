import React from "react";
import { Paragraph } from "../Paragraph/Paragraph";
export function Document(props) {
  const { id, nodes } = props.document;
  return (
    <div id={id}>
      {nodes.map((paragraph) => {
        return <Paragraph key={paragraph.id} paragraph={paragraph} />;
      })}
    </div>
  );
}
