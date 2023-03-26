import Conversation from "./Conversation";
import SettingsDialog from "./SettingsDialog";
import SideBar from "./SideBar";
import "./styles/scrollbar.css";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import * as React from "react";
import { useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const sideBarWidth = "20%";

  const [showSettings, setShowSettings] = useState(false);

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <ToastContainer />
      <SideBar
        width={sideBarWidth}
        openSettings={() => setShowSettings(true)}
      />
      {showSettings && <SettingsDialog close={() => setShowSettings(false)} />}
      <Conversation />
    </Box>
  );
}

export default App;
