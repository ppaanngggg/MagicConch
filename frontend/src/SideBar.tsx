import { DeleteConversation, ListConversations } from "../wailsjs/go/main/App";
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
  Tooltip,
} from "@mui/material";
import * as React from "react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

type SideBarProps = {
  conversation: Conversation;
  setConversation: (conversation: Conversation) => void;
  refreshListCount: number;
  refresh: () => void;
};

export default function SideBar(props: SideBarProps) {
  const [query, setQuery] = React.useState("");
  const [conversations, setConversations] = React.useState<Conversation[]>([]);
  const [hoveredId, setHoveredId] = useState<number>(0);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    ListConversations(query).then(setConversations).catch(toast.error);
  }, [props.refreshListCount]);

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
            setQuery(e.target.value);
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
          {conversations.map((conversation) => (
            <Card
              key={conversation.id}
              variant={"outlined"}
              sx={{ margin: "0.2rem" }}
            >
              <ListItem
                disablePadding
                secondaryAction={
                  conversation.id === hoveredId && (
                    <Tooltip title={"remove"}>
                      <IconButton
                        edge="end"
                        onClick={() => {
                          DeleteConversation(conversation.id)
                            .then(props.refresh)
                            .then(() => {
                              if (conversation.id === props.conversation.id)
                                props.setConversation({
                                  id: 0,
                                  title: "",
                                  messages: [],
                                });
                            })
                            .catch(toast.error);
                        }}
                      >
                        <RemoveIcon />
                      </IconButton>
                    </Tooltip>
                  )
                }
              >
                <ListItemButton
                  onClick={() => {
                    props.setConversation(conversation);
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
