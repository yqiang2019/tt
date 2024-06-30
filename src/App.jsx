import { useEffect, useState, useRef } from 'react'
import { fabric } from 'fabric'
import './App.scss'

function App() {
  const [url, setUrl] = useState("")

  const ref = useRef(null)
  useEffect(() => {
    const  canvas  = new fabric.Canvas('vis');
    ref.current = canvas;
    // 使用fabric.js绘制图片 crossOrigin
    fabric.Image.fromURL('t2.png', function (oImg) {
      oImg.set({
        // 通过scale来设置图片大小，这里设置和画布一样大
         scaleX: canvas.width / oImg.width,
         scaleY: canvas.height / oImg.height,
       });
      // oImg.scaleToWidth(canvas.width);
      // oImg.scaleToHeight(canvas.height);
      canvas.setBackgroundImage(oImg, canvas.renderAll.bind(canvas));
      canvas.renderAll();
      // canvas.requestRenderAll()
    }, 
    {
      crossOrigin: 'Anonymous'});

    fabric.Image.fromURL('t1.png', function (oImg) {
      canvas.add(oImg).renderAll();
    }, {
      crossOrigin: 'Anonymous'
    
    });
    // 使用fabric.js绘制可编辑文本
    const text = new fabric.IText('hello world', {
      left: 50,
      top: 50,
      fontFamily: 'arial',
      fill: '#333',
      fontSize: 20
    });
    // 使用fabric.js绘制全屏背景图片
   
    canvas.add(text);
    // 使用fabric.js监听画布改变 重新渲染
    canvas.on('object:added', function(event) {
      console.log('Object added:', event.target);
      ref.current.renderAll();
      // ref.current.requestRenderAll();
    });
    
    canvas.on('object:removed', function(event) {
      console.log('Object removed:', event.target);
      // ref.current.renderAll();
      // ref.current.requestRenderAll();
    });
    
    canvas.on('object:modified', function(event) {
      console.log('Object modified:', event.target);
      // ref.current.renderAll();
      // const base64 = ref.current.toDataURL({
      //   format: 'png',
      //   quality: 1
      // });
      // setUrl(base64)
      // ref.current.renderAll();
      // ref.current.requestRenderAll();
    });
    
    // canvas.on('object:moving', function(event) {
    //   console.log('Object moving:', event.target);
    // });
    
    // canvas.on('object:scaling', function(event) {
    //   console.log('Object scaling:', event.target);
    //   ref.current.renderAll();
    //   // ref.current.requestRenderAll();
    // });
    
    // canvas.on('object:rotating', function(event) {
    //   console.log('Object rotating:', event.target);
    //   ref.current.requestRenderAll();
    // });

  }, [setUrl])
  const base64ToBlob = (base64) => {
    const parts = base64.split(';base64,');
    const contentType = parts[0].split(':')[1];
    const raw = window.atob(parts[1]);
    const rawLength = raw.length;
    const uInt8Array = new Uint8Array(rawLength);
    for (let i = 0; i < rawLength; i++) {
      uInt8Array[i] = raw.charCodeAt(i);
    }
    return new Blob([uInt8Array], { type: contentType });
  }
  const base64ToFile = (base64) => {
    const blob = base64ToBlob(base64);
    const url = URL.createObjectURL(blob);
    const filename = 'image.png';
    return fetch(url)
      .then(res => res.blob())
      .then(blob => new File([blob], filename, { type: blob.type }));
  }
  const exportImage = () => {
    const base64 = ref.current.toDataURL({
      format: 'png',
      quality: 1
    });
    // base64 转图片文件
    base64ToFile(base64).then(file => {

      console.log(file);
    });
    console.log(ref.current.toDataURL({
      format: 'png',
      quality: 1
    }));
    // ref.current.renderAll();
    setUrl(base64)
    // ref.current.toBlob(function(blob) {
    //   const url = URL.createObjectURL(blob);
    //   const a = document.createElement('a');
    //   a.href = url;
    //   a.download = 'image.png';
    //   a.click();
    //   URL.revokeObjectURL(url);
    // });
  }
  const exportJson = () => {
    const json = ref.current.toJSON();
    // 通过json渲染画布
    ref.current.clear();
    ref.current.loadFromJSON(json, function() {
      // ref.current.renderAll();
    });
  }
  return (
    <div className='app'>
      <button onClick={exportImage}>点击</button>
      <button onClick={exportJson}>导出json</button>
       <div className='head'>
          <div className='headleft'>asd</div>
          <div className='headright'>
            <canvas id='vis' width="500" height="400"></canvas>
          </div>
       </div>
       <div className='bottom'>
          <img src={url} alt="" />
       </div>
    </div>
  )
}

export default App

