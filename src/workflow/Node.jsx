import { HtmlNodeModel, HtmlNode } from "@logicflow/core";
import React from "react";
import ReactDOM from "react-dom";

function Hello(props) {
  return (
    <>
      <div
        style={{
          position: "relative",
          width: props.p || 0,
          background: props.color || "red",
          height: 50,
        }}
      >
        <h1 className="box-title" style={{ position: "absolute" }}>
          title
        </h1>
      </div>

      <div className="box-content">
        <p>{props.name}</p>
        <p>clock change：{props.body}</p>
        <p>content3</p>
      </div>
    </>
  );
}

class BoxxModel extends HtmlNodeModel {
  setAttributes() {
    this.text.editable = false;
    const width = 200;
    const height = 240;
    this.width = width;
    this.height = height;
    this.anchorsOffset = [
      [width / 2, 0],
      [0, height / 2],
      [-width / 2, 0],
      [0, -height / 2],
    ];
  }
}
class BoxxNode extends HtmlNode {
  setHtml(rootEl) {
    const { properties } = this.props.model;
    ReactDOM.render(
      <Hello
        name={properties.name}
        body={properties.body}
        color={properties.color}
        p={properties.p}
      />,
      rootEl
    );
  }
}

const boxx = {
  type: "boxx",
  view: BoxxNode,
  model: BoxxModel,
};

export default boxx;
