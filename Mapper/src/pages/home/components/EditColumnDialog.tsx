// EditColumnDialog.tsx
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  TextField,
} from "@mui/material";
import ChipInput from "./ChipInput";
import { Column } from "../interfaces/interfaces";

interface EditColumnDialogProps {
  open: boolean;
  onClose: () => void;
  selectedColumn: string | null;
  selectedSingleColumn: Column;
  onAddTag: (columnName: string, newTag: string) => void;
  onDeleteTag: (columnName: string, tagToDelete: string) => void;
  handleColumnChange: (columnName: string, field: keyof Column, value: string) => void;
  handleSaveChanges: (columnName: string) => void;
}

const EditColumnDialog: React.FC<EditColumnDialogProps> = ({
  open,
  onClose,
  selectedColumn,
  selectedSingleColumn,
  onAddTag,
  onDeleteTag,
  handleColumnChange,
  handleSaveChanges,
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <Box sx={{ marginBottom: 2 }}>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          Edit Column: {selectedColumn}
        </Typography>
      </Box>

      <DialogContent dividers>
        <Box
          key={selectedSingleColumn.name}
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "repeat(4, 1fr)" },
            gap: 2,
            alignItems: "center",
            marginBottom: 2,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            <strong>Name:</strong> {selectedSingleColumn.name}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            <strong>Type:</strong> {selectedSingleColumn.type}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            <strong>Clustering Order:</strong> {selectedSingleColumn.clusteringOrder}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            <strong>Position:</strong> {selectedSingleColumn.position}
          </Typography>
        </Box>

        {/* Input fields for Note and Tags */}
        <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
          <TextField
            label="Note"
            value={selectedSingleColumn.note}
            onChange={(e) => handleColumnChange(selectedSingleColumn.name, "note", e.target.value)}
            fullWidth
            multiline
            size="small"
            maxRows={1}
            sx={{
              width: "50%",
            }}
          />

          <ChipInput
            chipData={selectedSingleColumn.tag}
            onAddChip={(newTag) => onAddTag(selectedSingleColumn.name, newTag)}
            onDeleteChip={(tag) => onDeleteTag(selectedSingleColumn.name, tag)}
            placeholder="Add a tag"
          />
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="outlined" color="secondary">
          Close
        </Button>

        {/* Save Changes Button */}
        <Button
          onClick={() => handleSaveChanges(selectedSingleColumn.name)}
          variant="contained"
          color="primary"
        >
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditColumnDialog;
