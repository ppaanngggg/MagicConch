import { List } from "../wailsjs/go/main/App";
import ConversationPlane, { Conversation } from "./ConversationPlane";
import SideBar from "./SideBar";
import "./styles/scrollbar.css";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import * as React from "react";
import { useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  const [conversations, setConversations] = React.useState<Conversation[]>([]);

  useEffect(() => {
    List().then(setConversations).catch(toast.error);
  }, []);

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <ToastContainer />
      <SideBar conversations={conversations} />
      <ConversationPlane />
    </Box>
  );
}
