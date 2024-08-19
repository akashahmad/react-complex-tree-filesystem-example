import React, { useState, useEffect, useRef } from "react";
import { useDrag, useDrop, type XYCoord } from "react-dnd";
import { MdInsertDriveFile, MdFolder, MdChevronRight } from "react-icons/md";
import { type DragItem, type Item } from "./interface";

const ACCEPTED_TYPES = "ALL";

export const ListItem: React.FC<{
  item: Item;
  path: number[];
  fileSystem: Item[];
  moveItem: (fromPath: number[], toPath: number[]) => void;
  setDragging: (isDragging: boolean) => void;
  toggleFolder: (path: number[]) => void; // Receive the toggle function
}> = ({ item, path, moveItem, setDragging, fileSystem, toggleFolder }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [itemHeight, setItemHeight] = useState<number | null>(null);
  const [beingDragged, setBeingDragged] = useState(false);
  const [isHoveredInMiddle, setIsHoveredInMiddle] = useState(false);
  const [isHoveredInTop, setIsHoveredInTop] = useState(false);
  const [isHoveredInBottom, setIsHoveredInBottom] = useState(false);

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

      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;
      const isFolderExpanded = item.type === "module" && item.isExpanded;

      let newHoverPath = hoverPath;

      const isHoveringOverFolder =
        item.type === "module" &&
        (!isFolderExpanded || hoverClientY >= hoverMiddleY);
      const isHoveringAtTheTopOfFolder =
        item.type === "module" && hoverClientY > -1.5 && hoverClientY < 5;
      const isHoveringAtTheBottomOfFolder =
        fileSystem.findIndex((x) => x.id === item.id) !== -1 &&
        fileSystem.findIndex((x) => x.id === item.id) ===
          fileSystem.length - 1 &&
        hoverClientY > 0.6 * (itemHeight || 30);

      if (isHoveringAtTheTopOfFolder) {
        setIsHoveredInTop(true);
        setIsHoveredInTop(false);
        moveItem(dragPath, hoverPath);
        return;
      } else if (isHoveringAtTheBottomOfFolder) {
        setIsHoveredInBottom(true);
        setIsHoveredInMiddle(false);
        setIsHoveredInTop(false);
        newHoverPath = [
          ...hoverPath.slice(0, -2),
          hoverPath[hoverPath.length - 2] + 1,
        ];
        moveItem(dragPath, newHoverPath);
        return;
      } else if (isHoveringOverFolder && hoverClientY >= hoverMiddleY) {
        setIsHoveredInMiddle(true);
        setIsHoveredInBottom(false);
        setIsHoveredInTop(false);
        // Place the dragged item at the first index inside the folder
        newHoverPath = [...hoverPath, 0];
      } else {
        setIsHoveredInMiddle(false);
        setIsHoveredInBottom(false);
        setIsHoveredInTop(false);
      }

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

      const isParent = dragPath.every((val, index) => val === hoverPath[index]);
      const isChild = hoverPath.every((val, index) => val === dragPath[index]);

      if (isParent || isChild) {
        return;
      }

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
      setItemHeight(
        ref.current.clientHeight *
          (item?.fileSystem ? item.fileSystem.length || 1 : 1)
      );
    }
  }, [item.fileSystem, itemHeight]);

  const renderPlaceholder = (depth: number) => (
    <span
      style={{
        display: "block",
        height: itemHeight ? `${itemHeight}px` : "auto",
        backgroundColor: "rgba(133, 175, 230, .2)",
        border: "2px dotted #297fb5",
        marginLeft: `${depth * 10}px`,
        width: `calc(100% - ${depth * 10}px)`,
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
              transform: item.isExpanded ? "rotate(90deg)" : "rotate(0deg)",
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
          marginLeft: path.length * 10 + "px",
        }}
        onClick={() => {
          if (item.type === "module") {
            toggleFolder(path);
          }
        }}
      >
        {collected?.isDragging ? <span>&nbsp;</span> : renderItemContent()}
      </div>

      {item.isExpanded &&
        item.fileSystem &&
        item.fileSystem.map((childItem, index) => (
          <React.Fragment key={childItem.id}>
            {collected?.isDragging ? (
              renderPlaceholder(path.length + 1)
            ) : (
              <ListItem
                item={childItem}
                path={[...path, index]}
                moveItem={moveItem}
                fileSystem={item?.fileSystem || []}
                setDragging={setDragging}
                toggleFolder={toggleFolder} // Pass the toggle function
              />
            )}
          </React.Fragment>
        ))}
    </div>
  );
};
