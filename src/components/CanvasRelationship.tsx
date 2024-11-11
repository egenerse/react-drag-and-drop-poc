import React from "react";
import { useAppSelector } from "../store/hooks";
import { RootState } from "../store";

interface CanvasRelationshipProps {
  relationshipId: string;
}

const CanvasRelationship: React.FC<CanvasRelationshipProps> = ({ relationshipId }) => {
  const relationship = useAppSelector((state: RootState) =>
    state.relationships.relationships.find((rel) => rel.id === relationshipId)
  );

  if (!relationship) return null;

  const points = relationship.path.map((point) => `${point.x},${point.y}`).join(" ");

  return (
    <svg
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
    >
      <polyline
        points={points}
        stroke="black"
        fill="none"
        strokeWidth={2}
      />
    </svg>
  );
};

export default CanvasRelationship;
