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
} from "@mui/material";
import { AddRelationPopUpProps, Column } from "../interfaces/interfaces";

const AddRelationPopUp: React.FC<AddRelationPopUpProps> = ({ onClose, onSave }) => {
  const [keyspaces, setKeyspaces] = useState([]);

  const [fromKeyspace, setFromKeyspace] = useState("");
  const [fromTables, setFromTables] = useState([]);
  const [fromTable, setFromTable] = useState<string>("");
  const [fromColumns, setFromColumns] = useState([]);
  const [fromColumn, setFromColumn] = useState<string>("");

  const [toKeyspace, setToKeyspace] = useState("");
  const [toTables, setToTables] = useState([]);
  const [toTable, setToTable] = useState<string>("");
  const [toColumns, setToColumns] = useState([]);
  const [toColumn, setToColumn] = useState<string>("");

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
          setFromKeyspace(firstKeyspace);
          setToKeyspace(firstKeyspace);
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
          `http://127.0.0.1:5000/api/table_names?keyspace_name=${fromKeyspace}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const jsonData = await response.json();
        setFromTables(jsonData);
        if (jsonData.length > 0) {
          const firstFromTable = jsonData[0];
          setFromTable(firstFromTable);
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
  }, [fromKeyspace]);

  // fetch from columns
  useEffect(() => {
    const fetchFromColumns = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:5000/api/get_columns?keyspace_name=${fromKeyspace}&table_name=${fromTable}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const jsonData = await response.json();
        const columnNames = jsonData.map((column: Column) => column.column_name);
        setFromColumns(columnNames);
        const firstColumn = fromColumns[0];
        setFromColumn(firstColumn);
      } catch (error) {
        if (error instanceof Error) {
          setError(`Error fetching columns: ${error.message}`);
        } else {
          setError("An unexpected error occurred.");
        }
      }
    };

    if (fromKeyspace && fromTable) {
      fetchFromColumns();
    }
  }, [fromKeyspace, fromTable, fromColumns]);

  //  fetch To Tables
  useEffect(() => {
    const fetchToTables = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:5000/api/table_names?keyspace_name=${toKeyspace}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const jsonData = await response.json();
        setToTables(jsonData);
        if (jsonData.length > 0) {
          const firstFromTable = jsonData[0];
          setToTable(firstFromTable);
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
  }, [toKeyspace]);

  // fetch To columns
  useEffect(() => {
    const fetchToColumns = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:5000/api/get_columns?keyspace_name=${toKeyspace}&table_name=${toTable}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const jsonData = await response.json();
        const columnNames = jsonData.map((column: Column) => column.column_name);
        setToColumns(columnNames);
        const firstColumn = toColumns[0];
        setToColumn(firstColumn);
      } catch (error) {
        if (error instanceof Error) {
          setError(`Error fetching columns: ${error.message}`);
        } else {
          setError("An unexpected error occurred.");
        }
      }
    };

    if (toKeyspace && toTable) {
      fetchToColumns();
    }
  }, [toKeyspace, toTable, toColumns]);

  console.log(error);

  const handleSave = () => {
    const from = { Keyspace: fromKeyspace, table: fromTable, column: fromColumn };
    const to = { Keyspace: toKeyspace, table: toTable, column: toColumn };
    onSave(from, to);
  };

  return (
    <Dialog open onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Add Relation</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", width: "100%" }}>
          <Box sx={{ borderRight: 1, p: 4, borderColor: "#ddd", width: "50%" }}>
            <Typography> From Keyspace</Typography>
            <Select
              fullWidth
              size="small"
              value={fromKeyspace}
              onChange={(e) => setFromKeyspace(e.target.value)}
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
              value={fromTable}
              onChange={(e) => setFromTable(e.target.value)}
            >
              {fromTables.map((fromtabtle) => (
                <MenuItem key={fromtabtle} value={fromtabtle}>
                  {fromtabtle}
                </MenuItem>
              ))}
            </Select>
            <Typography> From Column</Typography>
            <Select
              fullWidth
              size="small"
              value={fromColumn}
              onChange={(e) => setFromColumn(e.target.value)}
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
              value={toKeyspace}
              onChange={(e) => setToKeyspace(e.target.value)}
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
              value={toTable}
              onChange={(e) => setToTable(e.target.value)}
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
              value={toColumn}
              onChange={(e) => setToColumn(e.target.value)}
            >
              {toColumns.map((toColumn: string) => (
                <MenuItem key={toColumn} value={toColumn}>
                  {toColumn}
                </MenuItem>
              ))}
            </Select>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Close
        </Button>
        <Button onClick={handleSave} color="primary" variant="contained">
          Save changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddRelationPopUp;
