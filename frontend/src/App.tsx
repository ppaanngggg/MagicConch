import { List } from "../wailsjs/go/main/App";
import ConversationPanel, { Conversation } from "./ConversationPanel";
import SideBar from "./SideBar";
import "./styles/scrollbar.css";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import * as React from "react";
import { useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  const [id, setId] = React.useState(0);
  const [query, setQuery] = React.useState("");
  const [conversations, setConversations] = React.useState<Conversation[]>([]);
  const [refresh, setRefresh] = React.useState(true);

  useEffect(() => {
    if (refresh) {
      List(query)
        .then(setConversations)
        .catch(toast.error)
        .finally(() => {
          setRefresh(false);
        });
    }
  }, [refresh]);

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <ToastContainer />
      <SideBar
        conversations={conversations}
        setId={setId}
        setQuery={setQuery}
        refresh={() => {
          setRefresh(true);
        }}
      />
      <ConversationPanel
        id={id}
        resetId={() => {
          setId(0);
        }}
        refresh={() => {
          setRefresh(true);
        }}
      />
    </Box>
  );
}
