import React, { useState } from "react";
import { Box, Chip, TextField } from "@mui/material";
import { ChipInputProps } from "../interfaces/interfaces";

const ChipInput: React.FC<ChipInputProps> = ({
  chipData = [],
  onAddChip,
  onDeleteChip,
  placeholder = "Add new tag",
}) => {
  const [tagInput, setTagInput] = useState("");
  const [tableTags, setTableTags] = useState<string[]>(chipData); 

  // This will handle adding tags to the tableTags state
  const handleAddTag = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && tagInput.trim()) {
      const newTag = tagInput.trim();
      setTableTags((prev) => [...prev, newTag]);  
      // onAddChip(newTag);  
      setTagInput("");  
      event.preventDefault();  // Prevent form submission
    }
  };

  return (
    <Box
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

      {Array.isArray(tableTags) && tableTags.map((tag, index) => (
        <Chip
          key={index}
          label={tag}
          onDelete={() => onDeleteChip(tag)}  
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
