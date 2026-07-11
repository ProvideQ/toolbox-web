import { Flex, FlexProps } from "@chakra-ui/react";
import { ReactNode } from "react";
import { Island } from "./Island";

interface SidebarProps extends FlexProps {
  children?: ReactNode;
  width: string;
}

export function Sidebar({ children, width, ...props }: SidebarProps) {
  return (
    <Flex width={width} height="100%" flexShrink={0} overflow="hidden">
      <Island>
        <Flex
          width="100%"
          height="100%"
          direction="column"
          bg="white"
          color="black"
          _dark={{
            bg: "gray.900",
            color: "white",
          }}
          transition="background 0.15s ease-out"
          {...props}
        >
          {children}
        </Flex>
      </Island>
    </Flex>
  );
}
