import { Box } from "@mui/material";
import React from "react";
import { Relation, RelationVisualizationProps } from "../interfaces/interfaces";

const RelationVisualization: React.FC<RelationVisualizationProps> = ({ currentNamespace }) => {
  return (
    <Box>
      <h3>Relations</h3>
      {currentNamespace?.relations.map((relation: Relation, index: number) => (
        <Box key={index}>
          <p>
            {relation.fromTable}.{relation.fromColumn} → {relation.toTable}.{relation.toColumn}
          </p>
        </Box>
      ))}
    </Box>
  );
};

export default RelationVisualization;
