import React, { useState, useEffect } from "react";
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
import { DataGrid, GridRowParams } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { Column, FormDataProps, TableEditFormProps } from "../interfaces/interfaces";
import { columns as dataGridColumns } from "../constants/constants";
import ChipInput from "./ChipInput";

const TableEditForm: React.FC<TableEditFormProps> = ({ keyspace, table, onSubmit }) => {
  const [formData, setFormData] = useState<FormDataProps>({
    name: table || "",
    note: "",
    tag: ["new"],
    columns: [],
  });
  const [tableTags, setTableTags] = useState(["existing tag1", "existing tag2"]); //lookup
  const [tagInput, setTagInput] = useState("");
  const [editColumnData, setEditColumnData] = useState<Column | null>();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchColumns = async () => {
      try {
        if (!table) {
          setFormData({
            name: "",
            note: "",
            tag: [],
            columns: [],
          });
          return;
        }
        const response = await fetch(
          `http://127.0.0.1:5000/api/get_columns?keyspace_name=${keyspace}&table_name=${table}`
        );
        if (!response.ok) {
          throw new Error(`Error fetching columns: ${response.statusText}`);
        }
        const data = await response.json();
        //transforming for recieving note and tag
        const transformedColumns = data.map((col: Column) => ({
          column_name: col.column_name,
          type: col.type,
          clustering_order: col.clustering_order,
          kind: col.kind,
          position: col.position,
          note: col.note || "no notes",
          tag: col.tag || ["new"],
        }));
        setFormData({
          name: table || "no table name",
          note: " no table note",
          tag: tableTags,
          columns: transformedColumns,
        });
      } catch (error) {
        console.error("Error fetching columns:", error);
      }
    };

    fetchColumns();
  }, [keyspace, table, tableTags]);

  // Handle table note change
  const handleTableNoteChange = (value: string) => {
    setFormData((prev) => ({ ...prev, note: value }));
  };

  // Handle table tags
  const handleAddTableTag = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && tagInput.trim()) {
      setTableTags((prev) => [...prev, tagInput.trim()]);
      setTagInput("");
      event.preventDefault();
    }
  };
  const handleDeleteTableTag = (chipToDelete: string) => {
    setTableTags((chips) => chips.filter((chip) => chip !== chipToDelete));
  };

  // Open dialog for editing column ///old was Params data type
  const handleRowClick = (params: GridRowParams) => {
    console.log("Clicked row:", params.row);

    const matchedColumn = formData.columns.find(
      (column) => column.column_name === params.row.column_name
    );

    if (matchedColumn) {
      console.log("Matched column:", matchedColumn);
      setEditColumnData({ ...matchedColumn });
      setOpen(true);
    } else {
      console.error("No matching column found.");
    }
  };

  // Column tag handling
  const handleAddColumnTag = (newTag: string) => {
    if (editColumnData) {
      setEditColumnData((prevData) => ({
        ...prevData!,
        tag: [...prevData!.tag, newTag],
      }));
    }
  };

  const handleDeleteColumnTag = (tagToDelete: string) => {
    if (editColumnData) {
      setEditColumnData((prevData) => ({
        ...prevData!,
        tag: prevData!.tag.filter((tag) => tag !== tagToDelete),
      }));
    }
  };

  // Edit column field handling
  const handleColumnChange = (field: keyof Column, value: string) => {
    if (editColumnData) {
      setEditColumnData((prevData) => ({
        ...prevData!,
        [field]: value,
      }));
    }
  };

  // Save edited column back to formData
  const handleSaveChanges = () => {
    console.log("handle save fun", editColumnData);
    if (editColumnData) {
      setFormData((prevData) => ({
        ...prevData,
        columns: prevData.columns.map((col) =>
          col.column_name === editColumnData.column_name ? editColumnData : col
        ),
      }));
    }
    handleClose();
    console.log("handle save fun", editColumnData);
  };
  //generating unique IDs for each columns
  // const rowsWithId = formData.columns.map((column, index) => ({
  //   ...column,
  //   id: `${column.column_name}-${index}`,
  // }));

  // Close dialog
  const handleClose = () => {
    setOpen(false);
    setEditColumnData(null);
  };

  return (
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
        Edit Table: {formData.name}
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
          onChange={(e) => handleTableNoteChange(e.target.value)}
          fullWidth
          multiline
          size="small"
          maxRows={1}
          sx={{ width: "50%" }}
        />
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
          {tableTags.map((tag, index) => (
            <Chip
              key={index}
              label={tag}
              onDelete={() => handleDeleteTableTag(tag)}
              size="small"
              sx={{ margin: "2px" }}
            />
          ))}
          <TextField
            variant="standard"
            placeholder="Add new tag"
            size="small"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleAddTableTag}
            InputProps={{ disableUnderline: true }}
            sx={{
              minWidth: "80px",
              "& .MuiInputBase-input": { marginLeft: "4px", padding: "0", width: "100%" },
            }}
          />
        </Box>
        <Button
          variant="contained"
          color="primary"
          onClick={() => onSubmit({ ...formData, tag: tableTags })}
        >
          Save
        </Button>
      </Box>

      <Paper sx={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={formData.columns}
          columns={dataGridColumns}
          getRowId={(row) => row.column_name}
          pageSizeOptions={[5, 10, 20]}
          pagination
          initialState={{
            pagination: {
              paginationModel: { pageSize: 5, page: 0 },
            },
          }}
          onRowClick={handleRowClick}
        />
      </Paper>

      {/* Dialog for editing column */}
      {editColumnData && (
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
          <DialogContent>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Edit Column: {editColumnData.column_name}
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
              {/* Add Input for column Notes */}
              <TextField
                label="Column Note"
                value={editColumnData.note}
                onChange={(e) => handleColumnChange("note", e.target.value)}
                fullWidth
                multiline
                size="small"
                maxRows={1}
                sx={{ width: "50%" }}
              />
              {/* Add ChipInput for column tags */}
              <ChipInput
                chipData={editColumnData?.tag || []}
                onAddChip={handleAddColumnTag}
                onDeleteChip={handleDeleteColumnTag}
                placeholder="Add a tag"
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleSaveChanges}>Save</Button>
            <Button onClick={handleClose}>Cancel</Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};

export default TableEditForm;
