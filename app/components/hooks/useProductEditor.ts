import { useEffect, useState, useCallback } from "react";
import { firestore, storage, app as _app } from "firebase";
type FirebaseApp = _app.App;
type DocumentReference = firestore.DocumentReference;

import useFirebase from "./useFirebase";
import {
  Product,
  ProductDescription,
  ProductDocument,
  ProductFile,
  ProductFileDisplayName,
  ProductName
} from "../../domains/Product";

const useProductEditor = (productId: string) => {
  const { app: firebaseApp } = useFirebase();
  const [product, setProduct] = useState<Product | null>(null);

  /**
   * @param nullableProduct
   * @private
   */
  const shouldProductRefLoaded = (nullableProduct: Product | null): Product => {
    if (!nullableProduct) {
      throw new Error("unexpected error. no product is ready.");
    }

    return nullableProduct;
  };

  /**
   * @param nullableApp
   * @private
   */
  const shouldAppInitialized = (nullableApp?: FirebaseApp): FirebaseApp => {
    if (!nullableApp) {
      throw new Error("FirebaseApp has not been initialized yet.");
    }

    return nullableApp;
  };

  const addProduct = useCallback(
    async (
      name: ProductName,
      description: ProductDescription
    ): Promise<DocumentReference | void> => {
      if (!firebaseApp) {
        return;
      }

      return Product.createNew({ name, description }, firebaseApp.firestore());
    },
    [firebaseApp]
  );

  const updateProduct = useCallback(
    async (values: Partial<ProductDocument>) => {
      const loadedProduct = shouldProductRefLoaded(product);
      const initializedApp = shouldAppInitialized(firebaseApp);

      // TODO validate provided params

      return loadedProduct
        .partialUpdateFields(values)
        .then(() => Product.getById(productId, initializedApp.firestore()))
        .then(newProduct => {
          setProduct(newProduct);
        });
    },
    [product, firebaseApp]
  );

  const updateProductIcon = useCallback(
    async (icon: File) => {
      const loadedProduct = shouldProductRefLoaded(product);
      const initializedApp = shouldAppInitialized(firebaseApp);

      // TODO validate provided params

      const { promise } = loadedProduct.uploadIconToStorage(icon);

      return promise
        .then(() => Product.getById(productId, initializedApp.firestore()))
        .then(newProduct => {
          setProduct(newProduct);
        });
    },
    [firebaseApp]
  );

  const addProductFile = useCallback(
    (
      displayName: ProductFileDisplayName,
      file: File
    ): {
      task: storage.UploadTask;
      promise: Promise<void>;
    } => {
      const loadedProduct = shouldProductRefLoaded(product);
      const initializedApp = shouldAppInitialized(firebaseApp);

      const { task, promise } = loadedProduct.addProductFile(displayName, file);
      const refreshPromise = promise
        .then(() => Product.getById(productId, initializedApp.firestore()))
        .then(newProduct => {
          setProduct(newProduct);
        });

      return {
        task,
        promise: refreshPromise
      };
    },
    [firebaseApp]
  );

  const updateProductFile = useCallback(
    (id: string, edited: Partial<ProductFile>): Promise<void> => {
      const loadedProduct = shouldProductRefLoaded(product);
      const initializedApp = shouldAppInitialized(firebaseApp);

      return loadedProduct
        .partialUpdateFile(id, edited)
        .then(() => Product.getById(productId, initializedApp.firestore()))
        .then(newProduct => {
          setProduct(newProduct);
        });
    },
    [firebaseApp]
  );

  const deleteProductFile = useCallback(
    async (productFileId: string) => {
      const loadedProduct = shouldProductRefLoaded(product);
      const initializedApp = shouldAppInitialized(firebaseApp);

      return loadedProduct
        .deleteProductFile(productFileId)
        .then(() => Product.getById(productId, initializedApp.firestore()))
        .then(newProduct => {
          setProduct(newProduct);
        });
    },
    [firebaseApp]
  );

  useEffect(() => {
    if (!productId) {
      setProduct(null);
      return;
    }

    if (!firebaseApp) {
      // TODO
      // tslint:disable-next-line
      console.info("firebase app has not been initialized.");
      return;
    }

    Promise.resolve()
      .then(() => Product.getById(productId, firebaseApp.firestore()))
      .then(p => {
        setProduct(p);
      });
  }, [productId, firebaseApp]);

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
