import { useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../../../theme/theme";
import {
  Box,
  Button,
  Typography,
  SnackbarCloseReason,
  Snackbar,
  Alert,
} from "@mui/material";
import TableEditForm from "./TableEditForm";
import AddRelationPopUp from "./AddRelationPopUp";
import NestedFlow from "../../flowchart/flowchartbase";
import { useParams } from "react-router-dom";
import { HomePageSkelton } from "./HomePageSkelton";
import { Storage, TableChart } from "@mui/icons-material";
const Dashboard: React.FC = () => {
  const { keyspace, table } = useParams<{ keyspace: string; table: string }>();
  const [openPopup, setOpenPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState(" ");

  if (!keyspace) {
    setLoading(false)
    setError("error loading table")
  }

  const handleAddRelation = () => {
    setOpenPopup(true);
  };

  const handleClosePopup = () => {
    setOpenPopup(false);
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
    } else {
      alert("Error saving Relation!");
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
                gap: 2,
                pb: 3,
                justifyContent: "space-between",
              }}
            >
              {/* Keyspace Box */}
              <Box
                sx={{
                  flex: 1,
                  bgcolor: "#2A3B85",
                  color: "#c8dffd",
                  borderRadius: 2,
                  p: 1,
                  textAlign: "center",
                  fontSize: "1rem",
                  fontWeight: "bold",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                }}
              >
                <Storage sx={{ fontSize: 20, mr: 1 }} />
                <Typography variant="body1">Keyspace:</Typography>
                <Typography variant="h6" color="#eeeeee" sx={{ ml: 2 }}>
                  {keyspace || "No Keyspace Selected"}
                </Typography>
              </Box>

              {/* Table Box */}
              <Box
                sx={{
                  flex: 1,
                  bgcolor: "#2A3B85",
                  color: "#c8dffd",
                  borderRadius: 2, 
                  p: 1,
                  textAlign: "center",
                  fontSize: "1rem",
                  fontWeight: "bold",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                }}
              >
                <TableChart sx={{ fontSize: 20, mr: 1 }} />
                <Typography variant="body1">Table:</Typography>
                <Typography variant="h6" color="#eeeeee" sx={{ ml: 2 }}>
                  {table || "No Table Selected"}
                </Typography>
              </Box>
            </Box>

            {/* TableEditForm for selected table */}
            {keyspace && (
              <Box sx={{ pb: 3 }}>
                {keyspace && table && <TableEditForm keyspace={keyspace} table={table} />}
              </Box>
            )}

            {/* Button and Popup for Adding Relations */}
            <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
              <Button
                variant="contained"
                color="secondary"
                size="small"
                onClick={handleAddRelation}
                sx={{ margin: 3 }}
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
            {keyspace && table && <NestedFlow keyspace={keyspace} table={table} />}
          </Box>
        </>
      )}
    </ThemeProvider>
  );
};

export default Dashboard;
