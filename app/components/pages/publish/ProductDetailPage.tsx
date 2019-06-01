import * as React from "react";
import { RouteComponentProps } from "react-router-dom";

import AppBar from "../../organisms/AppBar";
import ProductFileEditTable from "../../organisms/ProductFileEditTable";
import ProductDetailEditForm from "../../organisms/ProductDetailEditForm";
import DownloadCodeSetForm from "../../organisms/DownloadCodeSetForm";

import { Product } from "../../../domains/Product";

const ProductDetailPage: React.FC<
  RouteComponentProps<{ id: string }>
> = props => {
  const productId = props.match.params.id;
  const [product, setProduct] = React.useState<Product>(null);

  React.useEffect(() => {
    // TODO delete this logic!!
    setTimeout(() => {
      Product.getById(productId).then(p => {
        setProduct(p);
      });
    }, 1000);
  }, []);

  const onBack = () => {
    props.history.goBack();
  };

  return (
    <>
      <AppBar title={`Detail ID: ${productId}`} onBack={onBack} />
      {product && (
        <>
          <ProductDetailEditForm product={product} />
          <ProductFileEditTable product={product} />
          <DownloadCodeSetForm product={product} />
        </>
      )}
    </>
  );
};

export default ProductDetailPage;
