import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import Editor from "./Editor";
import Workflow from "./workflow/Workflow";
import Notice from "./Notice.jsx";
import "./index.scss";
import Drag from "./Drag.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Notice />
  </React.StrictMode>
);
