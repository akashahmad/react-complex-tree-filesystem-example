export interface Item {
  id: string;
  name: string;
  type: "file" | "module";
  isExpanded?: boolean; // Optional property, only for modules
  fileSystem?: Item[];
}

export type DragItem = Item & { index: number };
