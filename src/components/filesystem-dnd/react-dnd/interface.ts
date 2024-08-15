export interface Item {
  id: string;
  name: string;

  type: "file" | "module";

  fileSystem?: Item[];
}

export type DragItem = Item & { index: number };
