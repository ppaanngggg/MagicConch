import {
  Box,
  Divider,
  IconButton,
  LinearProgress,
  List,
  ListItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Chat } from "../wailsjs/go/main/App";
import DeleteIcon from "@mui/icons-material/Delete";
import SendIcon from "@mui/icons-material/Send";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css";
import "./styles/markdown.css";

interface Message {
  role: string;
  content: string;
}

type MessageProps = {
  message: Message;
};

function Message(props: MessageProps) {
  return (
    <ListItem
      disablePadding
      sx={{
        backgroundColor: (theme) =>
          props.message.role == "assistant"
            ? theme.palette.grey[300]
            : theme.palette.grey[100],
      }}
    >
      <Typography sx={{ paddingX: "12%", paddingY: "3%" }}>
        <ReactMarkdown
          className={"markdown-body"}
          children={props.message.content}
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw, rehypeHighlight]}
        />
      </Typography>
    </ListItem>
  );
}

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
  const [chat, setChat] = useState(false);

  useEffect(() => {
    if (chat && conversation.messages.length > 0) {
      Chat(conversation)
        .then(setConversation)
        .finally(() => {
          setChat(false);
        });
    }
  }, [chat]);

  const handleSend = () => {
    setConversation({
      ...conversation,
      messages: [...conversation.messages, { role: "user", content: input }],
    });
    setInput("");
    setChat(true);
  };

  return (
    <Box
      sx={{
        width: "100vw",
        backgroundColor: (theme) => theme.palette.grey[100],
      }}
      onKeyDown={(e) => {
        if (e.key === "Delete") {
          setConversation({ id: 0, messages: [] });
        }
      }}
    >
      <Stack sx={{ height: "100vh" }}>
        <List disablePadding sx={{ flexGrow: 1, overflow: "auto" }}>
          {conversation.messages.map((m) => (
            <Message message={m} />
          ))}
          {chat && <LinearProgress />}
        </List>

        <Divider />

        <TextField
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
          onKeyDown={(e) => {
            if (e.ctrlKey && e.key === "Enter") {
              handleSend();
            }
          }}
        />
      </Stack>

      <IconButton
        onClick={handleSend}
        sx={{
          position: "absolute",
          right: "0.5rem",
          bottom: "0.5rem",
        }}
      >
        <SendIcon />
      </IconButton>

      {conversation.messages.length > 0 && (
        <IconButton
          onClick={() => {
            setConversation({ id: 0, messages: [] });
          }}
          sx={{ position: "fixed", top: "0.5rem", right: "0.5rem" }}
        >
          <DeleteIcon />
        </IconButton>
      )}
    </Box>
  );
}

export default Conversation;
