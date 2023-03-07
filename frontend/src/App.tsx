import * as React from "react";
import { useState } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";

import SideBar from "./SideBar";
import SettingsDialog from "./SettingsDialog";
import Conversation from "./Conversation";

function App() {
  const sideBarWidth = "20%";

  const [showSettings, setShowSettings] = useState(false);

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <SideBar
        width={sideBarWidth}
        openSettings={() => setShowSettings(true)}
      />
      {showSettings && <SettingsDialog close={() => setShowSettings(false)} />}
      <Conversation sideBarWidth={sideBarWidth} />
    </Box>
  );
}

export default App;
