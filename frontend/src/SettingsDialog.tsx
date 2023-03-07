import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { GetSettings, SaveSettings } from "../wailsjs/go/main/App";

type SettingsDialogProps = {
  close: () => void;
};

interface Settings {
  apiKey: string;
  proxy: string;
}

function SettingsDialog(props: SettingsDialogProps) {
  const [settings, setSettings] = useState<Settings>({ apiKey: "", proxy: "" });

  useEffect(() => {
    GetSettings().then(setSettings);
  }, []);

  return (
    <Dialog open={true} fullWidth={true}>
      <DialogTitle>Settings</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          label="ApiKey"
          fullWidth
          variant="standard"
          value={settings.apiKey}
          onChange={(event) =>
            setSettings({ ...settings, apiKey: event.target.value })
          }
        />
        <TextField
          autoFocus
          label="Proxy(optional)"
          fullWidth
          variant="standard"
          value={settings.proxy}
          onChange={(event) =>
            setSettings({ ...settings, proxy: event.target.value })
          }
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={props.close}>Cancel</Button>
        <Button onClick={() => SaveSettings(settings).then(props.close)}>
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default SettingsDialog