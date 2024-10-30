import React, { useState, useEffect } from "react";
import { Table, Column, TableEditFormProps } from "../interfaces/interfaces";
import { TextField, Typography, Box, Button } from "@mui/material";

const TableEditForm: React.FC<TableEditFormProps> = ({ tableData, onSubmit }) => {
  const [formData, setFormData] = useState(tableData);

  useEffect(() => {
    setFormData(tableData);
  }, [tableData]);

  const handleTableFieldChange = (field: keyof Table, value: string) => {
    setFormData({ ...formData, [field]: value });
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
        gap: 3,
        border: 2,
        borderRadius: 2,
        padding: 3,
      }}
    >
      <Typography sx={{ display: "flex", justifyContent: "center", fontSize: '20px' }} color="#2b2b2b">
        Edit {formData.name}
      </Typography>
      <Box style={{
      borderBottom: '1px solid rgba(0, 0, 0, 0.3)', 
      width: '100%',
      marginBottom: '20px'
    }} />

      <Box sx={{ display: "flex", gap: 2, justifyContent: "space-between" }}>
        <TextField
          label="Table Note"
          value={formData.note}
          onChange={(e) => handleTableFieldChange("note", e.target.value)}
          fullWidth
        />
        <TextField
          label="Table Tag"
          value={formData.tag}
          onChange={(e) => handleTableFieldChange("tag", e.target.value)}
          fullWidth
        />
      </Box>
      <Box sx={{ display: "flex",justifyContent:"flex-start",alignItems:"center" }}>
        <Typography color="grey">Primary Keys : </Typography>
        {tableData?.primaryKeys.map((key: string) => (
          <ul>{key}</ul>
        ))}
      </Box>

      <Typography color="grey">Column : </Typography>
      {formData.columns.map((column, index) => (
        <Box
          key={column.tag}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
            paddingBottom: 0,
            marginBottom: 0,
          }}
        >
          {/* <Typography variant="subtitle1" gutterBottom>{`Edit Column: ${column.name}`}</Typography> */}
          <Box sx={{ display: "flex", gap: 2, justifyContent: "space-between" }}>
            {/* <TextField
            label="Column Name"
            value={column.name}
            sx={{ width: "20%" }}
            fullWidth
          /> */}
            <Typography sx={{ width: "15%" }}> {`Column Name : ${column.name}`}</Typography>

            {/* <TextField
            label="Type"
            value={column.name}
            sx={{ width: "20%" }}
            fullWidth
          /> */}
            <Typography sx={{ width: "15%" }}> {`Type : ${column.type}`}</Typography>
            <TextField
              label="Note"
              value={column.note}
              sx={{ width: "30%" }}
              onChange={(e) => handleColumnChange(index, "note", e.target.value)}
              fullWidth
            />
            <TextField
              label="Tag"
              value={column.tag}
              sx={{ width: "30%" }}
              onChange={(e) => handleColumnChange(index, "tag", e.target.value)}
              fullWidth
            />
          </Box>
        </Box>
      ))}

      <Button variant="contained" color="primary" onClick={handleSubmit}>
        Save Changes
      </Button>
    </Box>
  );
};

export default TableEditForm;
