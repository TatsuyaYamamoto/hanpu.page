import React, { useEffect, useRef, useState } from "react";

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
    detail: {
      decodedText: null,
      productId: null,
      productName: null,
      downloadCodeCreatedAt: null,
      downloadCodeExpireAt: null
    }
  });

  const { checkFormat, checkLinkedResources } = useDownloadCodeVerifier();
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
    // TODO
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (detectedQrcode) {
      stopLoopCapture();

      /**
       * Start verifying QRCode.
       */
      handleDialogOpen(true);
      setDecodeResult(prev => ({
        ...prev,
        checkList: {
          ...prev.checkList,
          decoding: "valid"
        },
        detail: {
          ...prev.detail,
          decodedText: detectedQrcode.data
        }
      }));

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
            format: "invalid",
            existing: "suspended"
          }
        }));
        return;
      }

      /**
       * Check Linked Product.
       */
      checkLinkedResources(downloadCode).then(data => {
        if (data) {
          const {
            productId,
            productName,
            downloadCodeCreatedAt,
            downloadCodeExpireAt
          } = data;

          setDecodeResult(prev => ({
            ...prev,
            checkList: {
              ...prev.checkList,
              existing: "valid"
            },
            detail: {
              ...prev.detail,
              productId,
              productName,
              downloadCodeCreatedAt,
              downloadCodeExpireAt
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
    // TODO
    // eslint-disable-next-line
  }, [detectedQrcode]);

  const handleCloseDialog = () => {
    handleDialogOpen(false);
    setDecodeResult({
      checkList: {
        decoding: "progressing",
        format: "progressing",
        existing: "progressing"
      },
      detail: {
        decodedText: null,
        productId: null,
        productName: null,
        downloadCodeCreatedAt: null,
        downloadCodeExpireAt: null
      }
    });
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
