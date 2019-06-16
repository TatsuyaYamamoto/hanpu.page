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

import { PlayerState } from "../hooks/useAudio";

interface AudioPlayerProps {
  currentSec: number;
  totalSec: number;
  state: PlayerState;
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
  state,
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

      {state === "playing" ? (
        <IconButton onClick={onPause}>
          <PauseIcon />
        </IconButton>
      ) : state === "ready" ? (
        <IconButton onClick={onPlay}>
          <PlayIcon />
        </IconButton>
      ) : (
        <IconButton disabled={true}>
          <PlayIcon />
        </IconButton>
      )}
    </Paper>
  );
};

export default AudioPlayer;
