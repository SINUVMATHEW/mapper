import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  Button,
  Typography,
  Box,
  Switch,
  FormControlLabel,
  SelectChangeEvent,
} from "@mui/material";
import { AddRelationPopUpProps, Column } from "../interfaces/interfaces";
import { fetchKeyspaces, fetchTableData, fetchTables } from "../../../services/api/CommonApi";
import axios from "axios";
import { baseUrl } from "../../../services/api/BaseUrl";

const AddRelationPopUp: React.FC<AddRelationPopUpProps> = ({ onClose, onSave }) => {
  const [keyspaces, setKeyspaces] = useState([]);
  const [fromTables, setFromTables] = useState([]);
  const [fromColumns, setFromColumns] = useState([]);
  const [toTables, setToTables] = useState([]);
  const [toColumns, setToColumns] = useState([]);
  const [responseMessage, setResponseMessage] = useState("");
  const [formData, setFormData] = useState({
    from_keyspace: "",
    from_table: "",
    from_column: "",
    to_keyspace: "",
    to_table: "",
    to_column: "",
    is_published: false,
  });

  //  fetch keyspaces
  useEffect(() => {
    const getKeyspaces = async () => {
      try {
        const keyspaces = await fetchKeyspaces();
        setKeyspaces(keyspaces);
        if (keyspaces.length > 0) {
          setFormData((prevFormData) => ({
            ...prevFormData,
            from_keyspace: keyspaces[0],
            to_keyspace: keyspaces[0],
          }));
        }
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };
    getKeyspaces();
  }, []);

  //  fetch from Tables
  useEffect(() => {
    const getFromTableNames = async () => {
      try {
        if (!formData.from_keyspace) return;
        const tables = await fetchTables(formData.from_keyspace);
        setFromTables(tables);
        if (tables.length > 0) {
          setFormData((prevFormData) => ({
            ...prevFormData,
            from_table: tables[0],
          }));
        }
      } catch (error) {
        console.error("Error fetching tables", { keyspace: formData.from_keyspace, error: error });
      }
    };
    getFromTableNames();
  }, [formData.from_keyspace]);

  // fetch from columns
  useEffect(() => {
    const getFromColumns = async () => {
      try {
        const tableData = await fetchTableData(formData.from_keyspace, formData.from_table);
        const columnNames = tableData.data.map((column: Column) => column.column_name);
        setFromColumns(columnNames);
        if (columnNames.length > 0) {
          setFormData((prevFormData) => ({
            ...prevFormData,
            from_column: columnNames[0],
          }));
        }
      } catch (error) {
        console.error("Error fetching table data", {
          keyspace: formData.from_keyspace,
          table: formData.from_table,
          error: error,
        });
        throw new Error(
          `Error fetching tables for table: ${formData.from_keyspace}.${formData.from_table}`
        );
      }
    };
    if (formData.from_keyspace && formData.from_table) {
      getFromColumns();
    }
  }, [formData.from_keyspace, formData.from_table]);

  //  fetch To Tables
  useEffect(() => {
    const getToTableNames = async () => {
      try {
        if (!formData.to_keyspace) return;
        const tables = await fetchTables(formData.to_keyspace);
        setToTables(tables);
        if (tables.length > 0) {
          setFormData((prevFormData) => ({
            ...prevFormData,
            to_table: tables[0],
          }));
        }
      } catch (error) {
        console.error("Error fetching tables", { keyspace: formData.to_keyspace, error: error });
      }
    };
    getToTableNames();
  }, [formData.to_keyspace]);

  // fetch To columns
  useEffect(() => {
    const getToColumns = async () => {
      try {
        const tableData = await fetchTableData(formData.to_keyspace, formData.to_table);
        const columnNames = tableData.data.map((column: Column) => column.column_name);
        setToColumns(columnNames);
        if (columnNames.length > 0) {
          setFormData((prevFormData) => ({
            ...prevFormData,
            to_column: columnNames[0],
          }));
        }
      } catch (error) {
        console.error("Error fetching table data", {
          keyspace: formData.to_keyspace,
          table: formData.to_table,
          error: error,
        });
        throw new Error(
          `Error fetching tables for table: ${formData.to_keyspace}.${formData.to_table}`
        );
      }
    };
    if (formData.to_keyspace && formData.to_table) {
      getToColumns();
    }
  }, [formData.to_keyspace, formData.to_table]);

  // post new relation
  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post(baseUrl + "/save_relation", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 201) {
        const result = response.data;
        onSave(true);
        onClose();
        setResponseMessage(result.message || "Relation saved successfully!");
        setFormData({
          from_keyspace: "",
          from_table: "",
          from_column: "",
          to_keyspace: "",
          to_table: "",
          to_column: "",
          is_published: false,
        });
      } else {
        setResponseMessage(response.data.error || "An error occurred.");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error saving relation:", error.response?.data || error.message);
        setResponseMessage(error.response?.data?.error || "An error occurred.");
      } else {
        console.error("An unexpected error occurred:", error);
        setResponseMessage("An unexpected error occurred.");
      }
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>
  ) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <>
      <Dialog open onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>Add Relation</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", width: "100%" }}>
            <Box sx={{ borderRight: 1, p: 4, borderColor: "#ddd", width: "50%" }}>
              <Typography> From Keyspace</Typography>
              <Select
                fullWidth
                size="small"
                value={formData.from_keyspace}
                type="text"
                name="from_keyspace"
                onChange={handleChange}
              >
                {keyspaces.map((keyspace) => (
                  <MenuItem key={keyspace} value={keyspace}>
                    {keyspace}
                  </MenuItem>
                ))}
              </Select>
              <Typography> From Table</Typography>
              <Select
                fullWidth
                size="small"
                value={formData.from_table}
                name="from_table"
                type="text"
                onChange={handleChange}
              >
                {fromTables.map((fromtable) => (
                  <MenuItem key={fromtable} value={fromtable}>
                    {fromtable}
                  </MenuItem>
                ))}
              </Select>
              <Typography> From Column</Typography>
              <Select
                fullWidth
                size="small"
                type="text"
                name="from_column"
                value={formData.from_column}
                onChange={handleChange}
              >
                {fromColumns.map((fromColumn) => (
                  <MenuItem key={fromColumn} value={fromColumn}>
                    {fromColumn}
                  </MenuItem>
                ))}
              </Select>
            </Box>

            <Box sx={{ p: 4, borderColor: "#ddd", width: "50%" }}>
              <Typography> To Keyspace</Typography>
              <Select
                fullWidth
                size="small"
                type="text"
                name="to_keyspace"
                value={formData.to_keyspace}
                onChange={handleChange}
              >
                {keyspaces.map((keyspace) => (
                  <MenuItem key={keyspace} value={keyspace}>
                    {keyspace}
                  </MenuItem>
                ))}
              </Select>
              <Typography> To Table</Typography>

              <Select
                fullWidth
                size="small"
                type="text"
                name="to_table"
                value={formData.to_table}
                onChange={handleChange}
              >
                {toTables.map((toTable) => (
                  <MenuItem key={toTable} value={toTable}>
                    {toTable}
                  </MenuItem>
                ))}
              </Select>
              <Typography> To Column</Typography>
              <Select
                fullWidth
                size="small"
                value={formData.to_column}
                type="text"
                name="to_column"
                onChange={handleChange}
              >
                {toColumns.map((toColumn: string) => (
                  <MenuItem key={toColumn} value={toColumn}>
                    {toColumn}
                  </MenuItem>
                ))}
              </Select>
              <FormControlLabel
                control={
                  <Switch
                    type="checkbox"
                    name="is_published"
                    inputProps={{ "aria-label": "controlled" }}
                    sx={{ mt: 2 }}
                    checked={formData.is_published}
                    onChange={handleChange}
                  />
                }
                label="Is Published"
              />
              {responseMessage && <p>{responseMessage}</p>}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="inherit">
            Close
          </Button>
          <Button onClick={handleSubmit} color="primary" variant="contained">
            Save changes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AddRelationPopUp;
