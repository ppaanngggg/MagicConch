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

type SideBarProps = {
  width: string;
  openSettings: () => void;
};

export default function SideBar(props: SideBarProps) {
  return (
    <Drawer
      sx={{
        width: props.width,
        "& .MuiDrawer-paper": {
          width: props.width,
        },
      }}
      variant="permanent"
    >
      <Stack sx={{ height: "100vh" }}>
        <List disablePadding sx={{ flexGrow: 1, overflow: "auto" }}></List>
        <Divider />
        <List>
          <ListItemButton onClick={props.openSettings}>
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Setting" />
          </ListItemButton>
        </List>
      </Stack>
    </Drawer>
  );
}
