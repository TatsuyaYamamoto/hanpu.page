import * as React from "react";
const { useState } = React;

import { Paper, IconButton } from "@material-ui/core";
import Slider from "@material-ui/lab/Slider";
import PlayIcon from "@material-ui/icons/PlayArrow";
import PauseIcon from "@material-ui/icons/Pause";
import CloseIcon from "@material-ui/icons/Close";

interface AudioPlayerProps {
  currentSec: number;
  totalSec: number;
  playing: boolean;
  onPlay: () => Promise<void>;
  onPause: () => void;
  onChangeTime: (time: number) => void;
  onClose: () => void;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({
  currentSec,
  totalSec,
  playing,
  onPlay,
  onPause,
  onChangeTime,
  onClose
}) => {
  const audioProgress = (currentSec / totalSec) * 100;
  const [handlingProgress, setHandlingProgress] = useState<number | null>(null);
  const indicatingProgress = handlingProgress || audioProgress;
  const handleChange = (event: React.ChangeEvent<{}>, value: number) => {
    setHandlingProgress(value);
  };
  const onChangeCommitted = (event: React.ChangeEvent<{}>, value: number) => {
    setHandlingProgress(null);

    const time = (totalSec * value) / 100;
    onChangeTime(time);
  };

  return (
    <Paper>
      <Slider
        value={indicatingProgress}
        onChange={handleChange}
        onChangeCommitted={onChangeCommitted}
      />
      <IconButton onClick={onClose}>
        <CloseIcon />
      </IconButton>

      {playing ? (
        <IconButton onClick={onPause}>
          <PauseIcon />
        </IconButton>
      ) : (
        <IconButton onClick={onPlay}>
          <PlayIcon />
        </IconButton>
      )}
    </Paper>
  );
};

export default AudioPlayer;
