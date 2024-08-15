import React from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { FaFile, FaFolder } from "react-icons/fa";

const FileSystem = ({ items, parentId, index }) => {
  return (
    <Droppable droppableId={parentId} type="file">
      {(provided) => (
        <div {...provided.droppableProps} ref={provided.innerRef}>
          {items.map((item, idx) => (
            <Draggable key={item.id} draggableId={item.id} index={idx}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  style={{
                    userSelect: "none",
                    padding: 16,
                    margin: "0 0 8px 0",
                    display: "flex",
                    alignItems: "center",
                    background: "#fff",
                    border: "1px solid lightgrey",
                    borderRadius: 4,
                    ...provided.draggableProps.style,
                  }}
                >
                  {item.type === "file" ? (
                    <FaFile style={{ marginRight: 8 }} />
                  ) : (
                    <FaFolder style={{ marginRight: 8 }} />
                  )}
                  {item.name}

                  {item.type === "folder" && item.fileSystem && (
                    <FileSystem
                      items={item.fileSystem}
                      parentId={item.id}
                      index={idx}
                    />
                  )}
                </div>
              )}
            </Draggable>
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};

export default FileSystem;
