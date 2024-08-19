import type { Item } from "./interface";
import { v4 as uuidv4 } from "uuid";

export const fileSystem: Item[] = [
  { id: uuidv4(), name: "Item 1", type: "file" },
  { id: uuidv4(), name: "Item 2", type: "file" },
  {
    id: uuidv4(),
    name: "Item 3",
    type: "module",
    isExpanded: false, // New property
    fileSystem: [
      { id: uuidv4(), name: "Item 8", type: "file" },
      { id: uuidv4(), name: "Item 9", type: "file" },
    ],
  },
  { id: uuidv4(), name: "Item 4", type: "file" },
  {
    id: uuidv4(),
    name: "Item 5",
    type: "module",
    isExpanded: false, // New property
    fileSystem: [
      { id: uuidv4(), name: "Item 10", type: "file" },
      { id: uuidv4(), name: "Item 11", type: "file" },
      { id: uuidv4(), name: "Item 12", type: "file" },
      {
        id: uuidv4(),
        name: "Item 13",
        type: "module",
        isExpanded: false, // New property
        fileSystem: [
          { id: uuidv4(), name: "Item 16", type: "file" },
          { id: uuidv4(), name: "Item 17", type: "file" },
        ],
      },
      { id: uuidv4(), name: "Item 14", type: "file" },
      { id: uuidv4(), name: "Item 15", type: "file" },
    ],
  },
  { id: uuidv4(), name: "Item 6", type: "file" },
  { id: uuidv4(), name: "Item 7", type: "file" },
];
