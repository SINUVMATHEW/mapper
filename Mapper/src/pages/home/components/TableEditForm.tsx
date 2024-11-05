import React, { useState, useEffect } from "react";
import { Table, Column, TableEditFormProps } from "../interfaces/interfaces";
import { TextField, Typography, Box, Button } from "@mui/material";
import Chip from "@mui/material/Chip";
import ChipInput from "./ChipInput";

const TableEditForm: React.FC<TableEditFormProps> = ({ tableData, onSubmit }) => {
  const [formData, setFormData] = useState(tableData);
  const [chipData, setChipData] = React.useState<string[]>([]);
  const [tagInput, setTagInput] = React.useState("");

  useEffect(() => {
    setFormData(tableData);
  }, [tableData]);

  const handleTableFieldChange = (field: keyof Table, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleAddTag = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && tagInput.trim()) {
      setChipData((prevChips) => [...prevChips, tagInput.trim()]);
      setTagInput("");
      event.preventDefault();
    }
  };

  const handleDelete = (chipToDelete: string) => () => {
    setChipData((chips) => chips.filter((chip) => chip !== chipToDelete));
  };
  const handleAddChip = (chip: string) => {
    setChipData((prevChips) => [...prevChips, chip]);
  };

  const handleDeleteChip = (chip: string) => {
    setChipData((prevChips) => prevChips.filter((c) => c !== chip));
  };

  const handleColumnChange = (index: number, field: keyof Column, value: string) => {
    const updatedColumns = formData.columns.map((col, i) =>
      i === index ? { ...col, [field]: value } : col
    );
    setFormData({ ...formData, columns: updatedColumns });
  };

  const handleSubmit = () => {
    onSubmit(formData);
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
      <Typography variant="h6" align="center" color="#2b2b2b" sx={{ marginBottom: 1 }}>
        Edit {formData.name}
      </Typography>

      <Box
        sx={{
          display: "flex",
          gap: 1,
          justifyContent: "space-between",
          flexWrap: "wrap",
        }}>
        <TextField
          label="Table Note"
          value={formData.note}
          onChange={(e) => handleTableFieldChange("note", e.target.value)}
          fullWidth
          size="small"
          sx={{ flex: "4 1" }}
        />
         <Box>
      <ChipInput
        chipData={chipData}
        onAddChip={handleAddChip}
        onDeleteChip={handleDeleteChip}
        placeholder="Add new tag"
      />
    </Box>
        
        {/* <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            padding: "px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            flex: "1 1 35%",
          }}
        >
          {chipData.map((data, index) => (
            <Chip
              key={index}
              label={data}
              onDelete={handleDelete(data)}
              size="small"
              sx={{ margin: "2px" }}
            />
          ))}
          <TextField
            variant="standard"
            placeholder="Add new tag"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleAddTag}
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
        </Box> */}
      </Box>

      <Box sx={{ display: "flex", gap: 1, alignItems: "center", flexWrap: "wrap" }}>
        <Typography color="grey">Primary Keys:</Typography>
        {tableData?.primaryKeys.map((key: string, idx) => (
          <Typography
            key={idx}
            component="span"
            sx={{ fontSize: "0.875rem", color: "text.secondary" }}
          >
            {key}
          </Typography>
        ))}
      </Box>

      <Typography color="grey" sx={{ marginBottom: 1 }}>
        Columns:
      </Typography>
      {formData.columns.map((column, index) => (
        <Box
          key={column.tag}
          sx={{
            display: "grid",
            gridTemplateColumns: "0.5fr 0.5fr 0.5fr 0.5fr 1fr 1fr",
            gap: 1,
            marginBottom: 1,
            padding:0,
          }}
        >
          <Typography variant="body2" color="text.secondary" sx={{ alignSelf: "center" }}>
            {`Name: ${column.name}`}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ alignSelf: "center" }}>
            {`Type: ${column.type}`}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ alignSelf: "center" }}>
            {`Clustering order: ${column.clusteringOrder}`}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ alignSelf: "center" }}>
            {`Position: ${column.position}`}
          </Typography>
          <TextField
            label="Note"
            value={column.note}
            onChange={(e) => handleColumnChange(index, "note", e.target.value)}
            fullWidth
            size="small"
          />
          <TextField
            label="Tag"
            value={column.tag}
            onChange={(e) => handleColumnChange(index, "tag", e.target.value)}
            fullWidth
            size="small"
          />
        </Box>
      ))}

      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        sx={{ alignSelf: "flex-end", marginTop: 2 }}
      >
        Save Changes
      </Button>
    </Box>
  );
};

export default TableEditForm;
