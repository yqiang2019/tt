import { EditArea } from "./editor/component/EditArea/EditArea";

export default function Editor() {
  const data = {
    type: "document",
    nodes: [
      {
        type: "paragraph",
        segments: [
          {
            type: "segment",
            text: "Hello, World!",
            style: {
              color: "red",
              fontSize: "16px",
            },
          },
        ],
        style: {
          color: "black",
          fontSize: "16px",
        },
      },
    ],
  };
  return (
    <div>
      <EditArea data={data} />
    </div>
  );
}
