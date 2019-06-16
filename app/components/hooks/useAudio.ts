// TODO
// tslint:disable:no-console
import { useState, useEffect } from "react";

const useAudio = () => {
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [currentTime, setCurrentTime] = useState(null);
  const [duration, setDuration] = useState(null);
  const [state, setState] = useState<"none" | "loading" | "playing">("none");

  /**
   * 再生が始まった。
   * @link https://developer.mozilla.org/ja/docs/Web/API/HTMLMediaElement/play_event
   */
  const onPlay = () => {
    console.log("audio#play");
  };

  /**
   * 一時的なデータの不足により、再生が停止した。
   * @link https://developer.mozilla.org/ja/docs/Web/API/HTMLMediaElement/waiting_event
   */
  const onWaiting = () => {
    console.log("audio#wating");
  };

  /**
   * ブラウザーがメディアを再生できるようになったものの、追加のバッファリングのために停止することなくメディアの最後まで再生するには、充分なデータが読み込まれていないとみられる。
   * @link https://developer.mozilla.org/ja/docs/Web/API/HTMLMediaElement/canplay_event
   */
  const onCanPlay = () => {
    console.log("audio#canplay");
  };

  /**
   * ブラウザーがコンテンツのバッファリングのために停止することなく最後までメディアを再生することができるとみられる。
   * @link https://developer.mozilla.org/ja/docs/Web/API/HTMLMediaElement/canplaythrough_event
   */
  const onCanPlayThrough = () => {
    console.log("audio#canplaythrough");
  };

  /**
   * データがなくなったために一時停止または遅延した後で、再生の再開の準備ができた。
   * @link https://developer.mozilla.org/ja/docs/Web/API/HTMLMediaElement/playing_event
   */
  const onPlaying = () => {
    console.log("audio#playing");
    setState("playing");
  };

  /**
   * 再生が一時停止した。
   * @link https://developer.mozilla.org/ja/docs/Web/API/HTMLMediaElement/pause_event
   */
  const onPause = () => {
    //
  };

  /**
   * duration 属性が更新された。
   * @link https://developer.mozilla.org/ja/docs/Web/API/HTMLMediaElement/durationchange_event
   */
  const onDurationChange = (e: Event) => {
    setDuration((e.target as HTMLAudioElement).duration);
  };

  /**
   * currentTime 属性で示されている時刻が更新された。
   * @link https://developer.mozilla.org/ja/docs/Web/API/HTMLMediaElement/timeupdate_event
   */
  const onTimeupdate = (e: Event) => {
    setCurrentTime((e.target as HTMLAudioElement).currentTime);
  };

  useEffect(() => {
    return function cleanup() {
      if (audio) {
        audio.removeEventListener("play", onPlay);
        audio.removeEventListener("waiting", onWaiting);
        audio.removeEventListener("canplay", onCanPlay);
        audio.removeEventListener("canplaythrough", onCanPlayThrough);
        audio.removeEventListener("playing", onPlaying);
        audio.removeEventListener("timeupdate", onTimeupdate);
      }
    };
  }, [audio]);

  const play = (url?: string): Promise<void> => {
    if (!url) {
      return audio.play();
    }

    if (audio) {
      release();
    }

    const a = new Audio(url);
    a.addEventListener("play", onPlay);
    a.addEventListener("waiting", onWaiting);
    a.addEventListener("canplay", onCanPlay);
    a.addEventListener("canplaythrough", onCanPlayThrough);
    a.addEventListener("playing", onPlaying);
    a.addEventListener("pause", onPause);
    a.addEventListener("durationchange", onDurationChange);
    a.addEventListener("timeupdate", onTimeupdate);

    setAudio(a);

    return a.play();
  };

  const pause = (): void => {
    audio.pause();
  };

  const changeTime = (time: number) => {
    audio.currentTime = time;
  };

  const release = () => {
    audio.pause();
    setAudio(null);
    setState("none");
  };

  return {
    play,
    pause,
    changeTime,
    release,
    state,
    currentTime,
    duration
  };
};

export default useAudio;
