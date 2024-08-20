import React, { useState } from "react";
import { DndProvider } from "react-dnd";
import { MdNotInterested } from "react-icons/md";
import { HTML5Backend } from "react-dnd-html5-backend";
import type { Item } from "./interface";
import { ListItem } from "./ListItem";
import { fileSystem as initialFileSystem } from "./data";

const FileSystem: React.FC = () => {
  const [fileSystem, setFileSystem] = useState<Item[]>(initialFileSystem);
  const [tempFileSystem, setTempFileSystem] =
    useState<Item[]>(initialFileSystem);
  const [isInsideDroppable, setIsInsideDroppable] = useState(true);
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
      setIsDragging(false); // Reset dragging state after the final move
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

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsInsideDroppable(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsInsideDroppable(false);
    }
  };

  const handleDrop = () => {
    setIsInsideDroppable(false);
    setIsDragging(false); // Reset dragging state after drop
  };

  const handleDraggingState = (dragging: boolean) => {
    if (!dragging) {
      setIsInsideDroppable(true);
    }
    setIsDragging(dragging);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div
        style={{
          width: "200px",
          margin: "auto",
          background:
            isInsideDroppable && isDragging
              ? "rgba(133, 175, 230, .2)"
              : "#f2f2f2",
          padding: "8px",
          transition: "background-color 0.2s ease",
          border: isDragging && !isInsideDroppable ? "2px dashed red" : "unset",
          position: "relative",
        }}
        // onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {isDragging && !isInsideDroppable && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(255, 0, 0, 0.1)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 10,
              gap: 2,
            }}
          >
            <MdNotInterested color="red" style={{ marginTop: -20 }} size={90} />
            <span
              style={{
                color: "red",
                fontSize: "18px",
                textAlign: "center",
                fontWeight: "bold",
                maxWidth: "90%",
                lineHeight: 1.5,
                textShadow: "4px 4px 8px rgba(56, 0, 0, 0.393)",
              }}
            >
              You have Moved the Item outside of the droppable area, Please
              release the item and drag it again!
            </span>
          </div>
        )}

        {tempFileSystem.map((item, index) => (
          <ListItem
            key={item.id}
            path={[index]}
            item={item}
            fileSystem={tempFileSystem || []}
            moveItem={handleMoveItem}
            setDragging={handleDraggingState} // Manage dragging state
            toggleFolder={toggleFolder} // Pass the toggle function
          />
        ))}
      </div>
    </DndProvider>
  );
};

export default FileSystem;
