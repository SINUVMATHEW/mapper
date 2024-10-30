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
import { AddRelationPopUpProps, DataType, Namespace } from "../interfaces/interfaces";

const AddRelationPopUp: React.FC<AddRelationPopUpProps> = ({ data, onClose, onSave }) => {
  const [localData, setLocalData] = useState<DataType | null>(null);
  const [fromNamespace, setFromNamespace] = useState<Namespace | undefined>(undefined);
  const [toNamespace, setToNamespace] = useState<Namespace | undefined>(undefined);
  const [fromTable, setFromTable] = useState<string>("");
  const [toTable, setToTable] = useState<string>("");
  const [fromColumn, setFromColumn] = useState<string>("");
  const [toColumn, setToColumn] = useState<string>("");

  useEffect(() => {
    setLocalData(data);
  }, [data]);

  const handleFromNamespaceChange = (value: string) => {
    const selectedNamespace = localData?.namespaces.find((ns) => ns.name === value);
    setFromNamespace(selectedNamespace);
    setFromTable(selectedNamespace?.tables[0]?.name || "");
    setFromColumn(selectedNamespace?.tables[0]?.columns[0]?.name || "");
  };

  const handleToNamespaceChange = (value: string) => {
    const selectedNamespace = localData?.namespaces.find((ns) => ns.name === value);
    setToNamespace(selectedNamespace);
    setToTable(selectedNamespace?.tables[0]?.name || "");
    setToColumn(selectedNamespace?.tables[0]?.columns[0]?.name || "");
  };

  const handleSave = () => {
    const from = { namespace: fromNamespace?.name, table: fromTable, column: fromColumn };
    const to = { namespace: toNamespace?.name, table: toTable, column: toColumn };
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
            <Typography>Name Space</Typography>
            <Select
              fullWidth
              value={fromNamespace?.name || ""}
              onChange={(e) => handleFromNamespaceChange(e.target.value)}
            >
              {localData?.namespaces.map((ns) => (
                <MenuItem key={ns.name} value={ns.name}>
                  {ns.name}
                </MenuItem>
              ))}
            </Select>

            <Typography sx={{ mt: 2 }}>Table</Typography>
            <Select fullWidth value={fromTable} onChange={(e) => setFromTable(e.target.value)}>
              {fromNamespace?.tables.map((table) => (
                <MenuItem key={table.name} value={table.name}>
                  {table.name}
                </MenuItem>
              ))}
            </Select>
            <Typography sx={{ mt: 2 }}>Column</Typography>
            <Select fullWidth value={fromColumn} onChange={(e) => setFromColumn(e.target.value)}>
              {fromTable
                ? fromNamespace?.tables
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
            <Typography>Name Space</Typography>
            <Select
              fullWidth
              value={toNamespace?.name || ""}
              onChange={(e) => handleToNamespaceChange(e.target.value)}
            >
              {localData?.namespaces.map((ns) => (
                <MenuItem key={ns.name} value={ns.name}>
                  {ns.name}
                </MenuItem>
              ))}
            </Select>
            <Typography sx={{ mt: 2 }}>Table</Typography>
            <Select fullWidth value={toTable} onChange={(e) => setToTable(e.target.value)}>
              {toNamespace?.tables.map((table) => (
                <MenuItem key={table.name} value={table.name}>
                  {table.name}
                </MenuItem>
              ))}
            </Select>
            <Typography sx={{ mt: 2 }}>Column</Typography>
            <Select fullWidth value={toColumn} onChange={(e) => setToColumn(e.target.value)}>
              {toTable
                ? toNamespace?.tables
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
