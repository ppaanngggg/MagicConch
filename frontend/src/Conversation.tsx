import { Chat, Save } from "../wailsjs/go/main/App";
import { Message, MessageBlock, roleSystem, roleUser } from "./Message";
import DeleteIcon from "@mui/icons-material/Delete";
import ModeIcon from "@mui/icons-material/Mode";
import SaveIcon from "@mui/icons-material/Save";
import SendIcon from "@mui/icons-material/Send";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  LinearProgress,
  List,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

interface Conversation {
  id: number;
  messages: Message[];
}

export default function Conversation() {
  const [conversation, setConversation] = useState<Conversation>({
    id: 0,
    messages: [],
  });
  const [input, setInput] = useState("");
  const [chatting, setChatting] = useState(false);

  useEffect(() => {
    if (chatting && conversation.messages.length > 0) {
      Chat(conversation)
        .then(setConversation)
        .catch(toast.error)
        .finally(() => {
          setChatting(false);
        });
    }
  }, [chatting]);

  const listRef = useRef<HTMLUListElement | null>(null);
  useEffect(() => {
    listRef.current?.lastElementChild?.scrollIntoView({ behavior: "smooth" });
  }, [conversation]);

  const handleSend = () => {
    if (input.length > 0) {
      setConversation({
        ...conversation,
        messages: [
          ...conversation.messages,
          { role: roleUser, content: input },
        ],
      });
      setInput("");
      setChatting(true);
    }
  };

  const handleDelete = () => {
    setConversation({ id: 0, messages: [] });
  };

  const handleSave = () => {
    Save(conversation).then(setConversation).catch(toast.error);
  };

  function SystemDialog() {
    const [system, setSystem] = useState("");

    return (
      <Dialog open={true} fullWidth={true}>
        <DialogTitle>System</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            label="system"
            fullWidth
            variant="standard"
            multiline
            maxRows={4}
            onChange={(event) => {
              setSystem(event.target.value);
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setShowSystem(false);
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              setConversation({
                ...conversation,
                messages: [
                  ...conversation.messages,
                  { role: roleSystem, content: system },
                ],
              });
              setShowSystem(false);
            }}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  const [showSystem, setShowSystem] = useState(false);
  const handleSystem = () => {
    setShowSystem(true);
  };

  return (
    <Box
      sx={{
        width: "80vw",
        backgroundColor: (theme) => theme.palette.grey[100],
      }}
      onKeyDown={(e) => {
        if (e.key === "Delete") {
          handleDelete();
        } else if (e.ctrlKey && e.key === "Enter") {
          handleSend();
        }
      }}
    >
      <Stack sx={{ height: "100vh" }}>
        {conversation.messages.length > 0 ? (
          <List
            id="conversations"
            ref={listRef}
            disablePadding
            sx={{ flexGrow: 1, overflow: "auto" }}
          >
            {conversation.messages.map((m) => (
              <MessageBlock message={m} />
            ))}
          </List>
        ) : (
          <Typography
            sx={{
              flexGrow: 1,
              textAlign: "center",
              paddingTop: "calc(50vh - 5rem)",
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <h3>🐚 Why not ask Magic Conch?</h3>
            <p>
              <b>Ctrl+Enter</b> to send
            </p>
            <p>
              <b>Delete</b> to clear
            </p>
          </Typography>
        )}

        {chatting && <LinearProgress />}

        <Divider />
        <TextField
          id="input-field"
          variant="standard"
          multiline
          value={input}
          onChange={(e) => setInput(e.target.value)}
          maxRows={12}
          InputProps={{
            sx: {
              padding: "1rem",
              paddingRight: "0rem",
              "& .MuiInput-input": {
                paddingRight: "3rem",
              },
            },
          }}
        />
      </Stack>

      <IconButton
        id="send-button"
        onClick={handleSend}
        sx={{ position: "fixed", right: "0.6rem", bottom: "0.5rem" }}
      >
        <SendIcon />
      </IconButton>

      {conversation.messages.length > 0 ? (
        <div>
          <IconButton
            id="delete-button"
            onClick={handleDelete}
            sx={{ position: "fixed", top: "0.5rem", right: "0.6rem" }}
          >
            <DeleteIcon />
          </IconButton>
          <IconButton
            id="save-button"
            onClick={handleSave}
            sx={{ position: "fixed", top: "3rem", right: "0.6rem" }}
          >
            <SaveIcon />
          </IconButton>
        </div>
      ) : (
        <div>
          <IconButton
            id="system-button"
            onClick={handleSystem}
            sx={{ position: "fixed", top: "0.5rem", right: "0.6rem" }}
          >
            <ModeIcon />
          </IconButton>
        </div>
      )}

      {showSystem && <SystemDialog />}
    </Box>
  );
}
