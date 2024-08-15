import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import FileSystemBeautiful from "./components/filesystem-dnd/react-beautiful-dnd";
import FileSystemTree from "./components/filesystem-dnd/react-complex-tree";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/rb-dnd" element={<FileSystemBeautiful />} />
      <Route path="/rt-dnd" element={<FileSystemTree />} />
      <Route path="/" element={<App />} />
    </Routes>
  </BrowserRouter>
);
