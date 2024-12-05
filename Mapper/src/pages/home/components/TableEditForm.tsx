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
import { Column, FormDataProps, tableDescriptionFormpProps, TableEditFormProps } from "../interfaces/interfaces";
import { columns as dataGridColumns } from "../constants/constants";
import axios from "axios";
import { fetchTableData } from "../../../services/api/CommonApi";
import { baseUrl } from "../../../services/api/BaseUrl";
const TableEditForm: React.FC<TableEditFormProps> = ({ keyspace, table }) => {
  const [formData, setFormData] = useState<FormDataProps>({
    name: table || "",
    note: "",
    tag: ["new"],
    columns: [],
  });
  
  const [tableTags, setTableTags] = useState([" "]);
  const [tableTagInput, setTableTagInput] = useState("");
  const [editColumnData, setEditColumnData] = useState<Column | null>();
  const [open, setOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [tableDescriptionForm, setTableDescriptionForm] = useState<tableDescriptionFormpProps>({
    keyspace_name: keyspace,
    table_name: table,
    note: "default note ",
    tags: "default ",
  });

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
      const tableData = await fetchTableData(keyspace, table);
      const transformedColumns = tableData.data.map((col: Column) => ({
        column_name: col.column_name,
        type: col.type,
        clustering_order: col.clustering_order,
        kind: col.kind,
        position: col.position,
        note: col.note || "no note",
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

  useEffect(() => {
    const fetchTableDescription = async () => {
      try {
        const response = await axios.get(baseUrl+"/get_table_description", {
          params: {
            keyspace_name: keyspace,
            table_name: table,
          },
        });

        if (response.data) {
          setTableDescriptionForm((prev) => ({
            ...prev,
            keyspace_name: response.data.keyspace_name,
            table_name: response.data.table_name,
            note: response.data.note,
            tags: response.data.tag,
          }));
          setTableTags(tableDescriptionForm.tags.split(",").map((tag) => tag.trim()));
        }
      } catch (error) {
        console.error("Error fetching table description:", error);
      }
    };

    fetchTableDescription();
  }, [keyspace, table, tableDescriptionForm.tags]);

  const handleSnackbarClose = (
    _event: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackbarOpen(false);
  };

  // Handle table note change
  const handleTableNoteChange = (value: string) => {
    setTableDescriptionForm((prev) => ({ ...prev, note: value }));
  };

  const handleTableDescriptionSave = async () => {
    //form copy for synchronous operation
    const updatedForm = {
      ...tableDescriptionForm,
      tags: String(tableTags),
      table_name: table,
    };
    try {
      const response = await axios.put(baseUrl+"/update_table_description", {
        keyspace_name: updatedForm.keyspace_name,
        table_name: updatedForm.table_name,
        tag: updatedForm.tags,
        note: updatedForm.note,
      });

      console.log(response.data);
      setAlertMessage("Table description updated successfully!");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error updating table description:", error);
      setAlertMessage("Table description update failed!");
      setSnackbarOpen(true);
    }
    setTableDescriptionForm(updatedForm);
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
      const response = await axios.put(baseUrl+"/update_column_tag", sendData);
      console.log(response.data);
      handleClose();
      fetchColumns();
      setAlertMessage("Column Updated Successfully!");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error updating column:", error);
    }
  };

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
          {alertMessage}
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
            value={tableDescriptionForm.note}
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
          <Button variant="contained" color="primary" onClick={handleTableDescriptionSave}>
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
