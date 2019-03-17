import * as React from "react";

import * as QRCode from "qrcode";

interface QrCodeViewProps {
  text: string;
}

const QrCodeView: React.FC<QrCodeViewProps> = props => {
  const { text } = props;
  const [qrCodeUrl, setQrCodeUrl] = React.useState("");

  React.useEffect(() => {
    QRCode.toDataURL(text).then(url => {
      setQrCodeUrl(url);
    });
  });

  return <img alt="qrcode" src={qrCodeUrl} />;
};

export default QrCodeView;
