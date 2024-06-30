import { Segment } from "./Segment";
import { Node } from "./Node.js";
import { Paragraph } from "./Paragraph.js";
import { generateUUID } from "../utils.js";
export class Document extends Node {
  constructor(id = generateUUID(), nodes = []) {
    super(id, "document");
    this.nodes = nodes;
  }
  static create(json) {
    const { id, nodes } = json;
    return new Document(id, nodes.map(Paragraph.create));
  }
  insertText(id, offset, text) {
    const node = this.findNodeBy(id);
    console.log(node);
    if (node && node instanceof Segment) {
      node.insertText(offset, text);
    }
  }
  deleteText(id, offset, length) {
    const node = this.findNodeBy(id);
    if (node && node instanceof Segment) {
      node.deleteText(offset, length);
    }
  }
  addInlineStyle(startId, startOffset, endId, endOffset, key, value) {
    const nodes = this.findSegmentsByStartAndEnd(startId, endId);
    if (nodes.length < 1) {
      return [startId, startOffset, endId, endOffset];
    }
    const first = nodes[0];
    const firstPara = this.findParentNodeById(first.id);
    const [, after] = firstPara.split(first.id, startOffset);
    after.addStyle(key, value);
    const last = nodes[nodes.length - 1];
    const lastPara = this.findParentNodeById(last.id);
    const [before] = lastPara.split(last.id, endOffset);
    before.addStyle(key, value);

    nodes.split(0, nodes.length - 1).forEach((node) => {
      node.addStyle(key, value);
    });
    return [after.id, 0, before.id, endOffset];
  }
  findParentNodeById(id) {
    for (const node of this.nodes) {
      if (node.id === id) {
        return node;
      }
      for (const segment of node.segments) {
        if (segment.id === id) {
          return node;
        }
      }
    }
  }
  findSegmentsByStartAndEnd(startId, endId) {
    const res = [];
    let start = false;
    for (const node of this.nodes) {
      for (const segment of node.segments) {
        if (segment.id === startId) {
          res.push(segment);
          start = true;
          continue;
        }
        if (segment.id === endId) {
          res.push(segment);
          return res;
        }
        if (start) {
          res.push(segment);
        }
      }
    }
    return res;
  }
  findNodeBy(id) {
    if (this.id === id) {
      return this;
    }
    for (const node of this.nodes) {
      if (node.id === id) {
        return node;
      }
      for (const segment of node.segments) {
        if (segment.id === id) {
          return segment;
        }
      }
    }
  }
}
