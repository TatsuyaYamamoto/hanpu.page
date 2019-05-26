import * as React from "react";
import { RouteComponentProps } from "react-router-dom";

import { FirebaseAuthSessionContext } from "../../utils/FirebaseAuthSession";

import { Product } from "../../../domains/Product";

const ProductListPage: React.FC<
  RouteComponentProps<{ id: string }>
> = props => {
  const productId = props.match.params.id;
  const { logout } = React.useContext(FirebaseAuthSessionContext);
  const [product, setProduct] = React.useState<Product>(null);

  React.useEffect(() => {
    // TODO delete this logic!!
    setTimeout(() => {
      Product.getById(productId).then(p => {
        setProduct(p);
      });
    }, 1000);
  }, []);

  return (
    <>
      Product ID: {productId}
      {product && (
        <p>
          name: <div>{product.name}</div>
          desc: <div>{product.description}</div>
          created: <div>{product.createdAt.toDateString()}</div>
        </p>
      )}
      <button onClick={logout}>logout</button>
    </>
  );
};

export default ProductListPage;
