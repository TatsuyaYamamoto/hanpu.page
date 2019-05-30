import * as React from "react";
import { RouteComponentProps } from "react-router-dom";

import Container from "@material-ui/core/Container";

import ProductFileEditTable from "../../organisms/ProductFileEditTable";
import ProductDetailEditForm from "../../organisms/ProductDetailEditForm";

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
    <Container>
      <button onClick={logout}>logout</button>

      {product && (
        <>
          <ProductDetailEditForm product={product} />
          <ProductFileEditTable product={product} />
        </>
      )}
    </Container>
  );
};

export default ProductListPage;
