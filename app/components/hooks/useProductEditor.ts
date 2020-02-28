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
import useDlCodeUser from "./useDlCodeUser";

const useProductEditor = (productId?: string) => {
  const { app: firebaseApp } = useFirebase();
  const { user } = useDlCodeUser();
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
    ): Promise<[void, (DocumentReference | void)]> => {
      if (!firebaseApp || !user) {
        throw new Error(
          "unexpected. firebase and user haven't benn initialized."
        );
      }

      const {
        current: currentRegisteredCount,
        limit: maxRegisteredCount
      } = user.user.counters.product;

      if (maxRegisteredCount <= currentRegisteredCount) {
        throw new Error(
          `exceeded. max count. current: ${currentRegisteredCount}, limit: ${maxRegisteredCount}`
        );
      }

      // current countを改めて計算する、冗長だけれど、、
      const current = await Product.getCount(user.uid, firebaseApp.firestore());

      // TODO アトミックな処理に実装を変更する
      return Promise.all([
        user.editCounter("product", current + 1, firebaseApp.firestore()),
        Product.createNew({ name, description }, firebaseApp.firestore())
      ]);
    },
    [firebaseApp, user]
  );

  const updateProduct = useCallback(
    async (values: Partial<ProductDocument>) => {
      const loadedProduct = shouldProductRefLoaded(product);
      const initializedApp = shouldAppInitialized(firebaseApp);

      // TODO validate provided params

      return loadedProduct
        .partialUpdateFields(values)
        .then(() =>
          Product.getById(loadedProduct.id, initializedApp.firestore())
        )
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
        .then(() =>
          Product.getById(loadedProduct.id, initializedApp.firestore())
        )
        .then(newProduct => {
          setProduct(newProduct);
        });
    },
    [product, firebaseApp]
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
        .then(() =>
          Product.getById(loadedProduct.id, initializedApp.firestore())
        )
        .then(newProduct => {
          setProduct(newProduct);
        });

      return {
        task,
        promise: refreshPromise
      };
    },
    [product, firebaseApp]
  );

  const updateProductFile = useCallback(
    (id: string, edited: Partial<ProductFile>): Promise<void> => {
      const loadedProduct = shouldProductRefLoaded(product);
      const initializedApp = shouldAppInitialized(firebaseApp);

      return loadedProduct
        .partialUpdateFile(id, edited)
        .then(() =>
          Product.getById(loadedProduct.id, initializedApp.firestore())
        )
        .then(newProduct => {
          setProduct(newProduct);
        });
    },
    [firebaseApp, product]
  );

  const deleteProductFile = useCallback(
    async (productFileId: string) => {
      const loadedProduct = shouldProductRefLoaded(product);
      const initializedApp = shouldAppInitialized(firebaseApp);

      return loadedProduct
        .deleteProductFile(productFileId)
        .then(() =>
          Product.getById(loadedProduct.id, initializedApp.firestore())
        )
        .then(newProduct => {
          setProduct(newProduct);
        });
    },
    [firebaseApp, product]
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
