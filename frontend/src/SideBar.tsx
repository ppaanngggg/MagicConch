import { Conversation } from "./ConversationPlane";
import SettingsDialog from "./SettingsDialog";
import SettingsIcon from "@mui/icons-material/Settings";
import {
  Card,
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

type SideBarProps = {
  conversations: Conversation[];
};

export default function SideBar(props: SideBarProps) {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <Drawer
      sx={{
        width: "20vw",
        "& .MuiDrawer-paper": {
          width: "20vw",
        },
      }}
      variant="permanent"
    >
      <Stack sx={{ height: "100vh" }}>
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

        <List
          disablePadding
          sx={{
            flexGrow: 1,
            overflow: "auto",
            backgroundColor: (theme) => theme.palette.grey[200],
          }}
        >
          {props.conversations.map((conversation) => (
            <Card variant={"outlined"} sx={{ margin: "0.2rem" }}>
              <ListItemButton>
                <ListItemText
                  primary={conversation.title}
                  primaryTypographyProps={{ noWrap: true }}
                />
              </ListItemButton>
            </Card>
          ))}
        </List>
        <Divider />
      </Stack>

      {showSettings && <SettingsDialog close={() => setShowSettings(false)} />}
    </Drawer>
  );
}
