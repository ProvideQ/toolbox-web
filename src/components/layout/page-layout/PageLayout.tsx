import { Box, Flex, Spacer } from "@chakra-ui/react";
import { Children, ReactNode } from "react";
import { Main } from "../../Main";
import { Footer } from "../Footer";
import { Island } from "../Island";
import { Sidebar } from "../Sidebar";
import { ResizeHandle } from "./ResizeHandle";
import { useResize } from "./useResize";

const ISLAND_GAP = 4;

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
  width: number | string;
  split: number;
  resizeHandleSize: number;
  islandGap: number;
  onResizeStart: () => void;
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
    startResizeLeftSidebar,
    startResizeRightSidebar,
    startResizeLeftSidebarSplit,
    startResizeRightSidebarSplit,
    resizeLeftSidebar,
    resizeRightSidebar,
    resizeLeftSidebarSplit,
    resizeRightSidebarSplit,
    MIN_MAIN_WIDTH,
    RESIZE_HANDLE_SIZE,
  } = useResize({
    hasLeftSidebar,
    hasRightSidebar,
    islandGap: ISLAND_GAP,
  });

  return (
    <Flex
      direction="column"
      width="100vw"
      height="100vh"
      overflow="hidden"
      bgColor="gray.100"
      padding={`${ISLAND_GAP}px`}
      gap={`${ISLAND_GAP}px`}
    >
      <Box>Hello World</Box>

      <Flex
        direction="row"
        width="100%"
        height="100%"
        overflow="hidden"
        flex={1}
        gap={`${ISLAND_GAP}px`}
      >
        {hasLeftSidebar && (
          <Box
            position="relative"
            width={`${leftWidth}px`}
            height="100%"
            flexShrink={0}
          >
            <PageSidebar
              side="left"
              topContent={leftTopSidebarContent}
              bottomContent={leftBottomSidebarContent}
              width="100%"
              split={leftSplit}
              resizeHandleSize={RESIZE_HANDLE_SIZE}
              islandGap={ISLAND_GAP}
              onResizeStart={startResizeLeftSidebarSplit}
              onResizeSplit={resizeLeftSidebarSplit}
            />

            <ResizeHandle
              orientation="vertical"
              onResizeStart={startResizeLeftSidebar}
              onResize={resizeLeftSidebar}
              size={RESIZE_HANDLE_SIZE}
              gapSize={ISLAND_GAP}
              edge="right"
              ariaLabel="Resize left sidebar"
            />
          </Box>
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
          <Box
            position="relative"
            width={`${rightWidth}px`}
            height="100%"
            flexShrink={0}
          >
            <ResizeHandle
              orientation="vertical"
              onResizeStart={startResizeRightSidebar}
              onResize={resizeRightSidebar}
              size={RESIZE_HANDLE_SIZE}
              gapSize={ISLAND_GAP}
              edge="left"
              invertDelta
              ariaLabel="Resize right sidebar"
            />

            <PageSidebar
              side="right"
              topContent={rightTopSidebarContent}
              bottomContent={rightBottomSidebarContent}
              width="100%"
              split={rightSplit}
              resizeHandleSize={RESIZE_HANDLE_SIZE}
              islandGap={ISLAND_GAP}
              onResizeStart={startResizeRightSidebarSplit}
              onResizeSplit={resizeRightSidebarSplit}
            />
          </Box>
        )}
      </Flex>
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
  islandGap,
  onResizeStart,
  onResizeSplit,
}: PageSidebarProps) {
  const hasTopContent = hasContent(topContent);
  const hasBottomContent = hasContent(bottomContent);
  const sidebarWidth = typeof width === "number" ? `${width}px` : width;

  if (!hasTopContent || !hasBottomContent) {
    return (
      <Sidebar width={sidebarWidth}>
        {hasTopContent ? topContent : bottomContent}
      </Sidebar>
    );
  }

  return (
    <Flex
      direction="column"
      width={sidebarWidth}
      height="100%"
      flexShrink={0}
      overflow="hidden"
      gap={`${islandGap}px`}
    >
      <Flex minHeight={0} flexBasis={0} flexGrow={split} position="relative">
        <Sidebar width="100%">{topContent}</Sidebar>

        <ResizeHandle
          orientation="horizontal"
          onResizeStart={onResizeStart}
          onResize={onResizeSplit}
          size={resizeHandleSize}
          gapSize={islandGap}
          edge="bottom"
          ariaLabel={`Resize ${side} sidebar sections`}
        />
      </Flex>

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
