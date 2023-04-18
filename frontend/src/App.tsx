import ConversationPanel, { Conversation } from "./ConversationPanel";
import SideBar from "./SideBar";
import "./styles/scrollbar.css";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import * as React from "react";
import { useCallback } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  const [conversation, setConversation] = React.useState<Conversation>({
    id: 0,
    title: "",
    messages: [],
  });
  const [refreshListCount, setRefreshListCount] = React.useState(0);

  const refresh = useCallback(() => {
    setRefreshListCount(refreshListCount + 1);
  }, [refreshListCount]);

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <ToastContainer />
      <SideBar
        conversation={conversation}
        setConversation={setConversation}
        refreshListCount={refreshListCount}
        refresh={refresh}
      />
      <ConversationPanel
        conversation={conversation}
        setConversation={setConversation}
        refresh={refresh}
      />
    </Box>
  );
}
