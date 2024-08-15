import React, { useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
  type DraggingStyle,
  type NotDraggingStyle,
} from "react-beautiful-dnd";

// Type definition for item and nested items
interface NestedItem {
  id: string;
  content: string;
}

interface Item {
  id: string;
  content: string;
  fs?: NestedItem[];
}

// fake data generator
const getItems = (count: number): Item[] =>
  Array.from({ length: count }, (_, k) => ({
    id: `item-${k}`,
    content: `item ${k}`,
    fs: [{ id: `file-${k}-nested`, content: `nested item ${k}` }],
  }));

// a little function to help us with reordering the result
const reorder = (list: any[], startIndex: number, endIndex: number): any[] => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const move = (
  source: any[],
  destination: any[],
  droppableSource: any,
  droppableDestination: any
) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  destClone.splice(droppableDestination.index, 0, removed);

  const result: any = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;

  return result;
};

const grid = 8;

const getItemStyle = (
  isDragging: boolean,
  draggableStyle?: DraggingStyle | NotDraggingStyle
) => ({
  userSelect: "none",
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,
  background: isDragging ? "lightgreen" : "grey",
  ...draggableStyle,
});

const getListStyle = (isDraggingOver: boolean) => ({
  background: isDraggingOver ? "lightblue" : "lightgrey",
  padding: grid,
  width: 250,
});

const App: React.FC = () => {
  const [items, setItems] = useState<Item[]>(getItems(10));

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    // Dropped outside the list
    if (!destination) {
      return;
    }

    // Determine the source and destination droppable lists
    const sourceDroppableId = source.droppableId;
    const destinationDroppableId = destination.droppableId;

    // Handle moving within the same droppable list
    if (sourceDroppableId === destinationDroppableId) {
      if (sourceDroppableId === "droppable") {
        // Root level reordering
        const newItems = reorder(items, source.index, destination.index);
        setItems(newItems);
      } else {
        // Nested level reordering
        const parentItem = items.find((item) => item.id === sourceDroppableId);
        if (parentItem && parentItem.fs) {
          const newFs = reorder(parentItem.fs, source.index, destination.index);
          const newItems = items.map((item) =>
            item.id === sourceDroppableId ? { ...item, fs: newFs } : item
          );
          setItems(newItems);
        }
      }
    } else {
      // Handle moving between different droppable lists
      const sourceItems =
        sourceDroppableId === "droppable"
          ? items
          : items.find((item) => item.id === sourceDroppableId)?.fs || [];
      const destItems =
        destinationDroppableId === "droppable"
          ? items
          : items.find((item) => item.id === destinationDroppableId)?.fs || [];

      const movedResult = move(sourceItems, destItems, source, destination);

      if (
        sourceDroppableId === "droppable" &&
        destinationDroppableId === "droppable"
      ) {
        setItems(movedResult[destinationDroppableId]);
      } else {
        const newItems = items.map((item) => {
          if (item.id === sourceDroppableId) {
            return { ...item, fs: movedResult[sourceDroppableId] };
          }
          if (item.id === destinationDroppableId) {
            return { ...item, fs: movedResult[destinationDroppableId] };
          }
          return item;
        });
        setItems(newItems);
      }
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable" type="ITEM">
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            style={getListStyle(snapshot.isDraggingOver)}
          >
            {items.map((item, index) => (
              <Draggable key={item.id} draggableId={item.id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={getItemStyle(
                      snapshot.isDragging,
                      provided.draggableProps.style
                    )}
                  >
                    {item.content}

                    {item.fs && (
                      <Droppable droppableId={item.id} type="NESTED">
                        {(nestedProvided, nestedSnapshot) => (
                          <div
                            {...nestedProvided.droppableProps}
                            ref={nestedProvided.innerRef}
                            style={getListStyle(nestedSnapshot.isDraggingOver)}
                          >
                            {item.fs.map((nested, nestedIndex) => (
                              <Draggable
                                key={nested.id}
                                draggableId={nested.id}
                                index={nestedIndex}
                              >
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    style={getItemStyle(
                                      snapshot.isDragging,
                                      provided.draggableProps.style
                                    )}
                                  >
                                    {nested.content}
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {nestedProvided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    )}
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default App;
