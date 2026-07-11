import { ReactNode } from "react";

interface IslandProps {
  children: ReactNode;
}

export function Island({ children }: IslandProps) {
  return (
    <div
      style={{
        background: "white",
        borderRadius: "12px",
        padding: "8px",
        width: "100%",
        height: "100%",
        flex: 1,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          overflow: "auto",
          padding: "8px",
        }}
      >
        {children}
      </div>
    </div>
  );
}
