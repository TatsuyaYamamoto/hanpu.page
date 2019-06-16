import * as React from "react";
const { useState } = React;

import { Paper, IconButton } from "@material-ui/core";
import PlayIcon from "@material-ui/icons/PlayArrow";
import PauseIcon from "@material-ui/icons/Pause";
import CloseIcon from "@material-ui/icons/Close";

// @material-ui/lab#Sliderがあるし、こっちの方が動きが滑らかだけれど、上端の謎のmergin(pagging?)が消せないため、こっちを使う
import Slider, { SliderProps } from "rc-slider";
import "rc-slider/assets/index.css";

import styled from "styled-components";

interface AudioPlayerProps {
  currentSec: number;
  totalSec: number;
  playing: boolean;
  onPlay: () => Promise<void>;
  onPause: () => void;
  onChangeTime: (time: number) => void;
  onClose: () => void;
}

const StyledSlider: React.FC<SliderProps> = styled(Slider)`
  && {
    padding: 0;
  }
`;

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

  const onSliderChange = (value: number) => {
    setHandlingProgress(value);
  };
  const onSliderAfterChange = (value: number) => {
    setHandlingProgress(null);

    const time = (totalSec * value) / 100;
    onChangeTime(time);
  };

  return (
    <Paper>
      <StyledSlider
        min={0}
        max={100}
        value={indicatingProgress}
        onChange={onSliderChange}
        onAfterChange={onSliderAfterChange}
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
