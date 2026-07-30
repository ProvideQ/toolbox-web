import { Flex } from "@chakra-ui/react";
import { PointerEvent, useRef } from "react";

interface ResizeHandleProps {
  orientation: "horizontal" | "vertical";
  onResize: (delta: number) => void;
  size: number;
  invertDelta?: boolean;
  ariaLabel: string;
}

export function ResizeHandle({
  orientation,
  onResize,
  size,
  invertDelta = false,
  ariaLabel,
}: ResizeHandleProps) {
  const startPositionRef = useRef(0);
  const cursor = orientation === "vertical" ? "col-resize" : "row-resize";

  const getPointerPosition = (event: PointerEvent<HTMLDivElement>) =>
    orientation === "vertical" ? event.clientX : event.clientY;

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    event.preventDefault();

    startPositionRef.current = getPointerPosition(event);
    event.currentTarget.setPointerCapture(event.pointerId);

    document.body.style.cursor = cursor;
    document.body.style.userSelect = "none";
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) {
      return;
    }

    const currentPosition = getPointerPosition(event);
    const movement = currentPosition - startPositionRef.current;
    startPositionRef.current = currentPosition;

    onResize(invertDelta ? -movement : movement);
  };

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    document.body.style.cursor = "";
    document.body.style.userSelect = "";
  };

  return (
    <Flex
      role="separator"
      aria-orientation={orientation}
      aria-label={ariaLabel}
      width={orientation === "vertical" ? `${size}px` : "100%"}
      height={orientation === "horizontal" ? `${size}px` : "100%"}
      flexShrink={0}
      cursor={cursor}
      bg="transparent"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    />
  );
}
