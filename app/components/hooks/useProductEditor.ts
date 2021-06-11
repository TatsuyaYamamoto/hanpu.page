import { useEffect, useState, useCallback } from "react";
import firebase from "firebase/app";

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

type DocumentReference = firebase.firestore.DocumentReference;
type UploadTask = firebase.storage.UploadTask;

const useProductEditor = (productId?: string) => {
  const { app: firebaseApp } = useFirebase();
  const { user: dlCodeUser } = useDlCodeUser();
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

  useEffect(() => {
    if (!dlCodeUser) {
      return;
    }

    if (!productId) {
      return;
    }

    const unsubscribe = Product.watchOne(
      productId,
      firebaseApp.firestore(),
      one => {
        setProduct(one);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [firebaseApp, dlCodeUser, productId]);

  const addProduct = useCallback(
    async (
      name: ProductName,
      description: ProductDescription
    ): Promise<[DocumentReference | void, DocumentReference | void]> => {
      if (!dlCodeUser) {
        throw new Error(
          "unexpected. firebase and user haven't benn initialized."
        );
      }

      const {
        current: currentRegisteredCount,
        limit: maxRegisteredCount
      } = dlCodeUser.user.counters.product;

      if (maxRegisteredCount <= currentRegisteredCount) {
        throw new Error(
          `exceeded. max count. current: ${currentRegisteredCount}, limit: ${maxRegisteredCount}`
        );
      }

      // current countを改めて計算する、冗長だけれど、、
      const current = await Product.getCount(
        dlCodeUser.uid,
        firebaseApp.firestore()
      );

      // TODO アトミックな処理に実装を変更する
      return Promise.all([
        dlCodeUser.editCounter("product", current + 1, firebaseApp.firestore()),
        Product.createNew({ name, description }, firebaseApp.firestore())
      ]);
    },
    [firebaseApp, dlCodeUser]
  );

  const updateProduct = useCallback(
    async (values: Partial<ProductDocument>) => {
      const loadedProduct = shouldProductRefLoaded(product);

      // TODO validate provided params
      await loadedProduct.partialUpdateFields(values);
    },
    [product]
  );

  const updateProductIcon = useCallback(
    async (icon: File) => {
      const loadedProduct = shouldProductRefLoaded(product);

      // TODO validate provided params
      const { promise } = loadedProduct.uploadIconToStorage(icon);

      return promise;
    },
    [product]
  );

  const addProductFile = useCallback(
    (
      displayName: ProductFileDisplayName,
      file: File
    ): {
      task: UploadTask;
      promise: Promise<void>;
    } => {
      const loadedProduct = shouldProductRefLoaded(product);
      if (!dlCodeUser) {
        throw new Error("non auth user logged-in.");
      }

      // check allowed host file size.
      const fileSizeByteTrying = file.size;

      const {
        current: currentFileSizeByte,
        limit: maxFileSizeByte
      } = dlCodeUser.user.counters.totalFileSizeByte;

      if (maxFileSizeByte < currentFileSizeByte + fileSizeByteTrying) {
        throw new Error(
          `exceeded. max count. current: ${currentFileSizeByte},  requested: ${fileSizeByteTrying}, limit: ${maxFileSizeByte}`
        );
      }

      const { task, promise } = loadedProduct.addProductFile(
        dlCodeUser.uid,
        displayName,
        file
      );

      return {
        task,
        // TODO アトミックな処理に実装を変更する
        promise: Promise.all([
          promise,
          dlCodeUser.editCounter(
            "totalFileSizeByte",
            currentFileSizeByte + fileSizeByteTrying,
            firebaseApp.firestore()
          )
        ]).then()
      };
    },
    [firebaseApp, product, dlCodeUser]
  );

  const updateProductFile = useCallback(
    (id: string, edited: Partial<ProductFile>): Promise<void> => {
      const loadedProduct = shouldProductRefLoaded(product);
      return loadedProduct.partialUpdateFile(id, edited);
    },
    [product]
  );

  const deleteProductFile = useCallback(
    async (productFileId: string) => {
      if (!dlCodeUser) {
        throw new Error("non auth user logged-in.");
      }

      const loadedProduct = shouldProductRefLoaded(product);
      const deletingFileSizeByte =
        loadedProduct.productFiles[productFileId].size;

      const {
        current: currentFileSizeByte
      } = dlCodeUser.user.counters.totalFileSizeByte;

      // TODO アトミックな処理に実装を変更する
      return Promise.all([
        loadedProduct.deleteProductFile(productFileId),
        dlCodeUser.editCounter(
          "totalFileSizeByte",
          currentFileSizeByte - deletingFileSizeByte,
          firebaseApp.firestore()
        )
      ]);
    },
    [product, dlCodeUser, firebaseApp]
  );

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
