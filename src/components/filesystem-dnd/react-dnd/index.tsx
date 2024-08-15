import React, { useState } from "react";
import { DndProvider } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import type { Item } from "./interface";
import { ListItem } from "./ListItem";
import { fileSystem as initialFileSystem } from "./data";

const FileSystem: React.FC = () => {
  const [fileSystem, setFileSystem] = useState<Item[]>(initialFileSystem);

  const [isDragging, setIsDragging] = useState(false);

  const moveItem = (fromIndex: number, toIndex: number) => {
    const updatedItems = [...fileSystem];
    const [movedItem] = updatedItems.splice(fromIndex, 1);
    updatedItems.splice(toIndex, 0, movedItem);
    setFileSystem(updatedItems);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div
        style={{
          width: "200px",
          margin: "auto",
          background: isDragging ? "rgba(133, 175, 230, .2)" : "#f2f2f2",
          padding: "8px",
          transition: "background-color 0.2s ease",
        }}
      >
        {fileSystem.map((item, index) => (
          <ListItem
            key={item.id}
            index={index}
            item={item}
            moveItem={moveItem}
            setDragging={setIsDragging}
          />
        ))}
      </div>
    </DndProvider>
  );
};

export default FileSystem;
