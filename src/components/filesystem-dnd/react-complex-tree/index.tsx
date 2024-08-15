/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  UncontrolledTreeEnvironment,
  Tree,
  StaticTreeDataProvider,
} from "react-complex-tree";
import {
  MdChevronRight,
  MdFolder,
  MdFolderOpen,
  MdOutlineInsertDriveFile,
} from "react-icons/md";
function App() {
  const items = {
    root: {
      index: "root",
      canMove: true,
      isFolder: true,
      children: ["child1", "child2", "child4", "child9"],
      data: "Root item",
      canRename: true,
    },
    child1: {
      index: "child1",
      canMove: true,
      isFolder: false,
      children: [],
      data: "Child item 1",
      canRename: true,
    },
    child2: {
      index: "child2",
      canMove: true,
      children: ["child3", "child8"],
      data: "Child item 2",
      canRename: true,
      isFolder: true,
    },
    child3: {
      index: "child3",
      canMove: true,
      isFolder: false,
      children: [],
      data: "Child item 3",
      canRename: true,
    },
    child4: {
      index: "child4",
      canMove: true,
      isFolder: true,
      children: ["child5", "child6", "child7"],
      data: "Child item 4",
      canRename: true,
    },
    child5: {
      index: "child5",
      canMove: true,
      isFolder: false,
      children: [],
      data: "Child item 5",
      canRename: true,
    },
    child6: {
      index: "child6",
      canMove: true,
      isFolder: false,
      children: [],
      data: "Child item 6",
      canRename: true,
    },
    child7: {
      index: "child7",
      canMove: true,
      isFolder: false,
      children: [],
      data: "Child item 7",
      canRename: true,
    },
    child8: {
      index: "child8",
      canMove: true,
      isFolder: false,
      children: [],
      data: "Child item 8",
      canRename: true,
    },
    child9: {
      index: "child9",
      canMove: true,
      isFolder: true,
      children: ["child10", "nested", "child11"],
      data: "Child item 9",
      canRename: true,
    },
    child10: {
      index: "child10",
      canMove: true,
      isFolder: false,
      children: [],
      data: "Child item 10",
      canRename: true,
    },
    child11: {
      index: "child11",
      canMove: true,
      isFolder: false,
      children: [],
      data: "Child item 11",
      canRename: true,
    },
    nested: {
      index: "nested",
      canMove: true,
      isFolder: true,
      children: ["nestedItem"],
      data: "Nested Folder",
      canRename: true,
    },
    nestedItem: {
      index: "nestedItem",
      canMove: true,
      isFolder: false,
      children: [],
      data: "Nested Item",
      canRename: true,
    },
  };

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <h3>
          <span style={{ fontFamily: "Roboto, sans-serif" }}>
            Draggable FileSystem with:{" "}
          </span>
        </h3>
        <h3>
          <pre>
            <code>``react-complex-tree``</code>
          </pre>
        </h3>
      </div>
      <div
        style={{
          background: "#f3f3f3",
          maxWidth: 800,
          margin: "0px auto",
        }}
      >
        <UncontrolledTreeEnvironment
          dataProvider={
            new StaticTreeDataProvider(items, (item, data) => ({
              ...item,
              data,
            }))
          }
          canDragAndDrop
          canDropOnFolder
          showLiveDescription
          canReorderItems
          canDropBelowOpenFolders
          getItemTitle={(item) => item.data}
          viewState={{}}
          {...{
            renderItemsContainer: (props) => (
              <ul
                style={{
                  listStyle: "none",
                  margin: 0,
                  padding: 0,
                  paddingLeft: 12,
                }}
                {...props.containerProps}
              >
                {props.children}
              </ul>
            ),

            renderItem: (props) => (
              <li {...props.context.itemContainerWithChildrenProps}>
                <div
                  {...props.context.itemContainerWithoutChildrenProps}
                  {...props.context.interactiveElementProps}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    padding: "4px 0px",
                    background: props.context.isFocused
                      ? "rgba(213, 81, 81, 0.2)"
                      : "inherit",
                  }}
                >
                  {props.item.isFolder ? props.arrow : <span />}
                  {(() => {
                    const icon = !props.item.isFolder
                      ? "document"
                      : props.context.isExpanded
                      ? "folder-open"
                      : "folder-close";

                    switch (icon) {
                      case "document":
                        return (
                          <span style={{ marginLeft: 16 }}>
                            <MdOutlineInsertDriveFile fill="gray" />
                          </span>
                        );
                      case "folder-close":
                        return <MdFolder fill="orangered" />;
                      case "folder-open":
                        return <MdFolderOpen fill="orangered" />;
                    }
                  })()}
                  {props.title}
                </div>
                <div
                  style={{
                    position: "relative",
                    paddingBottom: props.context.isExpanded ? "4px" : "0px",
                  }}
                >
                  <span>{props.children}</span>
                </div>
              </li>
            ),

            renderItemArrow: (props) =>
              props.context.isExpanded ? (
                <span style={{ transform: "rotate(90deg)" }}>
                  <MdChevronRight fill="gray" />
                </span>
              ) : (
                <span>
                  <MdChevronRight fill="gray" />
                </span>
              ),

            renderItemTitle: ({ title, context, info }: any) => {
              if (!info.isSearching || !context.isSearchMatching) {
                return (
                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: 400,
                      fontFamily: "Roboto, sans-serif",
                    }}
                  >
                    {title}
                  </span>
                );
              }
              const startIndex = title
                .toLowerCase()
                .indexOf(info.search.toLowerCase());
              return (
                <>
                  {startIndex > 0 && <span>{title.slice(0, startIndex)}</span>}
                  <span>
                    {title.slice(startIndex, startIndex + info.search.length)}
                  </span>
                  {startIndex + info.search.length < title.length && (
                    <span>
                      {title.slice(
                        startIndex + info.search.length,
                        title.length
                      )}
                    </span>
                  )}
                </>
              );
            },

            renderDragBetweenLine: ({ draggingPosition, lineProps }) => (
              <div
                {...lineProps}
                style={{
                  position: "relative",
                  // right: "0",
                  // zIndex: 100,
                  top:
                    draggingPosition.targetType === "between-items" &&
                    draggingPosition.linePosition === "top"
                      ? "-6px"
                      : draggingPosition.targetType === "between-items" &&
                        draggingPosition.linePosition === "bottom"
                      ? "-8px"
                      : "-8px",
                  left: `${draggingPosition.depth * 40}px`,
                  height: "6px",
                  borderBottom: "6px solid red",
                }}
              />
            ),

            renderRenameInput: (props) => (
              <form {...props.formProps} style={{ display: "contents" }}>
                <span>
                  <input
                    {...props.inputProps}
                    ref={props.inputRef}
                    className="rct-tree-item-renaming-input"
                  />
                </span>
                <span>
                  <span
                  // icon="tick"
                  // ref={props.submitButtonRef}
                  // {...props.submitButtonProps}
                  // type="submit"
                  // minimal
                  // small
                  />
                </span>
              </form>
            ),
          }}
        >
          <Tree treeId="tree-1" rootItem="root" treeLabel="Tree Example" />
        </UncontrolledTreeEnvironment>
      </div>
    </>
  );
}

export default App;
