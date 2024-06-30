import { useState } from "react";
import { Document as DocumentModel } from "../../model/Document";
import { Document } from "../Document/Document";
import { Toolbar } from "../Toolbar/Toolbar";
export function EditArea({ data }) {
  const [docment, setDocument] = useState(DocumentModel.create(data));
  const onKeyDown = (e) => {
    if (
      e.key === "Shift" ||
      e.key === "Meta" ||
      e.key === "Ctrl" ||
      e.key === "Alt"
    ) {
      return;
    }
    e.preventDefault();
    if (e.key === "Backspace") {
      deleteText(true);
    } else if (e.key === "Delete") {
      deleteText(false);
    } else {
      insertText(e);
    }
  };
  const deleteText = (backword) => {
    const sel = window.getSelection();
    if (!sel || !sel.rangeCount) {
      return;
    }
    const range = sel.getRangeAt(0);
    const startContainer = range.startContainer;
    const parentEl = startContainer.parentElement;
    const startOffset = range.startOffset;
    if (!range.collapsed) {
      return;
    }
    if (!parentEl) {
      return;
    }
    const start = backword ? startOffset - 1 : startOffset;
    if (start < 0) {
      return;
    }
    docment.deleteText(parentEl.id, start, 1);
    console.log(docment);
    setDocument(DocumentModel.create(docment));

    setTimeout(() => {
      range.setStart(startContainer, startOffset);
      range.setEnd(startContainer, startOffset);
      sel.addRange(range);
    });
  };
  const insertText = (e) => {
    console.log("insertText");
    const sel = window.getSelection();
    if (!sel || !sel.rangeCount) {
      return;
    }
    const range = sel.getRangeAt(0);
    const startContainer = range.startContainer;
    const parentEl = startContainer.parentElement;
    const startOffset = range.startOffset;
    const text = e.key;
    if (!range.collapsed) {
      return;
    }
    if (!parentEl) {
      return;
    }
    docment.insertText(parentEl.id, startOffset, text);
    console.log(docment);
    setDocument(DocumentModel.create(docment));

    setTimeout(() => {
      range.setStart(startContainer, startOffset + text.length);
      range.setEnd(startContainer, startOffset + text.length);
      sel.addRange(range);
    });
  };
  const toggleBold = () => {
    const sel = window.getSelection();
    if (!sel || !sel.rangeCount) {
      return;
    }
    const range = sel.getRangeAt(0);
    const startContainer = range.startContainer;
    const startParentEl = startContainer.parentElement;
    const startOffset = range.startOffset;
    const endContainer = range.endContainer;
    const endParentEl = endContainer.parentElement;
    const endOffset = range.endOffset;
    if (!range.collapsed) {
      return;
    }
    if (!startParentEl || !endParentEl) {
      return;
    }
    docment.addInlineStyle(
      startParentEl.id,
      startOffset,
      endParentEl.id,
      endOffset,
      "fontWeight",
      "bold"
    );
    setDocument(DocumentModel.create(docment));
    setTimeout(() => {
      range.setStart(startContainer, endOffset);
      range.setEnd(startContainer, endOffset);
      sel.addRange(range);
    });
  };
  return (
    <div className="editArea" contentEditable="true" onKeyDown={onKeyDown}>
      <Toolbar />
      <Document document={docment} />
    </div>
  );
}
