import * as React from "react";
const { useEffect } = React;

import styled from "styled-components";

import useProductEditor from "../hooks/useProductEditor";

import DownloadCodeSetForm from "./DownloadCodeSetForm";
import ProductDetailEditForm from "./ProductDetailEditForm";
import ProductFileEditTable from "./ProductFileEditTable";

import {
  ProductDocument,
  ProductFile,
  ProductFileDisplayName
} from "../../domains/Product";

const Section = styled.div`
  margin-bottom: 30px;
`;

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
    updateProduct,
    updateProductIcon,
    addProductFile,
    updateProductFile,
    deleteProductFile,
    addDownloadCodeSet
  } = useProductEditor();

  useEffect(() => {
    watch(productId);
  }, []);

  const onProductFieldsUpdate = (
    values: Partial<ProductDocument>
  ): Promise<void> => {
    return updateProduct(values);
  };

  const onProductIconUpdate = (icon: File): Promise<void> => {
    return updateProductIcon(icon);
  };

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

  const onDownloadCodeSetAdd = (
    numberOfCodes: number,
    expiredAt: Date
  ): Promise<void> => {
    return addDownloadCodeSet(numberOfCodes, expiredAt);
  };

  return (
    <>
      {product && (
        <>
          <Section>
            <ProductDetailEditForm
              product={product}
              onUpdateFields={onProductFieldsUpdate}
              onUpdateIcon={onProductIconUpdate}
            />
          </Section>
          <Section>
            <ProductFileEditTable
              productFiles={product.productFiles}
              onAdd={onProductFileAdd}
              onUpdate={onProductFileUpdate}
              onDelete={onProductFileDelete}
            />
          </Section>
          <Section>
            <DownloadCodeSetForm
              product={product}
              onAdd={onDownloadCodeSetAdd}
            />
          </Section>
        </>
      )}
    </>
  );
};

export default ProductEditForm;
