import React, { useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import type { Item } from "./interface";
import { ListItem } from "./ListItem";
import { fileSystem as initialFileSystem } from "./data";

const FileSystem: React.FC = () => {
  const [fileSystem, setFileSystem] = useState<Item[]>(initialFileSystem);
  const [tempFileSystem, setTempFileSystem] =
    useState<Item[]>(initialFileSystem);
  const [isDragging, setIsDragging] = useState(false);

  const moveItem = (
    fromPath: number[],
    toPath: number[],
    updateTemp = true
  ) => {
    const updateSystem = updateTemp ? setTempFileSystem : setFileSystem;
    updateSystem((prevFileSystem) => {
      const updatedFileSystem = JSON.parse(JSON.stringify(prevFileSystem));

      // Find the item being moved
      const itemToMove = fromPath.reduce(
        (currentItem, pathIndex) => currentItem?.fileSystem?.[pathIndex],
        { fileSystem: updatedFileSystem }
      );

      if (!itemToMove) {
        console.error("Item to move is undefined.");
        return fileSystem;
      }

      // Remove the item from the original location
      const parentFrom = fromPath
        .slice(0, -1)
        .reduce(
          (currentItem, pathIndex) => currentItem?.fileSystem?.[pathIndex],
          { fileSystem: updatedFileSystem }
        );

      if (!parentFrom?.fileSystem) {
        console.error("Parent for removing item is undefined.");
        return prevFileSystem;
      }

      parentFrom.fileSystem.splice(fromPath[fromPath.length - 1], 1);

      // Add the item to the new location
      const parentTo = toPath
        .slice(0, -1)
        .reduce(
          (currentItem, pathIndex) => currentItem?.fileSystem?.[pathIndex],
          { fileSystem: updatedFileSystem }
        );

      if (!parentTo?.fileSystem) {
        console.error("Parent for adding item is undefined.");
        return prevFileSystem;
      }

      parentTo.fileSystem.splice(toPath[toPath.length - 1], 0, itemToMove);

      return updatedFileSystem;
    });
  };

  const handleMoveItem = (
    fromPath: number[],
    toPath: number[],
    isFinalMove = false
  ) => {
    moveItem(fromPath, toPath, !isFinalMove);
    if (isFinalMove) {
      // Synchronize the fileSystem with tempFileSystem after drop
      setFileSystem(() => JSON.parse(JSON.stringify(tempFileSystem)));
    }
  };

  const toggleFolder = (path: number[]) => {
    setFileSystem((prevFileSystem) => {
      const updatedFileSystem = JSON.parse(JSON.stringify(prevFileSystem));

      const targetFolder = path.reduce(
        (currentItem, pathIndex) => currentItem?.fileSystem?.[pathIndex],
        { fileSystem: updatedFileSystem }
      );

      if (targetFolder && (targetFolder as Item).type === "module") {
        (targetFolder as Item).isExpanded = !(targetFolder as Item).isExpanded;
      }

      setTempFileSystem(updatedFileSystem); // Sync tempFileSystem with fileSystem
      return updatedFileSystem;
    });
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
        {tempFileSystem.map((item, index) => (
          <ListItem
            key={item.id}
            path={[index]}
            item={item}
            fileSystem={tempFileSystem || []}
            moveItem={handleMoveItem}
            setDragging={setIsDragging}
            toggleFolder={toggleFolder} // Pass the toggle function
          />
        ))}
      </div>
    </DndProvider>
  );
};

export default FileSystem;
