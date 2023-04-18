import { GetSettings, SaveSettings } from "../wailsjs/go/main/App";
import {
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slider,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";

type SettingsDialogProps = {
  close: () => void;
};

interface Settings {
  apiKey: string;
  proxy: string;
  temperature: number;
}

function SettingsDialog(props: SettingsDialogProps) {
  const [settings, setSettings] = useState<Settings>({
    apiKey: "",
    proxy: "",
    temperature: 1,
  });

  useEffect(() => {
    GetSettings().then(setSettings);
  }, []);

  return (
    <Dialog open={true} fullWidth={true}>
      <DialogTitle>Settings</DialogTitle>
      <DialogContent>
        <Card sx={{ p: "1rem", mt: "1rem" }}>
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
        </Card>
        <Card sx={{ p: "1rem", mt: "1rem" }}>
          <Typography>Temperature</Typography>
          <Slider
            value={settings.temperature}
            onChange={(event, newValue) => {
              setSettings({ ...settings, temperature: newValue as number });
            }}
            min={0.1}
            max={2}
            step={0.1}
            valueLabelDisplay="auto"
          />
        </Card>
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

export default SettingsDialog;
