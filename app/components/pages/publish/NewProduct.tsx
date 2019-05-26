import * as React from "react";
import { FirebaseAuthSessionContext } from "../../utils/FirebaseAuthSession";

import { Product } from "../../../domains/Product";

const NewProductPage = () => {
  const { logout } = React.useContext(FirebaseAuthSessionContext);
  const submit = () => {
    const name = document.getElementById("name").value;
    const description = document.getElementById("description").value;
    const privateNote = document.getElementById("privateNote").value;

    Product.createNew({
      name,
      description,
      privateNote
    });
  };

  return (
    <>
      New Product!
      <p>
        name <input type="text" id="name" />
      </p>
      <p>
        description <input type="text" id="description" />
      </p>
      <p>
        private note
        <input type="text" id="privateNote" />
      </p>
      <button onClick={submit}>submit</button>
      <button onClick={logout}>logout</button>
    </>
  );
};

export default NewProductPage;
