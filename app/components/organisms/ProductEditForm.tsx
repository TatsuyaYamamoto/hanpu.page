import * as React from "react";
const { useEffect } = React;

import useProductEditor from "../hooks/useProductEditor";

import DownloadCodeSetForm from "./DownloadCodeSetForm";
import ProductDetailEditForm from "./ProductDetailEditForm";
import ProductFileEditTable from "./ProductFileEditTable";

import { ProductFile, ProductFileDisplayName } from "../../domains/Product";

interface ProductDetailEditFormProps {
  productId: string;
}

/**
 * Productの詳細、ProductFile、DownloadCodeの編集を行うForm
 *
 * @param product
 * @constructor
 */
const ProductEditForm: React.FC<ProductDetailEditFormProps> = ({
  productId
}) => {
  const {
    watch,
    product,
    addProductFile,
    updateProductFile,
    deleteProductFile
  } = useProductEditor();

  useEffect(() => {
    watch(productId);
  }, []);

  const onProductFileAdd = (
    displayFileName: ProductFileDisplayName,
    file: File
  ): Promise<void> => {
    const { promise } = addProductFile(displayFileName, file);

    return promise;
  };

  const onProductFileUpdate = (
    productFileId: string,
    edited: Partial<ProductFile>
  ): Promise<void> => {
    return updateProductFile(productFileId, edited);
  };

  const onProductFileDelete = (id: string): Promise<void> => {
    return deleteProductFile(id);
  };

  return (
    <>
      {product && (
        <>
          <ProductDetailEditForm product={product} />
          <ProductFileEditTable
            productFiles={product.productFiles}
            onAdd={onProductFileAdd}
            onUpdate={onProductFileUpdate}
            onDelete={onProductFileDelete}
          />
          <DownloadCodeSetForm product={product} />
        </>
      )}
    </>
  );
};

export default ProductEditForm;
