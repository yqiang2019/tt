import { generateUUID } from "../utils";
import { Node } from "./Node";

export class Segment extends Node {
  constructor(id = generateUUID(), text = "", style = {}) {
    super(id, "segment");
    this.text = text;
    this.style = style;
  }
  static create(json) {
    const { id, text, style } = json;
    return new Segment(id, text, style);
  }
  insertText(offset, text) {
    if (offset < 0 || offset > this.text.length) {
      return;
    }
    if (!text) {
      return;
    }
    this.text = this.text.slice(0, offset) + text + this.text.slice(offset);
  }
  deleteText(offset, length) {
    if (offset < 0 || offset >= this.text.length) {
      return;
    }
    if (length <= 0) {
      return;
    }
    this.text = this.text.slice(0, offset) + this.text.slice(offset + length);
  }
  split(index) {
    const before = this.text.slice(0, index);
    const after = this.text.slice(index);
    this.text = before;
    return [
      this,
      Segment.create({
        text: after,
        style: this.style,
      }),
    ];
  }
  addStyle(key, value) {
    if (!key) {
      return;
    }
    if (!value) {
      delete this.style[key];
    }
    this.style[key] = value;
  }
}
