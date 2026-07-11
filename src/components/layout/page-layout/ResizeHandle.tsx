import { Flex } from "@chakra-ui/react";
import { PointerEvent, useRef } from "react";

interface ResizeHandleProps {
  side: "left" | "right";
  onResize: (delta: number) => void;
  width: number;
}

export function ResizeHandle({ side, onResize, width }: ResizeHandleProps) {
  const startXRef = useRef(0);

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    event.preventDefault();

    startXRef.current = event.clientX;
    event.currentTarget.setPointerCapture(event.pointerId);

    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) {
      return;
    }

    const movement = event.clientX - startXRef.current;
    startXRef.current = event.clientX;

    // Links wird beim Ziehen nach rechts größer.
    // Rechts wird beim Ziehen nach links größer.
    onResize(side === "left" ? movement : -movement);
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
      aria-orientation="vertical"
      aria-label={`${side === "left" ? "Linke" : "Rechte"} Sidebar vergrößern oder verkleinern`}
      width={`${width}px`}
      height="100%"
      flexShrink={0}
      cursor="col-resize"
      bg="transparent"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    />
  );
}
