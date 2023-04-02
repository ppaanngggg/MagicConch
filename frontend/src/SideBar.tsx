import SettingsDialog from "./SettingsDialog";
import SettingsIcon from "@mui/icons-material/Settings";
import {
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
} from "@mui/material";
import * as React from "react";
import { useState } from "react";

type SideBarProps = {};

export default function SideBar(props: SideBarProps) {
  const width = "20vw";

  const [showSettings, setShowSettings] = useState(false);

  return (
    <Drawer
      sx={{
        width: width,
        "& .MuiDrawer-paper": {
          width: width,
        },
      }}
      variant="permanent"
    >
      <Stack sx={{ height: "100vh" }}>
        <List disablePadding sx={{ flexGrow: 1, overflow: "auto" }}></List>
        <Divider />
        <List>
          <ListItemButton
            onClick={() => {
              setShowSettings(true);
            }}
          >
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText sx={{ overflow: "hidden" }} primary="Setting" />
          </ListItemButton>
        </List>
      </Stack>

      {showSettings && <SettingsDialog close={() => setShowSettings(false)} />}
    </Drawer>
  );
}
