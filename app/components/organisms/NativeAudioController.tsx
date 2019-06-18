import * as React from "react";
const { useRef, useCallback } = React;

import {
  IconButton,
  Snackbar,
  SnackbarContent,
  Slide
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";

interface AudioPlayerProps {
  open: boolean;
  src: string;
  onPlay: () => void;
  onPause: () => void;
  onClose: () => void;
}

const SlideTransition = (props: any) => {
  return <Slide {...props} direction="up" />;
};

const NativeAudioController: React.FC<AudioPlayerProps> = ({
  open,
  src,
  onPlay,
  onPause,
  onClose
}) => {
  const audioEl = useRef<HTMLAudioElement>(null);

  const onAudioPlay = useCallback(() => {
    onPlay();
  }, []);
  const onAudioPause = useCallback(() => {
    onPause();
  }, []);

  const audioRef = useCallback((el: HTMLAudioElement) => {
    if (el) {
      el.addEventListener("play", onAudioPlay);
      el.addEventListener("pause", onAudioPause);
    }

    if (!el && audioEl.current /* prevAudioEl */) {
      audioEl.current.removeEventListener("play", onAudioPlay);
      audioEl.current.removeEventListener("pause", onAudioPause);
    }

    // save previous element
    audioEl.current = el;
  }, []);

  const onCloseClicked = useCallback(() => {
    audioEl.current.pause();
    onClose();
  }, [onClose, audioEl]);

  return (
    <Snackbar open={open} TransitionComponent={SlideTransition}>
      <SnackbarContent
        style={{
          backgroundColor: "white"
        }}
        message={
          <audio autoPlay={true} controls={open} src={src} ref={audioRef} />
        }
        action={[
          <IconButton key="close" onClick={onCloseClicked}>
            <CloseIcon />
          </IconButton>
        ]}
      />
    </Snackbar>
  );
};

export default NativeAudioController;
