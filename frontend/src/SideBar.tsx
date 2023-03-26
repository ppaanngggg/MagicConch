import * as React from "react";
import {
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";

type SideBarProps = {
  width: string;
  openSettings: () => void;
};

function SideBar(props: SideBarProps) {
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
      <List component="nav">
        <ListItemButton onClick={props.openSettings}>
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary="Setting" />
        </ListItemButton>
        <Divider />
      </List>
    </Drawer>
  );
}

export default SideBar;
