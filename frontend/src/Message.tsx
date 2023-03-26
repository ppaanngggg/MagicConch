import { ListItem, Typography } from "@mui/material";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";

export interface Message {
  role: string;
  content: string;
}

type MessageProps = {
  message: Message;
};

export function MessageBlock(props: MessageProps) {
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
