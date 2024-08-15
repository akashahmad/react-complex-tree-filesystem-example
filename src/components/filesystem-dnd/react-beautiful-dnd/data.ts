import { v4 as uuidv4 } from "uuid";

export const initialData = [
  { id: uuidv4(), name: "File1.js", type: "file" },
  { id: uuidv4(), name: "File2.js", type: "file" },
  {
    id: uuidv4(),
    name: "Folder1",
    type: "folder",
    fileSystem: [{ id: uuidv4(), name: "File3.js", type: "file" }],
  },
  {
    id: uuidv4(),
    name: "Folder2",
    type: "folder",
    fileSystem: [
      { id: uuidv4(), name: "File4.js", type: "file" },
      { id: uuidv4(), name: "File5.js", type: "file" },
    ],
  },
];
