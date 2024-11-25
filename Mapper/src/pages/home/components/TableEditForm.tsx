import React, { useState, useEffect } from "react";
import {
  TextField,
  Typography,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  SnackbarCloseReason,
} from "@mui/material";
import Chip from "@mui/material/Chip";
import { DataGrid, GridRowParams } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { Column, FormDataProps, TableEditFormProps } from "../interfaces/interfaces";
import { columns as dataGridColumns } from "../constants/constants";
import axios from "axios";
import { Refresh } from "@mui/icons-material";
const TableEditForm: React.FC<TableEditFormProps> = ({ keyspace, table, onSubmit }) => {
  const [formData, setFormData] = useState<FormDataProps>({
    name: table || "",
    note: "",
    tag: ["new"],
    columns: [],
  });
  const [tableTags, setTableTags] = useState(["existing tag1", "existing tag2"]); //lookup
  const [tableTagInput, setTableTagInput] = useState("");
  const [columnTagInput, setColumnTagInput] = useState("");
  const [editColumnData, setEditColumnData] = useState<Column | null>();
  const [columnTags, setColumnTags] = useState(editColumnData?.tag);
  const [open, setOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

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
          note: col.note || "no note", // Fallback for null or undefined
          tag: col.tag || "no tags",
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

  useEffect(() => {
    fetchColumns();
  }, [keyspace, table, tableTags]);

  // useEffect(() => {
  //   const tags =
  //     typeof editColumnData?.tag === "string" ? tryParseJSON(editColumnData?.tag) : editColumnData?.tag || ["assa"];

  //   setColumnTags(tags);
  // }, [editColumnData]);

  // // Helper function to safely parse a JSON string
  // function tryParseJSON(str: string) {
  //   try {
  //     return JSON.parse(str);
  //   } catch (e) {
  //     return [];
  //   }
  // }

  

  const handleSnackbarClose = (
    event: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason,
  ) => {
    if (reason === 'clickaway') {
      return;
    }

    setSnackbarOpen(false);
  };

  // Handle table note change
  const handleTableNoteChange = (value: string) => {
    setFormData((prev) => ({ ...prev, note: value }));
  };

  // Handle table tags
  const handleAddTableTag = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && tableTagInput.trim()) {
      setTableTags((prev) => [...prev, tableTagInput.trim()]);
      setTableTagInput("");
      event.preventDefault();
    }
  };
  const handleDeleteTableTag = (chipToDelete: string) => {
    setTableTags((chips) => chips.filter((chip) => chip !== chipToDelete));
  };
  // Open dialog for editing column ///old was Params data type
  const handleRowClick = (params: GridRowParams) => {
    const matchedColumn = formData.columns.find(
      (column) => column.column_name === params.row.column_name
    );
    if (matchedColumn) {
      setEditColumnData({ ...matchedColumn });
      setOpen(true);
    } else {
      console.error("No matching column found.");
    }
  };

  console.log("col tag is ", columnTags);
  console.log("col tag sourse ", editColumnData?.tag);
  console.log("col tag is ", typeof columnTags);
  console.log("table tag is ", typeof tableTags);

  // Column tag handling
  // const handleAddColumnTag = (newTag: string) => {
  //   if (editColumnData) {
  //     setEditColumnData((prevData) => ({
  //       ...prevData!,
  //       tag: [...prevData!.tag, newTag],
  //     }));
  //   }
  // };
  
  const handleAddColumnTag = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && columnTagInput.trim()) {
      setColumnTags((prev) => [...prev, columnTagInput.trim()]);
      setColumnTagInput("");
      event.preventDefault();
    }
  };

  const handleDeleteColumnTag = (tagToDelete: string) => {
    setColumnTags((prev) => prev.filter((chip) => chip !== tagToDelete));
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
  const handleSaveChanges = async () => {
    const sendData = {
      keyspace_name: keyspace,
      table_name: table,
      column_name: editColumnData?.column_name,
      tag: editColumnData?.tag || [],
      note: editColumnData?.note,
    };

    try {
      const response = await axios.post("http://127.0.0.1:5000/api/update_column_tag", sendData);
      console.log(response.data);
      handleClose();
       // Close the dialog after saving
      fetchColumns();
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error updating column:", error);
    }
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
    <>
      <Snackbar
        open={snackbarOpen}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        autoHideDuration={5000}
        onClose={handleSnackbarClose}
      >
        <Alert severity="success" variant="filled" sx={{ width: "100%" }}>
          Column Updated Successfully!
        </Alert>
      </Snackbar>
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
              value={tableTagInput}
              onChange={(e) => setTableTagInput(e.target.value)}
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

                <TextField
                  label="Column tag"
                  value={editColumnData.tag}
                  onChange={(e) => handleColumnChange("tag", e.target.value)}
                  fullWidth
                  multiline
                  size="small"
                  maxRows={1}
                  sx={{ width: "50%" }}
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
    </>
  );
};

export default TableEditForm;

{
  /* <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flexWrap: "wrap",
                  padding: "1px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  width: "60%",
                }}
              >
                <Typography>{columnTags}</Typography>

                {columnTags.map((tag, index) => (
                    <Chip
                      key={index}
                      label={tag}
                      onDelete={() => handleDeleteColumnTag(tag)}
                      size="small"
                      sx={{ margin: "2px" }}
                    />
                  ))}

                <TextField
                  variant="standard"
                  placeholder="add new tag"
                  value={columnTagInput}
                  onChange={(e) => setColumnTagInput(e.target.value)}
                  onKeyDown={handleAddColumnTag}
                  size="small"
                  InputProps={{
                    disableUnderline: true,
                    style: { marginLeft: "4px", flexGrow: 1 },
                  }}
                  sx={{
                    minWidth: "80px",
                    "& .MuiInputBase-input": {
                      marginLeft: "4px",
                      flexGrow: 1,
                      padding: "0",
                    },
                  }}
                />
              </Box> */
}
