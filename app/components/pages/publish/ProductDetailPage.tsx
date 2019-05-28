import * as React from "react";
import { RouteComponentProps } from "react-router-dom";
import ProductFileEditTable from "../../organisms/ProductFileEditTable";

import { FirebaseAuthSessionContext } from "../../utils/FirebaseAuthSession";

import { Product } from "../../../domains/Product";
import { DownloadCodeSet } from "../../../domains/DownloadCodeSet";

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

  const createDlCodeSet = () => {
    const ref = Product.getDocRef(product.id);
    DownloadCodeSet.create(ref, 2).then(set => {
      //
    });
  };

  return (
    <>
      Product ID: {productId}
      <button onClick={createDlCodeSet}>Create DLCode Set</button>
      <button onClick={logout}>logout</button>
      {product && (
        <>
          <p>
            name: <div>{product.name}</div>
            desc: <div>{product.description}</div>
            created: <div>{product.createdAt.toDateString()}</div>
          </p>
          <ProductFileEditTable product={product} />
        </>
      )}
    </>
  );
};

export default ProductListPage;
