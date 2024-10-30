import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#2A3B85",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#f50057",
      contrastText: "#ffffff",
    },
    background: {
      default: "#f5f5f5",
      paper: "#ffffff",
    },
    text: {
      primary: "#333333",
      secondary: "#757575",
    },
    divider: "#bdbdbd",
  },
  typography: {
    fontFamily: "Roboto, sans-serif",
    button: {
      textTransform: "none",
      fontWeight: "bold",
    },
  },
  components: {
    MuiSelect: {
      styleOverrides: {
        select: {
          color: "white",
          backgroundColor: "#2A3B85",
          "&:focus": {
            backgroundColor: "#2A3B85",
          },
        },
        icon: {
          color: "white",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: "8px 16px",
          fontWeight: "bold",
        },
        containedPrimary: {
          backgroundColor: "#2A3B85",
          color: "#ffffff",
          "&:hover": {
            backgroundColor: "#3C51AB",
          },
        },
        containedSecondary: {
          backgroundColor: "#f50057",
          color: "#ffffff",
          "&:hover": {
            backgroundColor: "#c51162",
          },
        },
      },
    },
    MuiTable: {
      styleOverrides: {
        root: {
          backgroundColor: "#ffffff",
          borderCollapse: "collapse",
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: "#2A3B85",
          "& .MuiTableCell-root": {
            color: "#ffffff",
            fontWeight: "bold",
          },
        },
      },
    },
    MuiTableBody: {
      styleOverrides: {
        root: {
          "& .MuiTableCell-root": {
            color: "#333333",
            borderColor: "#bdbdbd",
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: "#ffffff",
          color: "#333333",
          padding: "20px",
          borderRadius: "8px",
        },
      },
    },
  },
});

export default theme;
