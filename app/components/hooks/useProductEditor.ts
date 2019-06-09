import { storage } from "firebase";
import { useEffect, useState } from "react";
import {
  Product,
  ProductDescription,
  ProductDocument,
  ProductFile,
  ProductFileDisplayName,
  ProductName
} from "../../domains/Product";

const useProductEditor = () => {
  const [productId, setProductId] = useState<string | null>(null);
  const [product, setProduct] = useState<Product | null>(null);

  const watch = (id: string) => {
    setProductId(id);
  };

  const unwatch = () => {
    setProductId(null);
    setProduct(null);
  };

  const addProduct = (
    name: ProductName,
    description?: ProductDescription
  ): Promise<void> => {
    return Product.createNew({ name, description });
  };

  const updateProduct = async (values: Partial<ProductDocument>) => {
    await product.partialUpdateFields(values);
    const updated = await Product.getById(productId);
    setProduct(updated);
  };

  const addProductFile = (
    displayName: ProductFileDisplayName,
    file: File
  ): {
    task: storage.UploadTask;
    promise: Promise<void>;
  } => {
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
    return product
      .partialUpdateFile(id, edited)
      .then(() => Product.getById(productId))
      .then(newProduct => {
        setProduct(newProduct);
      });
  };

  const deleteProductFile = (productFileId: string): Promise<void> => {
    return product
      .deleteProductFile(productFileId)
      .then(() => Product.getById(productId))
      .then(newProduct => {
        setProduct(newProduct);
      });
  };

  useEffect(() => {
    return function cleanup() {
      unwatch();
    };
  }, []);

  useEffect(() => {
    if (productId) {
      Product.getById(productId).then(p => {
        setProduct(p);
      });
    }
  }, [productId]);

  return {
    product,
    watch,
    addProduct,
    addProductFile,
    updateProductFile,
    deleteProductFile
  };
};

export default useProductEditor;
