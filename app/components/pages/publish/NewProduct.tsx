import * as React from "react";

import { Product } from "../../../domains/Product";

const NewProductPage = () => {
  const submit = () => {
    const name = (document.getElementById("name") as any).value;
    const description = (document.getElementById("description") as any).value;

    Product.createNew({
      name,
      description
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
      <button onClick={submit}>submit</button>
    </>
  );
};

export default NewProductPage;
