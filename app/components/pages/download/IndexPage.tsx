import * as React from "react";
import { RouteComponentProps } from "react-router-dom";

import { DownloadCodeSet } from "../../../domains/DownloadCodeSet";
import { DownloaderContext } from "../../utils/Downloader";

const IndexPage: React.FC<RouteComponentProps<{ code?: string }>> = props => {
  const downloadCode = props.match.params.code || "";
  const { addProduct } = React.useContext(DownloaderContext);

  const submit = () => {
    const code = (document.getElementById("code") as any).value;

    DownloadCodeSet.verify(code).then(p => {
      // TODO
      // tslint:disable:no-console
      console.log(p);

      if (p) {
        addProduct(p);
        props.history.push(`/download/dashboard`);
      }
    });
  };

  React.useEffect(() => {
    (document.getElementById("code") as any).value = downloadCode;
  }, []);

  return (
    <>
      DownloadPage
      <input type="text" id="code" />
      <button onClick={submit}>submit</button>
    </>
  );
};

export default IndexPage;
