import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import FileSystemBeautiful from "./components/filesystem-dnd/react-beautiful-dnd";
import FileSystemTree from "./components/filesystem-dnd/react-complex-tree";
import FileSystemRDnD from "./components/filesystem-dnd/react-dnd";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/rb-dnd" element={<FileSystemBeautiful />} />
      <Route path="/rct-dnd" element={<FileSystemTree />} />
      <Route path="/r-dnd" element={<FileSystemRDnD />} />
      <Route path="/" element={<App />} />
    </Routes>
  </BrowserRouter>
);
