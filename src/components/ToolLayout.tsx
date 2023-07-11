import React from "react";

const ToolLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="tool-layout">
      <div>{children}</div>
    </div>
  );
};

export default ToolLayout;
