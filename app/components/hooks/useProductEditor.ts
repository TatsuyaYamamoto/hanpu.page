import { useEffect, useState } from "react";
import { storage } from "firebase";

import {
  Product,
  ProductDescription,
  ProductDocument,
  ProductFile,
  ProductFileDisplayName,
  ProductName
} from "../../domains/Product";

const useProductEditor = (productId: string) => {
  const [product, setProduct] = useState<Product | null>(null);

  const addProduct = (
    name: ProductName,
    description: ProductDescription
  ): Promise<void> => {
    return Product.createNew({ name, description });
  };

  const updateProduct = (values: Partial<ProductDocument>) => {
    if (!product) {
      throw new Error("unexpected error. no product is ready.");
    }

    // TODO validate provided params

    return product
      .partialUpdateFields(values)
      .then(() => Product.getById(productId))
      .then(newProduct => {
        setProduct(newProduct);
      });
  };

  const updateProductIcon = (icon: File): Promise<void> => {
    if (!product) {
      throw new Error("unexpected error. no product is ready.");
    }

    // TODO validate provided params

    const { promise } = product.uploadIconToStorage(icon);

    return promise
      .then(() => Product.getById(productId))
      .then(newProduct => {
        setProduct(newProduct);
      });
  };

  const addProductFile = (
    displayName: ProductFileDisplayName,
    file: File
  ): {
    task: storage.UploadTask;
    promise: Promise<void>;
  } => {
    if (!product) {
      throw new Error("unexpected error. no product is ready.");
    }

    const { task, promise } = product.addProductFile(displayName, file);
    const refreshPromise = promise
      .then(() => Product.getById(productId))
      .then(newProduct => {
        setProduct(newProduct);
      });

    return {
      task,
      promise: refreshPromise
    };
  };

  const updateProductFile = (
    id: string,
    edited: Partial<ProductFile>
  ): Promise<void> => {
    if (!product) {
      throw new Error("unexpected error. no product is ready.");
    }

    return product
      .partialUpdateFile(id, edited)
      .then(() => Product.getById(productId))
      .then(newProduct => {
        setProduct(newProduct);
      });
  };

  const deleteProductFile = (productFileId: string): Promise<void> => {
    if (!product) {
      throw new Error("unexpected error. no product is ready.");
    }

    return product
      .deleteProductFile(productFileId)
      .then(() => Product.getById(productId))
      .then(newProduct => {
        setProduct(newProduct);
      });
  };

  useEffect(() => {
    if (!productId) {
      setProduct(null);
      return;
    }

    Product.getById(productId).then(p => {
      setProduct(p);
    });
  }, [productId]);

  return {
    product,
    addProduct,
    updateProduct,
    updateProductIcon,
    addProductFile,
    updateProductFile,
    deleteProductFile
  };
};

export default useProductEditor;
