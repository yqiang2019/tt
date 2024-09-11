import React from "react";
import audio from "./assets/notice.wav";
// 实现一个排序算法

function Notice() {
  const onClick = () => {
    const a = new Audio(audio);
    a.play();
  };
  return <div onClick={onClick}>Notice</div>;
}

export default Notice;
