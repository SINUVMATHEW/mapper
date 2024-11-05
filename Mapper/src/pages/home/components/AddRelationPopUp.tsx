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
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { AddRelationPopUpProps, DataType, Keyspace } from "../interfaces/interfaces";

const AddRelationPopUp: React.FC<AddRelationPopUpProps> = ({ data, onClose, onSave }) => {
  const [localData, setLocalData] = useState<DataType | null>(null);
  const [fromKeyspace, setFromKeyspace] = useState<Keyspace | undefined>(undefined);
  const [toKeyspace, setToKeyspace] = useState<Keyspace | undefined>(undefined);
  const [fromTable, setFromTable] = useState<string>("");
  const [toTable, setToTable] = useState<string>("");
  const [fromColumn, setFromColumn] = useState<string>("");
  const [toColumn, setToColumn] = useState<string>("");

  useEffect(() => {
    setLocalData(data);
  }, [data]);

  const handleFromKeyspaceChange = (value: string) => {
    const selectedKeyspace = localData?.Keyspaces.find((ns) => ns.name === value);
    setFromKeyspace(selectedKeyspace);
    setFromTable(selectedKeyspace?.tables[0]?.name || "");
    setFromColumn(selectedKeyspace?.tables[0]?.columns[0]?.name || "");
  };

  const handleToKeyspaceChange = (value: string) => {
    const selectedKeyspace = localData?.Keyspaces.find((ns) => ns.name === value);
    setToKeyspace(selectedKeyspace);
    setToTable(selectedKeyspace?.tables[0]?.name || "");
    setToColumn(selectedKeyspace?.tables[0]?.columns[0]?.name || "");
  };

  const handleSave = () => {
    const from = { Keyspace: fromKeyspace?.name, table: fromTable, column: fromColumn };
    const to = { Keyspace: toKeyspace?.name, table: toTable, column: toColumn };
    onSave(from, to);
  };

  return (
    <Dialog open onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Add Relation</DialogTitle>
      <DialogContent>
        <Grid container spacing={4}>
          {/* From */}

          <Grid item xs={6} sx={{ borderRight: 1, p: 4, borderColor: "#ddd" }}>
            <Typography
              sx={{
                display: "flex",
                justifyContent: "center",
                color: "#aa1111",
                pb: 1,
                fontSize: "18px",
              }}
            >
              From{" "}
            </Typography>
            <Typography>Keyspace</Typography>
            <Select
              fullWidth
              value={fromKeyspace?.name || ""}
              onChange={(e) => handleFromKeyspaceChange(e.target.value)}
            >
              {localData?.Keyspaces.map((ns) => (
                <MenuItem key={ns.name} value={ns.name}>
                  {ns.name}
                </MenuItem>
              ))}
            </Select>

            <Typography sx={{ mt: 2 }}>Table</Typography>
            <Select fullWidth value={fromTable} onChange={(e) => setFromTable(e.target.value)}>
              {fromKeyspace?.tables.map((table) => (
                <MenuItem key={table.name} value={table.name}>
                  {table.name}
                </MenuItem>
              ))}
            </Select>
            <Typography sx={{ mt: 2 }}>Column</Typography>
            <Select fullWidth value={fromColumn} onChange={(e) => setFromColumn(e.target.value)}>
              {fromTable
                ? fromKeyspace?.tables
                    .find((t) => t.name === fromTable)
                    ?.columns.map((col) => (
                      <MenuItem key={col.name} value={col.name}>
                        {col.name}
                      </MenuItem>
                    ))
                : null}
            </Select>
          </Grid>

          {/* To */}
          <Grid item xs={6}>
            <Typography
              sx={{
                display: "flex",
                justifyContent: "center",
                color: "#aa1111",
                pb: 1,
                fontSize: "18px",
              }}
            >
              To{" "}
            </Typography>
            <Typography>Keyspace</Typography>
            <Select
              fullWidth
              value={toKeyspace?.name || ""}
              onChange={(e) => handleToKeyspaceChange(e.target.value)}
            >
              {localData?.Keyspaces.map((ns) => (
                <MenuItem key={ns.name} value={ns.name}>
                  {ns.name}
                </MenuItem>
              ))}
            </Select>
            <Typography sx={{ mt: 2 }}>Table</Typography>
            <Select fullWidth value={toTable} onChange={(e) => setToTable(e.target.value)}>
              {toKeyspace?.tables.map((table) => (
                <MenuItem key={table.name} value={table.name}>
                  {table.name}
                </MenuItem>
              ))}
            </Select>
            <Typography sx={{ mt: 2 }}>Column</Typography>
            <Select fullWidth value={toColumn} onChange={(e) => setToColumn(e.target.value)}>
              {toTable
                ? toKeyspace?.tables
                    .find((t) => t.name === toTable)
                    ?.columns.map((col) => (
                      <MenuItem key={col.name} value={col.name}>
                        {col.name}
                      </MenuItem>
                    ))
                : null}
            </Select>
          </Grid>
        </Grid>
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
