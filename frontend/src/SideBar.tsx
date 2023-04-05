import { Delete } from "../wailsjs/go/main/App";
import { Conversation } from "./ConversationPanel";
import SettingsDialog from "./SettingsDialog";
import RemoveIcon from "@mui/icons-material/Remove";
import SettingsIcon from "@mui/icons-material/Settings";
import {
  Card,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  TextField,
} from "@mui/material";
import * as React from "react";
import { useState } from "react";
import { toast } from "react-toastify";

type SideBarProps = {
  conversations: Conversation[];
  setId: (id: number) => void;
  setQuery: (query: string) => void;
  refresh: () => void;
};

export default function SideBar(props: SideBarProps) {
  const [hoveredId, setHoveredId] = useState<number>(0);
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
      <Stack
        sx={{
          height: "100vh",
          backgroundColor: (theme) => theme.palette.grey[200],
        }}
        onMouseLeave={() => {
          setHoveredId(0);
        }}
      >
        <TextField
          variant="outlined"
          placeholder="Search"
          sx={{ margin: "0.2rem", backgroundColor: "white" }}
          inputProps={{
            sx: { padding: "0.5rem" },
          }}
          onChange={(e) => {
            props.setQuery(e.target.value);
            props.refresh();
          }}
        />
        <List
          disablePadding
          sx={{
            flexGrow: 1,
            overflow: "auto",
          }}
        >
          {props.conversations.map((conversation) => (
            <Card variant={"outlined"} sx={{ margin: "0.2rem" }}>
              <ListItem
                disablePadding
                secondaryAction={
                  conversation.id === hoveredId && (
                    <IconButton
                      edge="end"
                      onClick={() => {
                        Delete(conversation.id)
                          .then(props.refresh)
                          .catch(toast.error);
                      }}
                    >
                      <RemoveIcon />
                    </IconButton>
                  )
                }
              >
                <ListItemButton
                  onClick={() => {
                    props.setId(conversation.id);
                  }}
                  onMouseOver={() => {
                    setHoveredId(conversation.id);
                  }}
                >
                  <ListItemText
                    primary={conversation.title}
                    primaryTypographyProps={{ noWrap: true }}
                  />
                </ListItemButton>
              </ListItem>
            </Card>
          ))}
        </List>
        <Divider />
        <List
          sx={{
            backgroundColor: "white",
          }}
        >
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
