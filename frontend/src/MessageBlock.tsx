import "./styles/markdown.css";
import { Divider, ListItem, Typography } from "@mui/material";
import "highlight.js/styles/github.css";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

export const roleSystem = "system";
export const roleUser = "user";
export const roleAssistant = "assistant";

export interface Message {
  role: string;
  content: string;
}

type MessageProps = {
  message: Message;
};

export default function MessageBlock(props: MessageProps) {
  return (
    <ListItem
      disablePadding
      sx={{
        backgroundColor: (theme) => {
          if (props.message.role == roleAssistant)
            return theme.palette.grey[300];
          if (props.message.role == roleSystem) return theme.palette.grey[200];
          return theme.palette.grey[100];
        },
      }}
    >
      <Typography
        sx={{
          width: "100%",
          maxWidth: "100%",
          paddingX: "12%",
          paddingY: "1.5rem",
        }}
      >
        {props.message.role == roleAssistant ? (
          <ReactMarkdown
            className={"markdown-body"}
            children={props.message.content}
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw, rehypeHighlight]}
          />
        ) : (
          <pre style={{ whiteSpace: "pre-wrap" }}>{props.message.content}</pre>
        )}
        {props.message.role == roleSystem && <Divider />}
      </Typography>
    </ListItem>
  );
}
