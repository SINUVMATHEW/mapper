import React, { useState } from "react";
import { Box, Chip, TextField } from "@mui/material";

interface ChipInputProps {
  chipData: string[];
  onAddChip: (chip: string) => void;
  onDeleteChip: (chip: string) => void;
  placeholder?: string;
}

const ChipInput: React.FC<ChipInputProps> = ({
  chipData,
  onAddChip,
  onDeleteChip,
  placeholder = "Add new tag",
}) => {
  const [tagInput, setTagInput] = useState("");

  const handleAddTag = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && tagInput.trim()) {
      onAddChip(tagInput.trim());
      setTagInput("");
      event.preventDefault();
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        padding: "6px",
        border: "1px solid #ccc",
        borderRadius: "4px",
        
      }}
    >
      {chipData.map((data, index) => (
        <Chip
          key={index}
          label={data}
          onDelete={() => onDeleteChip(data)}
          size="small"
          sx={{ margin: "2px" }}
        />
      ))}
      <TextField
        variant="standard"
        placeholder={placeholder}
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
    </Box>
  );
};

export default ChipInput;
