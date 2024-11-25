import React, { useEffect, useState } from "react";
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
  const [error, setError] = useState("");

  //  fetch keyspaces
  useEffect(() => {
    const fetchKeyspaces = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/api/keyspace_names");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const jsonData = await response.json();
        setKeyspaces(jsonData);
        if (jsonData.length > 0) {
          const firstKeyspace = jsonData[0];
          setFormData((prevFormData) => ({
            ...prevFormData,
            from_keyspace: firstKeyspace,
            to_keyspace: firstKeyspace,
          }));
        }
      } catch (error) {
        if (error instanceof Error) {
          setError(`Error fetching keyspaces: ${error.message}`);
        } else {
          setError("An unexpected error occurred.");
        }
      }
    };

    fetchKeyspaces();
  }, []);

  //  fetch from Tables
  useEffect(() => {
    const fetchFromTables = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:5000/api/table_names?keyspace_name=${formData.from_keyspace}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const jsonData = await response.json();
        setFromTables(jsonData);
        if (jsonData.length > 0) {
          const firstFromTable = jsonData[0];
          setFormData((prevFormData) => ({
            ...prevFormData,
            from_table: firstFromTable, // Update the specific field
          }));
        }
      } catch (error) {
        if (error instanceof Error) {
          setError(`Error fetching keyspaces: ${error.message}`);
        } else {
          setError("An unexpected error occurred.");
        }
      }
    };
    fetchFromTables();
  }, [formData.from_keyspace]);

  // fetch from columns
  useEffect(() => {
    const fetchFromColumns = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:5000/api/get_columns?keyspace_name=${formData.from_keyspace}&table_name=${formData.from_table}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const jsonData = await response.json();
        const columnNames = jsonData.map((column: Column) => column.column_name);
        setFromColumns(columnNames);
        const firstColumn = fromColumns[0];
        setFormData((prevFormData) => ({
          ...prevFormData,
          from_column: firstColumn,
        }));
      } catch (error) {
        if (error instanceof Error) {
          setError(`Error fetching columns: ${error.message}`);
        } else {
          setError("An unexpected error occurred.");
        }
      }
    };

    if (formData.from_keyspace && formData.from_table) {
      fetchFromColumns();
    }
  }, [formData.from_keyspace, formData.from_table]);

  //  fetch To Tables
  useEffect(() => {
    const fetchToTables = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:5000/api/table_names?keyspace_name=${formData.to_keyspace}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const jsonData = await response.json();
        setToTables(jsonData);
        if (jsonData.length > 0) {
          const firstToTable = jsonData[0];
          setFormData((prevState) => ({
            ...prevState,
            to_table: firstToTable,
          }));
        }
      } catch (error) {
        if (error instanceof Error) {
          setError(`Error fetching keyspaces: ${error.message}`);
        } else {
          setError("An unexpected error occurred.");
        }
      }
    };
    fetchToTables();
  }, [formData.to_keyspace]);

  // fetch To columns
  useEffect(() => {
    const fetchToColumns = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:5000/api/get_columns?keyspace_name=${formData.to_keyspace}&table_name=${formData.to_table}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const jsonData = await response.json();
        const columnNames = jsonData.map((column: Column) => column.column_name);
        setToColumns(columnNames);
        const firstColumn = toColumns[0];
        setFormData((prevState) => ({
          ...prevState,
          to_column: firstColumn,
        }));
      } catch (error) {
        if (error instanceof Error) {
          setError(`Error fetching columns: ${error.message}`);
        } else {
          setError("An unexpected error occurred.");
        }
      }
    };

    if (formData.to_keyspace && formData.to_table) {
      fetchToColumns();
    }
  }, [formData.to_keyspace, formData.to_table]);

  console.log(error);

  const handleSubmit = async (e:React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      const response = await fetch("http://127.0.0.1:5000/api/save_relation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
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
        const error = await response.json();
        setResponseMessage(error.error || "An error occurred.");
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(`Error fetching keyspaces: ${error.message}`);
      } else {
        setError("An unexpected error occurred.");
      }
    }
  };

  // const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setPublished(event.target.checked);
  // };
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
