import { createTheme } from "@mui/material/styles";

// A custom theme for this app
const theme = createTheme({
  palette: {
    info: {
      main: "#349EEB",
    },
    error: {
      main: "#ff4d4f",
    },
    success: {
      main: "#1CAB8A",
    },
    primary: {
      main: "#695EEE",
    },
    text: {
      secondary: "#707F92",
    },
  },
  typography: {
    fontSize: 12,
    fontFamily: ["Public Sans", "sans-serif"].join(","),
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.1)",
        },
      },
    },
    MuiPopover: {
      styleOverrides: {
        paper: {
          boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.1)",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: ({ ownerState }) => ({
          borderWidth: ownerState.variant === "outlined" ? "2px" : "auto",
          textTransform: "none",
        }),
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: ({ ownerState }) => ({
          ":hover": {
            backgroundColor: "rgba(0, 0, 0, 0.02)",
          },
          padding: "10px 16px",
          borderLeft: ownerState.selected ? "3px solid #695EEE" : "none",
          backgroundColor: ownerState.selected ? "unset !important" : "auto",
        }),
      },
    },
  },
});

export default theme;
