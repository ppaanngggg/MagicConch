import { Chat } from "../wailsjs/go/main/App";
import { Message, MessageBlock } from "./Message";
import "./styles/markdown.css";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import SendIcon from "@mui/icons-material/Send";
import {
  Box,
  Divider,
  IconButton,
  LinearProgress,
  List,
  Stack,
  TextField,
} from "@mui/material";
import "highlight.js/styles/github.css";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

interface Conversation {
  id: number;
  messages: Message[];
}

function Conversation() {
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
        messages: [...conversation.messages, { role: "user", content: input }],
      });
      setInput("");
      setChatting(true);
    }
  };

  const handleDelete = () => {
    setConversation({ id: 0, messages: [] });
  };

  const handleSave = () => {};

  return (
    <Box
      sx={{
        width: "100vw",
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
        sx={{
          position: "absolute",
          right: "0.6rem",
          bottom: "0.5rem",
        }}
      >
        <SendIcon />
      </IconButton>

      {conversation.messages.length > 0 && (
        <div>
          <IconButton
            id="delete-button"
            onClick={handleDelete}
            sx={{ position: "absolute", top: "0.5rem", right: "0.6rem" }}
          >
            <DeleteIcon />
          </IconButton>
          <IconButton
            id="delete-button"
            onClick={handleSave}
            sx={{ position: "absolute", top: "3rem", right: "0.6rem" }}
          >
            <SaveIcon />
          </IconButton>
        </div>
      )}
    </Box>
  );
}

export default Conversation;
