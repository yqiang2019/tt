import { generateUUID } from "../utils";
import { Node } from "./Node";
import { Segment } from "./Segment";
export class Paragraph extends Node {
  constructor(id = generateUUID(), style = {}, segments = []) {
    super(id, "paragraph");
    this.style = style;
    this.segments = segments;
  }
  static create(json) {
    const { id, style, segments } = json;
    return new Paragraph(id, style, segments.map(Segment.create));
  }
  split(segmentId, offset, splitSelf = false) {
    const index = this.segments.findIndex(
      (segment) => segment.id === segmentId
    );
    if (index < 0) {
      return [];
    }
    const [before, after] = this.segments[index].split(offset);
    const head = this.segments.slice(0, index);
    const tail = this.segments.slice(index + 1);
    if (splitSelf) {
      this.segments = head.concat([before]);
      return [
        this,
        Paragraph.create({
          style: this.style,
          segments: [after].concat(tail),
        }),
      ];
    } else {
      this.segments = head.concat([before, after]).concat(tail);
      return [before, after];
    }
  }
}
