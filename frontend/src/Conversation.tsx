import {
  Box,
  Button,
  IconButton,
  LinearProgress,
  List,
  ListItem,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Chat } from "../wailsjs/go/main/App";
import DeleteIcon from "@mui/icons-material/Delete";
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

type ConversationProps = {
  sideBarWidth: string;
};

function Conversation(props: ConversationProps) {
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
        backgroundColor: (theme) => theme.palette.grey[100],
        width: "100vw",
        height: "100vh",
      }}
    >
      <List disablePadding>
        {conversation.messages.map((m) => (
          <Message message={m} />
        ))}
        {chat && <LinearProgress />}
        {/* avoid hidden by input TextField */}
        <ListItem
          disablePadding
          sx={{
            backgroundColor: (theme) => theme.palette.grey[100],
            height: 85,
          }}
        />
      </List>

      {conversation.messages.length > 0 && (
        <IconButton
          onClick={() => {
            setConversation({ id: 0, messages: [] });
          }}
          sx={{ position: "fixed", top: 5, right: 5 }}
        >
          <DeleteIcon />
        </IconButton>
      )}

      <TextField
        multiline
        value={input}
        onChange={(e) => setInput(e.target.value)}
        sx={{
          position: "fixed",
          margin: 1,
          bottom: 0,
          left: props.sideBarWidth,
          right: 0,
          backgroundColor: (theme) => theme.palette.grey[300],
        }}
        InputProps={{
          endAdornment: <Button onClick={handleSend}>Send</Button>,
        }}
      />
    </Box>
  );
}

export default Conversation;
