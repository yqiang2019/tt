export function Toolbar(props) {
  return (
    <div className="toolbar">
      <button onClick={props.onAddSegment}>Add Segment</button>
      <button onClick={props.onAddImage}>Add Image</button>
    </div>
  );
}
