import * as React from "react";
import { createRoot } from "react-dom/client";
import { Map } from "./components/map";
import "./locales/i18n";

const root = createRoot(document.getElementById("root")!);
root.render(<Map />);
