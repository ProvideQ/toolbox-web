import { Flex, Spacer } from "@chakra-ui/react";
import { Children, ReactNode } from "react";
import { Main } from "../../Main";
import { Footer } from "../Footer";
import { Island } from "../Island";
import { Sidebar } from "../Sidebar";
import { ResizeHandle } from "./ResizeHandle";
import { useResize } from "./useResize";

interface Props {
  leftTopSidebarContent?: ReactNode;
  leftBottomSidebarContent?: ReactNode;
  rightTopSidebarContent?: ReactNode;
  rightBottomSidebarContent?: ReactNode;
  children: ReactNode;
}

interface PageSidebarProps {
  side: "left" | "right";
  topContent?: ReactNode;
  bottomContent?: ReactNode;
  width: number;
  split: number;
  resizeHandleSize: number;
  onResizeSplit: (delta: number) => void;
}

export function PageLayout({
  leftTopSidebarContent,
  leftBottomSidebarContent,
  rightTopSidebarContent,
  rightBottomSidebarContent,
  children,
}: Props) {
  const hasLeftSidebar =
    hasContent(leftTopSidebarContent) || hasContent(leftBottomSidebarContent);
  const hasRightSidebar =
    hasContent(rightTopSidebarContent) || hasContent(rightBottomSidebarContent);

  const {
    leftWidth,
    rightWidth,
    leftSplit,
    rightSplit,
    resizeLeftSidebar,
    resizeRightSidebar,
    resizeLeftSidebarSplit,
    resizeRightSidebarSplit,
    MIN_MAIN_WIDTH,
    LAYOUT_PADDING,
    RESIZE_HANDLE_SIZE,
  } = useResize({ hasLeftSidebar, hasRightSidebar });

  return (
    <Flex
      direction="row"
      width="100vw"
      height="100vh"
      overflow="hidden"
      bgColor="gray.100"
      padding={`${LAYOUT_PADDING}px`}
      gap={0}
    >
      {hasLeftSidebar && (
        <>
          <PageSidebar
            side="left"
            topContent={leftTopSidebarContent}
            bottomContent={leftBottomSidebarContent}
            width={leftWidth}
            split={leftSplit}
            resizeHandleSize={RESIZE_HANDLE_SIZE}
            onResizeSplit={resizeLeftSidebarSplit}
          />

          <ResizeHandle
            orientation="vertical"
            onResize={resizeLeftSidebar}
            size={RESIZE_HANDLE_SIZE}
            ariaLabel="Resize left sidebar"
          />
        </>
      )}

      <Flex
        minWidth={`${MIN_MAIN_WIDTH}px`}
        height="100%"
        flex={1}
        overflow="hidden"
      >
        <Island>
          <Flex
            direction="column"
            width="100%"
            minHeight="100%"
            alignItems="center"
          >
            {/*<Hero title="ProvideQ" />*/}
            <Main>{children}</Main>

            <Spacer mb="5rem" />
            <Footer />
          </Flex>
        </Island>
      </Flex>

      {hasRightSidebar && (
        <>
          <ResizeHandle
            orientation="vertical"
            onResize={resizeRightSidebar}
            size={RESIZE_HANDLE_SIZE}
            invertDelta
            ariaLabel="Resize right sidebar"
          />

          <PageSidebar
            side="right"
            topContent={rightTopSidebarContent}
            bottomContent={rightBottomSidebarContent}
            width={rightWidth}
            split={rightSplit}
            resizeHandleSize={RESIZE_HANDLE_SIZE}
            onResizeSplit={resizeRightSidebarSplit}
          />
        </>
      )}
    </Flex>
  );
}

function PageSidebar({
  side,
  topContent,
  bottomContent,
  width,
  split,
  resizeHandleSize,
  onResizeSplit,
}: PageSidebarProps) {
  const hasTopContent = hasContent(topContent);
  const hasBottomContent = hasContent(bottomContent);

  if (!hasTopContent || !hasBottomContent) {
    return (
      <Sidebar width={`${width}px`}>
        {hasTopContent ? topContent : bottomContent}
      </Sidebar>
    );
  }

  return (
    <Flex
      direction="column"
      width={`${width}px`}
      height="100%"
      flexShrink={0}
      overflow="hidden"
    >
      <Flex minHeight={0} flexBasis={0} flexGrow={split} overflow="hidden">
        <Sidebar width="100%">{topContent}</Sidebar>
      </Flex>

      <ResizeHandle
        orientation="horizontal"
        onResize={onResizeSplit}
        size={resizeHandleSize}
        ariaLabel={`Resize ${side} sidebar sections`}
      />

      <Flex
        minHeight={0}
        flexBasis={0}
        flexGrow={100 - split}
        overflow="hidden"
      >
        <Sidebar width="100%">{bottomContent}</Sidebar>
      </Flex>
    </Flex>
  );
}

function hasContent(content: ReactNode) {
  return Children.toArray(content).length > 0;
}
