import React from "react";
import { NodeViewWrapper, ReactNodeViewProps } from "@tiptap/react";

export const MentionNodeView: React.FC<ReactNodeViewProps> = ({ node }) => {
  return (
    <NodeViewWrapper
      className="mention-node-view"
      contentEditable={false}
      draggable={false}
      as="span"
      style={{ display: "inline" }}
    >
      <span
        className="mention"
        data-type="mention"
        data-id={node.attrs.id}
        data-label={node.attrs.label}
        contentEditable={false}
        style={{
          display: "inline-flex",
          alignItems: "center",
          padding: "2px 6px",
          borderRadius: "4px",
          backgroundColor: "var(--muted)",
          color: "var(--primary)",
          fontSize: "14px",
          fontWeight: "500",
          cursor: "default",
          userSelect: "none",
          margin: "0 1px",
          verticalAlign: "baseline",
        }}
      >
        @{node.attrs.label || node.attrs.id}
      </span>
    </NodeViewWrapper>
  );
};
