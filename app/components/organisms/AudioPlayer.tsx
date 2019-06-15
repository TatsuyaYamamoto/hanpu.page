import * as React from "react";

import { Paper, LinearProgress, IconButton } from "@material-ui/core";
import PlayIcon from "@material-ui/icons/PlayArrow";
import PauseIcon from "@material-ui/icons/Pause";

interface AudioPlayerProps {
  currentSec: number;
  totalSec: number;
  playing: boolean;
  onPlay: () => Promise<void>;
  onPause: () => void;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({
  currentSec,
  totalSec,
  playing,
  onPlay,
  onPause
}) => {
  const progress = (currentSec / totalSec) * 100;

  return (
    <Paper>
      {/* TODO replace Slider */}
      <LinearProgress variant="determinate" value={progress} />
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
