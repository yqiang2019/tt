import React, { useRef, useState } from "react";

function Drag() {
  const ref = useRef();
  // 定义状态变量来存储元素的位置
  const [position, setPosition] = useState({ x: 0, y: 0 });

  // 实现.fixRight元素的拖拽，并限制拖拽范围
  const onMouseDown = (e) => {
    const startX = e.clientX;
    const startY = e.clientY;
    const startLeft = position.x;
    const startTop = position.y;
    const onMouseMove = (e) => {
      const newX = e.clientX;
      const newY = e.clientY;
      let newLeft = startLeft + newX - startX;
      let newTop = startTop + newY - startY;
      //   // 获取窗口的宽度和高度
      //   const windowWidth = window.innerWidth;
      //   const windowHeight = window.innerHeight;

      //   // 获取子元素的宽度和高度
      //   const childWidth = ref.current.offsetWidth;
      //   const childHeight = ref.current.offsetHeight;

      //   // 计算边界位置
      //   const maxX = windowWidth - childWidth;
      //   const maxY = windowHeight - childHeight;

      //   // 边界限制
      //   if (newLeft < 0) {
      //     newLeft = 0;
      //   } else if (newLeft > maxX) {
      //     newLeft = maxX;
      //   }

      //   if (newTop < 0) {
      //     newTop = 0;
      //   } else if (newTop > maxY) {
      //     newTop = maxY;
      //   }
      setPosition({ x: newLeft, y: newTop });
    };
    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  return (
    <div className="drag">
      <div className="fix">
        <div className="fixLeft"></div>
        <div
          className="fixRight"
          style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
          onMouseDown={onMouseDown}
          ref={ref}
        ></div>
      </div>
    </div>
  );
}

export default Drag;
