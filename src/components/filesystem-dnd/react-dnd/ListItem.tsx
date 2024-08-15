import React from "react";
import { useDrag, useDrop, type XYCoord } from "react-dnd";
import { MdInsertDriveFile, MdFolder, MdChevronRight } from "react-icons/md";
import { type DragItem, type Item } from "./interface";

const ACCEPTED_TYPE = "ALL";

export const ListItem: React.FC<{
  item: Item;
  index: number;
  moveItem: (fromIndex: number, toIndex: number) => void;
  setDragging: (isDragging: boolean) => void;
}> = ({ item, index, moveItem, setDragging }) => {
  const ref = React.useRef<HTMLDivElement>(null);

  const [collected, drag, dragPreview] = useDrag({
    type: typeof ACCEPTED_TYPE,
    item: { ...item, index, type: ACCEPTED_TYPE },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    end: () => setDragging(false),
  });

  const [, drop] = useDrop({
    accept: ACCEPTED_TYPE,
    hover: (draggedItem: DragItem, monitor) => {
      if (!ref.current) {
        return;
      }
      const dragIndex = draggedItem.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      moveItem(dragIndex, hoverIndex);
      draggedItem.index = hoverIndex;
    },
  });

  drag(drop(ref));

  React.useEffect(() => {
    if (collected?.isDragging) {
      setDragging(true);
    }
  }, [collected?.isDragging, setDragging]);

  return (
    <div ref={dragPreview}>
      <div
        ref={ref}
        style={{
          marginBottom: "4px",
          padding: "4px",
          backgroundColor: collected?.isDragging
            ? "rgba(133, 175, 230, .2)"
            : "#f2f2f2",
          cursor: collected?.isDragging ? "move" : "pointer",
          transition: "background-color 0.2s ease, transform 0.2s ease",
          border: collected?.isDragging ? "2px dotted #297fb5" : "unset",
        }}
      >
        {collected?.isDragging ? (
          <span>&nbsp;</span>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {item.type === "module" ? (
              <span style={{ display: "flex", alignItems: "center", gap: 1 }}>
                <MdChevronRight color="gray" size={18} />
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
        )}
      </div>
    </div>
  );
};
