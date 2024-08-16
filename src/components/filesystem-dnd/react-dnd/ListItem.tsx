import React, { useState, useEffect, useRef } from "react";
import { useDrag, useDrop, type XYCoord } from "react-dnd";
import { MdInsertDriveFile, MdFolder, MdChevronRight } from "react-icons/md";
import { type DragItem, type Item } from "./interface";

const ACCEPTED_TYPES = "ALL";

export const ListItem: React.FC<{
  item: Item;
  path: number[];
  moveItem: (fromPath: number[], toPath: number[]) => void;
  setDragging: (isDragging: boolean) => void;
}> = ({ item, path, moveItem, setDragging }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [itemHeight, setItemHeight] = useState<number | null>(null);
  const [beingDragged, setBeingDragged] = useState(false);
  const [isHoveredInMiddle, setIsHoveredInMiddle] = useState(false);

  const [collected, drag, dragPreview] = useDrag({
    type: ACCEPTED_TYPES,
    item: { ...item, path, type: ACCEPTED_TYPES },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    end: () => {
      setBeingDragged(false);
      setDragging(false);
    },
  });

  const [, drop] = useDrop({
    accept: ACCEPTED_TYPES,
    hover: (draggedItem: DragItem, monitor) => {
      if (!ref.current) {
        return;
      }

      const dragPath = draggedItem.path;
      const hoverPath = path;

      // Prevent replacing the item with itself
      if (JSON.stringify(dragPath) === JSON.stringify(hoverPath)) {
        if (!beingDragged) {
          setBeingDragged(true);
          setTimeout(() => {
            setBeingDragged(false);
          }, 1000);
        }
        return;
      } else {
        setBeingDragged(false);
      }

      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

      let newHoverPath = hoverPath;

      // Check if the hovered item is a folder
      const isHoveringOverFolder =
        item.type === "module" && (!isOpen || hoverClientY >= hoverMiddleY);

      if (isHoveringOverFolder && hoverClientY >= hoverMiddleY) {
        // Place the dragged item at the first index inside the folder
        newHoverPath = [...hoverPath, 0];
        setIsHoveredInMiddle(true);
      } else {
        setIsHoveredInMiddle(false);

        // Determine if we're moving up or down within the same level
        const moveUp = hoverClientY < hoverMiddleY;
        const targetIndex = moveUp
          ? hoverPath[hoverPath.length - 1]
          : hoverPath[hoverPath.length - 1] + 1;

        newHoverPath = [...hoverPath.slice(0, -1), targetIndex];
      }

      // Ensure we're not trying to move the item into itself or its own children
      const isParent = dragPath.every((val, index) => val === hoverPath[index]);
      const isChild = hoverPath.every((val, index) => val === dragPath[index]);

      if (isParent || isChild) {
        return;
      }

      // Perform the move only if the target path is different
      if (JSON.stringify(dragPath) !== JSON.stringify(newHoverPath)) {
        moveItem(dragPath, newHoverPath);
        draggedItem.path = newHoverPath;
      }
    },
    drop: () => {
      setBeingDragged(false);
      setIsHoveredInMiddle(false);
    },
  });

  drag(drop(ref));

  useEffect(() => {
    if (collected?.isDragging) {
      setDragging(true);
    } else {
      setBeingDragged(false);
      setDragging(false);
    }
  }, [collected?.isDragging, setDragging]);

  useEffect(() => {
    if (ref.current && itemHeight === null) {
      setItemHeight(ref.current.clientHeight);
    }
  }, [itemHeight]);

  const renderPlaceholder = (depth: number) => (
    <span
      style={{
        display: "block",
        height: itemHeight ? `${itemHeight}px` : "auto",
        backgroundColor: "rgba(133, 175, 230, .2)",
        border: "2px dotted #297fb5",
        marginLeft: `${depth * 10}px`, // indent based on depth
        width: `calc(100% - ${depth * 10}px)`, // reduce width based on depth
      }}
    >
      &nbsp;
    </span>
  );

  const renderItemContent = () => (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      {item.type === "module" ? (
        <span style={{ display: "flex", alignItems: "center", gap: 1 }}>
          <MdChevronRight
            color="gray"
            size={18}
            style={{
              transform: isOpen ? "rotate(90deg)" : "rotate(0deg)",
              transition: "transform 0.2s ease",
            }}
          />
          <MdFolder color="gray" size={18} />
        </span>
      ) : (
        <span style={{ marginLeft: 16 }}>
          <MdInsertDriveFile color="gray" size={18} />
        </span>
      )}
      <span style={{ fontSize: 14, fontFamily: "Roboto, san-serif" }}>
        {item.name}
      </span>
    </div>
  );

  return (
    <div ref={dragPreview}>
      <div
        ref={ref}
        style={{
          marginBottom: "4px",
          padding: "4px",
          backgroundColor:
            collected?.isDragging || beingDragged || isHoveredInMiddle
              ? "rgba(133, 175, 230, .2)"
              : "#f2f2f2",
          cursor: collected?.isDragging || beingDragged ? "move" : "pointer",
          transition: "background-color 0.2s ease, transform 0.2s ease",
          border:
            collected?.isDragging || beingDragged || isHoveredInMiddle
              ? "2px dotted #297fb5"
              : "unset",
          marginLeft: path.length * 10 + "px", // indent based on depth
        }}
        onClick={() => {
          if (item.type === "module") {
            setIsOpen(!isOpen);
          }
        }}
      >
        {collected?.isDragging ? <span>&nbsp;</span> : renderItemContent()}
      </div>

      {isOpen &&
        item.fileSystem &&
        item.fileSystem.map((childItem, index) => (
          <React.Fragment key={childItem.id}>
            {collected?.isDragging ? (
              renderPlaceholder(path.length + 1) // Indent children more
            ) : (
              <ListItem
                item={childItem}
                path={[...path, index]}
                moveItem={moveItem}
                setDragging={setDragging}
              />
            )}
          </React.Fragment>
        ))}
    </div>
  );
};
