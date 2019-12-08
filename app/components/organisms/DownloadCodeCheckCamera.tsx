import * as React from "react";
const { useEffect, useRef, useState } = React;

import styled from "styled-components";

import useDownloadCodeVerifier from "../hooks/useDownloadCodeVerifier";
import useQrDecodeCamera from "../hooks/useQrDecodeCamera";

import QrCodeCheckDialog, { DecodeResult } from "./QrCodeCheckDialog";

const Root = styled.div``;

const Preview = styled.video`
  position: absolute;
  top: 0;

  width: 100vw;
  height: 100vh;

  z-index: -1;
`;

const DownloadCodeCheckCamera: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isDialogOpen, handleDialogOpen] = useState(false);
  const [decodeResult, setDecodeResult] = useState<DecodeResult>({
    checkList: {
      decoding: "progressing",
      format: "progressing",
      existing: "progressing"
    },
    product: {
      id: null
    }
  });

  const { checkFormat, checkLinkedProduct } = useDownloadCodeVerifier();
  const {
    startPreview,
    stopPreview,
    startLoopCapture,
    stopLoopCapture,
    detected: detectedQrcode
  } = useQrDecodeCamera(videoRef);

  useEffect(() => {
    Promise.resolve()
      .then(startPreview)
      .then(startLoopCapture);

    return function teardown() {
      stopPreview();
    };
  }, []);

  useEffect(() => {
    if (detectedQrcode) {
      stopLoopCapture();

      /**
       * Start verifying QRCode.
       */
      handleDialogOpen(true);

      /**
       * Check format
       */
      const downloadCode = checkFormat(detectedQrcode.data);

      if (downloadCode) {
        setDecodeResult(prev => ({
          ...prev,
          checkList: {
            ...prev.checkList,
            format: "valid"
          }
        }));
      } else {
        setDecodeResult(prev => ({
          ...prev,
          checkList: {
            ...prev.checkList,
            format: "invalid"
          }
        }));
        return;
      }

      /**
       * Check Linked Product.
       */
      checkLinkedProduct(downloadCode).then(product => {
        if (product) {
          setDecodeResult(prev => ({
            ...prev,
            checkList: {
              ...prev.checkList,
              existing: "valid"
            }
          }));
        } else {
          setDecodeResult(prev => ({
            ...prev,
            checkList: {
              ...prev.checkList,
              existing: "invalid"
            }
          }));
        }
      });
    }
  }, [detectedQrcode]);

  const handleCloseDialog = () => {
    handleDialogOpen(false);
    startLoopCapture();
  };

  return (
    <>
      <Root>
        <Preview ref={videoRef} autoPlay={true} />
      </Root>
      <QrCodeCheckDialog
        open={isDialogOpen}
        decodeResult={decodeResult}
        handleClose={handleCloseDialog}
      />
    </>
  );
};

export default DownloadCodeCheckCamera;
