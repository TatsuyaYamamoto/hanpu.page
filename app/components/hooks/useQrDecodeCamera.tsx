import { RefObject, useRef, useState } from "react";

import jsQR, { QRCode } from "jsqr";

const useQrDecodeCamera = (ref: RefObject<HTMLVideoElement>) => {
  const videoStreamRef = useRef<MediaStream | null>(null);
  const internalId = useRef<number | null>(null);

  const [detected, setDetected] = useState<QRCode | null>(null);

  /**
   * @public
   */
  const startPreview = async () => {
    const videoRef = ref.current;

    if (!videoRef) {
      return;
    }

    stopPreview();

    const devices = await navigator.mediaDevices.enumerateDevices();

    console.log("media devices", devices);

    const videoDevices = devices.filter(deviceInfo => {
      return deviceInfo.kind === "videoinput";
    });

    console.log("video devices", videoDevices);

    // TODO: make handlable video inputs
    const mediaStream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        deviceId: videoDevices[0].deviceId
      }
    });

    console.log("mediaStream", mediaStream);

    // https://developer.mozilla.org/ja/docs/Web/API/URL/createObjectURL#Usage_notes
    // videoRef.src = window.URL.createObjectURL(mediaStream);

    return new Promise(resolve => {
      videoRef.addEventListener("loadedmetadata", () => {
        const { videoWidth, videoHeight } = videoRef;
        const videoDeviceRatio = videoHeight / videoWidth;

        if (1 < videoDeviceRatio) {
          // video source is "Portrait".

          videoRef.style.width = `100vw`;
          videoRef.style.height = `calc(100vw * ${videoDeviceRatio})`;
        } else {
          // video source is "Landscape".

          videoRef.style.width = `calc(100vh / ${videoDeviceRatio})`;
          videoRef.style.height = `100vh`;
        }

        console.log(
          `start preview. videoWidth: ${videoWidth}, videoHight: ${videoHeight}`
        );

        resolve();
      });

      videoStreamRef.current = mediaStream;
      videoRef.srcObject = mediaStream;
    });
  };

  /**
   * @public
   */
  const stopPreview = () => {
    const videoStream = videoStreamRef.current;

    if (!videoStream) {
      return;
    }

    console.log("stop loop capture.");
    videoStream.getVideoTracks()[0].stop();

    if (videoStream.active) {
      console.error("");
    } else {
      console.log("stop preview.");
    }
  };

  const startLoopCapture = () => {
    const decode = () => {
      const { data, width, height } = snapshot();
      const qrcode = jsQR(data, width, height);

      if (qrcode) {
        setDetected(qrcode);
      } else {
        console.log("QRCode not found.");
      }
    };

    setDetected(null);
    internalId.current = setInterval(decode, 1000);

    console.log("start loop capture.");
  };

  const stopLoopCapture = () => {
    if (!internalId.current) {
      return;
    }

    console.log("stop loop capture.");
    clearInterval(internalId.current);

    internalId.current = null;
  };

  /**
   * @private
   */
  const snapshot = (): ImageData => {
    const videoRef = ref.current;

    if (!videoRef) {
      throw new Error("");
    }

    const { videoWidth, videoHeight } = videoRef;

    const canvasElement = document.createElement("canvas");
    canvasElement.width = videoWidth;
    canvasElement.height = videoHeight;
    const context = canvasElement.getContext("2d");

    if (!context) {
      throw new Error("");
    }

    context.drawImage(videoRef, 0, 0, videoWidth, videoHeight);
    return context.getImageData(0, 0, videoWidth, videoHeight);
  };

  return {
    startPreview,
    stopPreview,
    startLoopCapture,
    stopLoopCapture,
    detected
  };
};

export default useQrDecodeCamera;
