import * as React from "react";
import { FirebaseAuthSessionContext } from "../../utils/FirebaseAuthSession";

const DashboardPage = () => {
  const { logout } = React.useContext(FirebaseAuthSessionContext);

  return (
    <>
      DashboardPage!
      <button onClick={logout}>logout</button>
    </>
  );
};

export default DashboardPage;
