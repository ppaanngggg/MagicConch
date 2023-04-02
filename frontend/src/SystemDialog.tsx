import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useState } from "react";

type SystemDialogProps = {
  updateSystem: (s: string) => void;
  close: () => void;
};

export default function SystemDialog(props: SystemDialogProps) {
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
        <Button onClick={props.close}>Cancel</Button>
        <Button
          onClick={() => {
            props.updateSystem(system);
            props.close();
          }}
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
}
