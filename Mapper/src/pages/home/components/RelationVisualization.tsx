import { Box, Typography, Card, CardContent, Divider, Stack } from "@mui/material";
import React from "react";
import { Relation, RelationVisualizationProps } from "../interfaces/interfaces";
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';

const RelationVisualization: React.FC<RelationVisualizationProps> = ({ currentNamespace }) => {
  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Relations
      </Typography>
      {currentNamespace?.relations.map((relation: Relation, index: number) => (
        <Card key={index} variant="outlined" sx={{ marginBottom: 2 }}>
          <CardContent>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography variant="body1" fontWeight="bold">
                {relation.fromTable}.{relation.fromColumn}
              </Typography>
              <ArrowRightAltIcon color="action" />
              <Typography variant="body1" fontWeight="bold">
                {relation.toTable}.{relation.toColumn}
              </Typography>
            </Stack>
          </CardContent>
          {index < currentNamespace.relations.length - 1 && <Divider />}
        </Card>
      ))}
    </Box>
  );
};

export default RelationVisualization;
