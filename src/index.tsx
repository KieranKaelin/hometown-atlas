import * as React from "react";
import { createRoot } from "react-dom/client";
import { Map } from "./components/map";

const root = createRoot(document.getElementById("root")!);
root.render(<Map />);
