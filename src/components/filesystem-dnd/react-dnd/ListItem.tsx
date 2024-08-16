import React, { useState, useEffect, useRef } from "react";
import { useDrag, useDrop, type XYCoord } from "react-dnd";
import { MdInsertDriveFile, MdFolder, MdChevronRight } from "react-icons/md";
import { type DragItem, type Item } from "./interface";

const ACCEPTED_TYPE = "ALL";

export const ListItem: React.FC<{
  item: Item;
  path: number[];
  moveItem: (fromPath: number[], toPath: number[]) => void;
  setDragging: (isDragging: boolean) => void;
}> = ({ item, path, moveItem, setDragging }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false); // state for folder open/close
  const [itemHeight, setItemHeight] = useState<number | null>(null); // state for storing the height of the item
  const [beingDragged, setBeingDragged] = useState(false);

  const [collected, drag, dragPreview] = useDrag({
    type: typeof ACCEPTED_TYPE,
    item: { ...item, path, type: ACCEPTED_TYPE },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    end: () => {
      setBeingDragged(false);
      setDragging(false);
    },
  });

  const [, drop] = useDrop({
    accept: ACCEPTED_TYPE,
    hover: (draggedItem: DragItem, monitor) => {
      if (!ref.current) {
        return;
      }

      const dragPath = draggedItem.path;
      const hoverPath = path;

      // Prevent replacing the item with itself
      if (JSON.stringify(dragPath) === JSON.stringify(hoverPath)) {
        setBeingDragged(true);
        return;
      } else {
        setBeingDragged(false);
      }

      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

      // Only move when the mouse has crossed half of the item's height
      if (
        dragPath[dragPath.length - 1] < hoverPath[hoverPath.length - 1] &&
        hoverClientY < hoverMiddleY
      ) {
        return;
      }

      if (
        dragPath[dragPath.length - 1] > hoverPath[hoverPath.length - 1] &&
        hoverClientY > hoverMiddleY
      ) {
        return;
      }

      // Ensure we're moving the correct item by checking for parent-child relationships
      const isParent = dragPath.every((val, index) => val === hoverPath[index]);
      const isChild = hoverPath.every((val, index) => val === dragPath[index]);

      if (isParent || isChild) {
        return;
      }

      // Perform the move
      moveItem(dragPath, hoverPath);
      draggedItem.path = hoverPath;
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
            collected?.isDragging || beingDragged
              ? "rgba(133, 175, 230, .2)"
              : "#f2f2f2",
          cursor: collected?.isDragging || beingDragged ? "move" : "pointer",
          transition: "background-color 0.2s ease, transform 0.2s ease",
          border:
            collected?.isDragging || beingDragged
              ? "2px dotted #297fb5"
              : "unset",
          marginLeft: path.length * 10 + "px", // indent based on depth
        }}
        onClick={() => item.type === "module" && setIsOpen(!isOpen)}
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
