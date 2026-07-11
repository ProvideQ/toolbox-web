import { Flex, Spacer } from "@chakra-ui/react";
import { ReactNode } from "react";
import { Main } from "../../Main";
import { Footer } from "../Footer";
import { Island } from "../Island";
import { Sidebar } from "../Sidebar";
import { ResizeHandle } from "./ResizeHandle";
import { useResize } from "./useResize";

interface Props {
  leftSidebar?: ReactNode;
  rightSidebar?: ReactNode;
  children: ReactNode;
}

export function PageLayout({ leftSidebar, rightSidebar, children }: Props) {
  const {
    leftWidth,
    rightWidth,
    resizeLeftSidebar,
    resizeRightSidebar,
    MIN_MAIN_WIDTH,
    LAYOUT_PADDING,
    RESIZE_HANDLE_WIDTH,
  } = useResize();

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
      <Sidebar width={`${leftWidth}px`}>{leftSidebar}</Sidebar>

      <ResizeHandle
        side="left"
        onResize={resizeLeftSidebar}
        width={RESIZE_HANDLE_WIDTH}
      />

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

      <ResizeHandle
        side="right"
        onResize={resizeRightSidebar}
        width={RESIZE_HANDLE_WIDTH}
      />

      <Sidebar width={`${rightWidth}px`}>{rightSidebar}</Sidebar>
    </Flex>
  );
}
