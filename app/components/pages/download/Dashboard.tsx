import * as React from "react";
import { RouteComponentProps } from "react-router-dom";

import { DownloaderContext } from "../../utils/Downloader";

const DownloadDashboardPage: React.FC<
  RouteComponentProps<{ code?: string }>
> = props => {
  const { products } = React.useContext(DownloaderContext);

  return (
    <>
      DownloadDashboard
      <ul>
        {products.map(p => (
          <li key={p.id}>
            <div>{p.name}</div>
            <div>{p.description}</div>
          </li>
        ))}
      </ul>
    </>
  );
};

export default DownloadDashboardPage;
