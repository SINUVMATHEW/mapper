import { useEffect, useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../../../theme/theme";
import {
  Select,
  MenuItem,
  Box,
  Button,
  Autocomplete,
  TextField,
  Typography,
  SnackbarCloseReason,
  Snackbar,
  Alert,
} from "@mui/material";
import TableEditForm from "./TableEditForm";
import AddRelationPopUp from "./AddRelationPopUp";
import NestedFlow from "../../flowchart/flowchartbase";
import { IoMdCloudUpload } from "react-icons/io";
import axios from "axios";
import GlobalSearch from "./GlobalSearch";
import { fetchTables } from "../../../services/api/CommonApi";
import { baseUrl } from "../../../services/api/BaseUrl";
import { HomePageSkelton } from "./HomePageSkelton";
import useKeyspaceStore from "../../../store/store";
import relationBgImage from "../../../assets/relation bg.jpg";

const Home = () => {
  const [tables, setTables] = useState<string[]>([]);
  const [selectedTable, setSelectedTable] = useState("");
  const [openPopup, setOpenPopup] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState(" ");
  const { keyspaces, selectedKeyspace, fetchKeyspaces, setSelectedKeyspace } = useKeyspaceStore();

  useEffect(() => {
    const loadKeyspaces = async () => {
      try {
        await fetchKeyspaces();
        setLoading(false);
      } catch (error) {
        console.error("Error fetching keyspaces", error);
        setError(String(error));
        setLoading(true);
      }
    };

    loadKeyspaces();
  }, [fetchKeyspaces]);

  // fetching keyspaces
  // useEffect(() => {
  //   const getKeyspaces = async () => {
  //     try {
  //       const keyspaces = await fetchKeyspaces();
  //       setKeyspaces(keyspaces);
  //       if (keyspaces.length > 0) {
  //         setSelectedKeyspace(keyspaces[0]);
  //       }
  //       setLoading(false);
  //     } catch (error) {
  //       console.error("Error fetching roles:", error);
  //       setError(String(error));
  //       setLoading(true);
  //     }
  //   };
  //   getKeyspaces();
  // }, []);

  // fetching tables

  useEffect(() => {
    const getTableNames = async () => {
      if (!selectedKeyspace) return;
      try {
        const tables = await fetchTables(selectedKeyspace);

        setTables(tables);
        if (tables.length > 0) {
          setSelectedTable(tables[0]);
        }
      } catch (error) {
        {
          console.error("Error fetching tables", { keyspace: selectedKeyspace, error: error });
        }
      } finally {
        setLoading(false);
      }
    };
    getTableNames();
  }, [selectedKeyspace]);

  if (!keyspaces) {
    return <Box>Loading...</Box>;
  }

  const handleTableChange = (_event: React.SyntheticEvent, value: string | null) => {
    if (value !== null) setSelectedTable(value);
  };

  const handleAddRelation = () => {
    setOpenPopup(true);
  };

  const handleClosePopup = () => {
    setOpenPopup(false);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSnackbarClose = (
    _event: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      setSnackbarOpen(false);
      return;
    }

    setSnackbarOpen(false);
  };

  const handleRelationSave = (isSuccess: boolean) => {
    if (isSuccess) {
      setSnackbarMessage("Relation saved successfully!");
      setSnackbarOpen(true);
      setSelectedTable(selectedTable);
    } else {
      alert("Error saving Relation!");
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await axios.post(baseUrl + "/upload-file", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("File uploaded successfully:", response.data);
      setSnackbarMessage("File uploaded successfully");
      setSnackbarOpen(true);
      setSelectedFile(null);
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error uploading file. Please try again.");
    }
  };
  console.log(error);

  return (
    <ThemeProvider theme={theme}>
      {loading ? (
        <Box>
          <Typography align="center">{error}</Typography>
          <HomePageSkelton />
        </Box>
      ) : (
        <>
          <Snackbar
            open={snackbarOpen}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            autoHideDuration={5000}
            onClose={handleSnackbarClose}
          >
            <Alert severity="success" variant="filled" sx={{ width: "100%" }}>
              {snackbarMessage}
            </Alert>
          </Snackbar>
          <Box sx={{ p: 2 }}>
            <Box
              sx={{
                display: "flex",
                gap: 1,
                pb: 3,
                justifyContent: "space-between",
              }}
            >
              <Select
                value={selectedKeyspace}
                onChange={(e) => setSelectedKeyspace(e.target.value)}
                variant="outlined"
                size="small"
                fullWidth
                sx={{ flex: 1 }}
              >
                {keyspaces.map((keyspace) => (
                  <MenuItem key={keyspace} value={keyspace}>
                    {keyspace}
                  </MenuItem>
                ))}
              </Select>

              <Autocomplete
                value={selectedTable}
                onChange={handleTableChange}
                options={tables}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Table"
                    variant="outlined"
                    size="small"
                    fullWidth
                  />
                )}
                size="small"
                fullWidth
                sx={{ flex: 1 }}
              />

              <Button component="label" variant="contained" startIcon={<IoMdCloudUpload />}>
                Upload files
                <input type="file" hidden onChange={handleFileChange} />
              </Button>
              {selectedFile && <p>Selected File: {selectedFile.name}</p>}
              <Button
                variant="contained"
                color="primary"
                onClick={handleFileUpload}
                disabled={!selectedFile}
              >
                Submit File
              </Button>
            </Box>
            {/* globalsearch */}
            <GlobalSearch />
            {/* TableEditForm for selected table */}
            {selectedKeyspace && (
              <Box sx={{ pb: 3 }}>
                <TableEditForm keyspace={selectedKeyspace} table={selectedTable} />
              </Box>
            )}

            {/* Button and Popup for Adding Relations */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1,
                border: 1,
                borderRadius: 2,
                backgroundImage: `url(${relationBgImage})`,
                backgroundSize: "cover",
                backgroundBlendMode: "overlay", 
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                // backgroundPosition: "center",
                padding: 1,
                marginBottom: 3,
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "flex-start", paddingLeft: 3 }}>
                <Button
                  variant="contained"
                  // size="small"
                  onClick={handleAddRelation}
                  sx={{
                    margin: 3,
                    color: "black",
                    backgroundColor: "white",
                    "&:hover": {
                      backgroundColor: "#1979B3",
                      color: "white",
                    },
                  }}
                >
                  Add Relation
                </Button>
                {openPopup && (
                  <AddRelationPopUp
                    onClose={handleClosePopup}
                    onSave={() => handleRelationSave(true)}
                  />
                )}
              </Box>
            </Box>
            <NestedFlow keyspace={selectedKeyspace} table={selectedTable} />
          </Box>
        </>
      )}
    </ThemeProvider>
  );
};

export default Home;
