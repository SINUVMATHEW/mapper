import React, { useState, useEffect } from "react";
import { Table, Column, TableEditFormProps, Params } from "../interfaces/interfaces";
import {
  TextField,
  Typography,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogActions,
} from "@mui/material";
import Chip from "@mui/material/Chip";
import ChipInput from "./ChipInput";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { columns, paginationModel } from "../constants/constants";

const TableEditForm: React.FC<TableEditFormProps> = ({ tableData, onSubmit }) => {
  const [formData, setFormData] = useState(tableData);
  const [chipData, setChipData] = useState<string[]>(formData.tag);
  const [tagInput, setTagInput] = useState("");
  const [editColumnData, setEditColumnData] = useState<Column | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setFormData(tableData);
  }, [tableData]);

  // Table Note handling
  const handleTableNoteChange = (field: keyof Table, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  // Table Tag handling
  const handleAddtableTag = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && tagInput.trim()) {
      setChipData((prevChips) => [...prevChips, tagInput.trim()]);
      setTagInput("");
      event.preventDefault();
    }
  };

  const handleDeletetableTag = (chipToDelete: string) => () => {
    setChipData((chips) => chips.filter((chip) => chip !== chipToDelete));
  };

  // Open dialog on row click
  const handleRowClick = (params: Params) => {
    const matchedColumn = formData.columns.find((column) => column.name === params.row.name);
    if (matchedColumn) {
      setEditColumnData({ ...matchedColumn });
      setOpen(true);
    }
  };

  // Column tag handling
  const handleAddTag = (newTag: string) => {
    if (editColumnData) {
      setEditColumnData((prevData) => ({
        ...prevData!,
        tag: [...prevData!.tag, newTag],
      }));
    }
  };

  const handleDeleteTag = (tagToDelete: string) => {
    if (editColumnData) {
      setEditColumnData((prevData) => ({
        ...prevData!,
        tag: prevData!.tag.filter((tag) => tag !== tagToDelete),
      }));
    }
  };

  // Edit Column field handling
  const handleColumnChange = (field: keyof Column, value: string) => {
    if (editColumnData) {
      setEditColumnData((prevData) => ({
        ...prevData!,
        [field]: value,
      }));
    }
  };

  // Close dialog and clear local state
  const handleClose = () => {
    setOpen(false);
    setEditColumnData(null);
  };

  // Save edited column back to formData
  const handleSaveChanges = () => {
    if (editColumnData) {
      setFormData((prevData) => ({
        ...prevData,
        columns: prevData.columns.map((col) =>
          col.name === editColumnData.name ? editColumnData : col
        ),
      }));
    }
    handleClose();
  };

  return (
    <>
      {/* edit form for table note and tag */}
      <Box
        component="form"
        onSubmit={(e) => e.preventDefault()}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1,
          border: 1,
          borderRadius: 2,
          padding: 1,
        }}
      >
        <Typography align="center" color="#2b2b2b" sx={{ marginBottom: 1, fontSize: "18px" }}>
          Edit : {formData.name}
        </Typography>

        <Box
          sx={{
            display: "flex",
            gap: 1,
            justifyContent: "space-between",
            width: "100%",
            alignItems: "center",
            height: "40px",
          }}
        >
          <TextField
            label="Table Note"
            value={formData.note}
            onChange={(e) => handleTableNoteChange("note", e.target.value)}
            fullWidth
            multiline
            size="small"
            maxRows={1}
            sx={{ width: "50%" }}
          />

          {/* Edit table tag  */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              flexWrap: "wrap",
              padding: "0 5px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              flex: "1 1 35%",
              maxHeight: 100,
              height: "40px",
              overflowY: "auto",
            }}
          >
            {chipData.map((data, index) => (
              <Chip
                key={index}
                label={data}
                onDelete={handleDeletetableTag(data)}
                size="small"
                sx={{ margin: "2px" }}
              />
            ))}
            <TextField
              variant="standard"
              placeholder="Add new tag"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddtableTag}
              size="small"
              InputProps={{ disableUnderline: true }}
              sx={{
                minWidth: "80px",
                "& .MuiInputBase-input": { marginLeft: "4px", padding: "0", width: "100%" },
              }}
            />
          </Box>

          <Button variant="contained" color="primary" onClick={() => onSubmit(formData)}>
            Save
          </Button>
        </Box>

        {/* column display table */}
        <Paper sx={{ height: 400, width: "100%" }}>
          <DataGrid
            getRowId={(row) => row.name}
            rows={formData.columns}
            columns={columns}
            initialState={{ pagination: { paginationModel } }}
            pageSizeOptions={[5, 10, 20]}
            sx={{ border: 0 }}
            onRowClick={handleRowClick}
          />
        </Paper>

        {/* column note and tag edit dialog  */}
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
          <DialogContent dividers>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Edit Column: {editColumnData?.name}
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
              <TextField
                label="Note"
                value={editColumnData?.note || ""}
                onChange={(e) => handleColumnChange("note", e.target.value)}
                fullWidth
                multiline
                size="small"
                maxRows={1}
                sx={{ width: "50%" }}
              />
              <ChipInput
                chipData={editColumnData?.tag || []}
                onAddChip={handleAddTag}
                onDeleteChip={handleDeleteTag}
                placeholder="Add a tag"
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} variant="outlined" color="secondary">
              Close
            </Button>
            <Button onClick={handleSaveChanges} variant="contained" color="primary">
              Save Changes
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
};

export default TableEditForm;
