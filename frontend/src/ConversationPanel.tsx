import { Chat, One, Save } from "../wailsjs/go/main/App";
import MessageBlock, {
  Message,
  roleAssistant,
  roleSystem,
  roleUser,
} from "./MessageBlock";
import AddIcon from "@mui/icons-material/Add";
import ReplayIcon from "@mui/icons-material/Replay";
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
  Tooltip,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { toast } from "react-toastify";

export interface Conversation {
  id: number;
  title: string;
  messages: Message[];
}

interface ConversationPanelProps {
  id: number;
  resetId: () => void;
  refresh: () => void;
}

export default function ConversationPanel(props: ConversationPanelProps) {
  const [conversation, setConversation] = useState<Conversation>({
    id: 0,
    title: "",
    messages: [],
  });
  const [input, setInput] = useState("");
  const [chatting, setChatting] = useState(false);

  const listRef = useRef<HTMLUListElement | null>(null);

  useEffect(() => {
    if (props.id > 0) {
      One(props.id).then(setConversation).catch(toast.error);
    } else {
      setConversation({ id: 0, title: "", messages: [] });
    }
  }, [props.id]);

  useEffect(() => {
    listRef.current?.lastElementChild?.scrollIntoView({ behavior: "smooth" });

    if (chatting && conversation.messages.length > 0) {
      Chat(conversation)
        .then(setConversation)
        .catch(toast.error)
        .finally(() => {
          setChatting(false);
        });
    }
  }, [conversation]);

  const handleSend = () => {
    if (input.length > 0 && !chatting) {
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

  const handleSystem = () => {
    if (input.length > 0 && !chatting && conversation.messages.length == 0) {
      setConversation({
        ...conversation,
        messages: [{ role: roleSystem, content: input }],
      });
      setInput("");
    }
  };

  const handleReplay = () => {
    let message: Message | undefined;
    while (conversation.messages.length > 0) {
      message = conversation.messages.pop();
      if (message?.role !== roleAssistant) {
        setInput(message?.content ?? "");
        setConversation(conversation);
        break;
      }
    }
  };

  const handleNew = () => {
    setConversation({ id: 0, title: "", messages: [] });
    props.resetId();
  };

  const handleSave = () => {
    if (conversation?.messages?.length > 0) {
      Save(conversation)
        .then(setConversation)
        .then(props.refresh)
        .catch(toast.error);
    }
  };

  useHotkeys("ctrl+n", handleNew, { enableOnFormTags: true });
  useHotkeys("ctrl+s", handleSave, { enableOnFormTags: true });
  useHotkeys("ctrl+r", handleReplay, { enableOnFormTags: true });
  useHotkeys("ctrl+enter", handleSend, { enableOnFormTags: true });
  useHotkeys("ctrl+shift+enter", handleSystem, { enableOnFormTags: true });

  return (
    <Box
      sx={{
        width: "80vw",
        backgroundColor: (theme) => theme.palette.grey[100],
      }}
    >
      <Stack sx={{ height: "100vh" }}>
        {conversation.messages.length > 0 ? (
          <List
            ref={listRef}
            disablePadding
            sx={{ flexGrow: 1, overflow: "auto" }}
          >
            {conversation.messages.map((m) => (
              <MessageBlock message={m} />
            ))}
          </List>
        ) : (
          <Box
            sx={{
              flexGrow: 1,
              textAlign: "center",
              paddingTop: "calc(50vh - 12rem)",
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <h2>🐚 Why not ask Magic Conch?</h2>
            <p>
              <b>Ctrl+N</b> to start a new conversation
            </p>
            <p>
              <b>Ctrl+Enter</b> to send message
            </p>
            <p>
              <b>Ctrl+Shift+Enter</b> to set system
            </p>
            <p>
              <b>Ctrl+S</b> to save conversation
            </p>
            <p>
              <b>Ctrl+R</b> to replay last round
            </p>
          </Box>
        )}

        {chatting && <LinearProgress />}

        <Divider />
        <TextField
          variant="standard"
          multiline
          value={input}
          onChange={(e) => setInput(e.target.value)}
          maxRows={12}
          placeholder="Type your message here..."
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

      <Tooltip title={"send"}>
        <IconButton
          onClick={handleSend}
          sx={{ position: "fixed", right: "0.6rem", bottom: "0.5rem" }}
        >
          <SendIcon />
        </IconButton>
      </Tooltip>

      {conversation.messages.length > 0 && (
        <div>
          <Tooltip title={"new"}>
            <IconButton
              onClick={handleNew}
              sx={{ position: "fixed", top: "0.5rem", right: "0.6rem" }}
            >
              <AddIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title={"save"}>
            <IconButton
              onClick={handleSave}
              sx={{ position: "fixed", top: "3rem", right: "0.6rem" }}
            >
              <SaveIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title={"replay"}>
            <IconButton
              onClick={handleReplay}
              sx={{ position: "fixed", top: "5.5rem", right: "0.6rem" }}
            >
              <ReplayIcon />
            </IconButton>
          </Tooltip>
        </div>
      )}
    </Box>
  );
}
