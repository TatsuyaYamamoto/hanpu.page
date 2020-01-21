import { firestore, storage, auth } from "firebase/app";
type DocumentReference = firestore.DocumentReference;
type Timestamp = firestore.Timestamp;
type UpdateData = firestore.UpdateData;

import { v4 as uuid } from "uuid";

// NominalTypings
// @link https://basarat.gitbooks.io/typescript/docs/tips/nominalTyping.html
export type ProductName = string & {
  _productNameBrand: never;
};

export type ProductDescription = string & {
  _productDescriptionBrand: never;
};

export type ProductFileDisplayName = string & {
  _productFileDisplayNameBrand: never;
};

export type ProductFileOriginalName = string & {
  _productFileOriginalName: never;
};

export interface ProductFile {
  /**
   * 一覧に表示する時にしようするファイル名
   */
  displayName: ProductFileDisplayName;
  /**
   * @see storage#Reference#toString()
   */
  storageUrl: string;

  /**
   * ファイルサイズ[byte]
   */
  size: number;

  /**
   * @link storage#SettableMetadata#contentType
   */
  contentType: string;

  /**
   * アップロードされたときのファイル名
   */
  originalName: ProductFileOriginalName;

  /**
   * リスト表示時の並び順
   */
  index: number;
}

export interface ProductFileMap {
  [id: string]: ProductFile;
}

export interface ProductDocument {
  name: ProductName;
  /**
   * @see storage#Reference#toString()
   */
  iconStorageUrl: string | null;
  description: ProductDescription;
  productFiles: ProductFileMap;
  ownerUid: string;
  createdAt: Date | firestore.FieldValue;

  //
  firestoreInstance: firestore.Firestore;
}

export class Product implements ProductDocument {
  public static getColRef(firestoreInstance: firestore.Firestore) {
    return firestoreInstance.collection(`products`);
  }

  public static getDocRef(id: string, firestoreInstance: firestore.Firestore) {
    return Product.getColRef(firestoreInstance).doc(id);
  }

  public static getProductFileStorageRef(uid: string, productId: string) {
    return storage().ref(`users/${uid}/products/${productId}/files`);
  }

  public static getImageStorageRef(uid: string, productId: string) {
    return storage().ref(`users/${uid}/products/${productId}/images`);
  }

  public static async getOwns(
    firestoreInstance: firestore.Firestore
  ): Promise<Product[]> {
    const owner = auth().currentUser;
    if (!owner) {
      // tslint:disable:no-console TODO
      console.error("not logged-in");
      return [];
    }

    const ownProductsSnap = await Product.getColRef(firestoreInstance)
      .where("ownerUid", "==", owner.uid)
      .get();

    return ownProductsSnap.docs.map(docSnap => {
      const {
        name,
        iconStorageUrl,
        description,
        ownerUid,
        productFiles,
        createdAt
      } = docSnap.data() as ProductDocument;

      return new Product(
        docSnap.id,
        name,
        iconStorageUrl,
        description,
        ownerUid,
        productFiles,
        (createdAt as Timestamp).toDate(),
        firestoreInstance
      );
    });
  }

  public static async getById(
    id: string,
    firestoreInstance: firestore.Firestore
  ): Promise<Product | null> {
    const snap = await Product.getColRef(firestoreInstance)
      .doc(id)
      .get();

    if (!snap.exists) {
      return null;
    }
    const {
      name,
      iconStorageUrl,
      description,
      ownerUid,
      productFiles,
      createdAt
    } = snap.data() as ProductDocument;

    return new Product(
      snap.id,
      name,
      iconStorageUrl,
      description,
      ownerUid,
      productFiles,
      (createdAt as Timestamp).toDate(),
      firestoreInstance
    );
  }

  public static async createNew(
    params: {
      name: ProductName;
      description: ProductDescription;
    },
    firestoreInstance: firestore.Firestore
  ): Promise<DocumentReference | void> {
    const { name, description } = params;

    const owner = auth().currentUser;
    if (!owner) {
      return;
    }

    const newProductDoc: ProductDocument = {
      name,
      iconStorageUrl: null,
      description,
      ownerUid: owner.uid,
      productFiles: {},
      createdAt: firestore.FieldValue.serverTimestamp(),
      firestoreInstance
    };

    return await Product.getColRef(firestoreInstance).add(newProductDoc);
  }

  public constructor(
    // metadata
    readonly id: string,

    // document fields
    readonly name: ProductName,
    readonly iconStorageUrl: string | null,
    readonly description: ProductDescription,
    readonly ownerUid: string,
    readonly productFiles: { [id: string]: ProductFile },
    readonly createdAt: Date,

    // dependencies
    readonly firestoreInstance: firestore.Firestore
  ) {}

  public get ref() {
    return Product.getDocRef(this.id, this.firestoreInstance);
  }

  public addProductFile = (
    displayName: ProductFileDisplayName,
    file: File
  ): { task: storage.UploadTask; promise: Promise<void> } => {
    const { currentUser } = auth();

    if (!currentUser) {
      throw new Error("unexpected error. logged-in user is null.");
    }

    const { uid } = currentUser;
    const originalFileName = file.name as ProductFileOriginalName;
    // @ts-ignore
    // TODO: handle file having no extension
    const extension = originalFileName
      .split(".")
      .pop()
      .toLowerCase();

    const fileId = Product.createNewFileName();

    const storageRef = Product.getProductFileStorageRef(uid, this.id).child(
      `${fileId}.${extension}`
    );

    const task = storageRef.put(file, {});
    const promise = new Promise<void>(resolve => {
      task.on(
        storage.TaskEvent.STATE_CHANGED,
        () => {
          //
        },
        e => {
          console.error(e);
        },
        async () => {
          const newProductFileId = Product.getAutoNewId();
          const currentProductFilesSize = Object.keys(this.productFiles).length;

          const newProductFile: ProductFile = {
            displayName,
            storageUrl: storageRef.toString(),
            size: file.size,
            contentType: file.type,
            originalName: originalFileName,
            index: currentProductFilesSize
          };

          const partialNewDoc: Partial<ProductDocument> = {
            productFiles: {
              ...this.productFiles,
              [newProductFileId]: newProductFile
            }
          };
          await this.ref.update(partialNewDoc);

          resolve();
        }
      );
    });

    return {
      task,
      promise
    };
  };

  public deleteProductFile = async (deleteTargetId: string) => {
    const newProductFileMap: ProductFileMap = {};
    Object.keys(this.productFiles)
      // filter
      .filter(id => {
        return id !== deleteTargetId;
      })
      // sort remaining elements
      .sort((aId, bId) => {
        const aIndex = this.productFiles[aId].index;
        const bIndex = this.productFiles[bId].index;

        return aIndex - bIndex;
      })
      // create new map
      .forEach((id, index) => {
        newProductFileMap[id] = {
          ...this.productFiles[id],
          index
        };
      });

    const deleteDoc: Partial<ProductDocument> = {
      productFiles: newProductFileMap
    };
    await this.ref.update(deleteDoc);

    await this.deleteProductFileFromStorage(deleteTargetId);

    return new Product(
      this.id,
      this.name,
      this.iconStorageUrl,
      this.description,
      this.ownerUid,
      newProductFileMap,
      this.createdAt,
      this.firestoreInstance
    );
  };

  private deleteProductFileFromStorage = async (
    deleteTargetId: string
  ): Promise<void> => {
    const deleteTargetProductFile = this.productFiles[deleteTargetId];

    if (!deleteTargetProductFile) {
      // tslint:disable-next-line:no-console
      console.error(`target product file doesn't exist. ID: ${deleteTargetId}`);
      return;
    }

    const targetRef = storage().refFromURL(deleteTargetProductFile.storageUrl);
    await targetRef.delete();
  };

  public async getIconUrl(): Promise<string | null> {
    if (!this.iconStorageUrl) {
      return null;
    }

    return await storage()
      .refFromURL(this.iconStorageUrl)
      .getDownloadURL();
  }

  public uploadIconToStorage(
    file: File
  ): { task: storage.UploadTask; promise: Promise<void> } {
    const { currentUser } = auth();

    if (!currentUser) {
      throw new Error("unexpected error. logged-in user is null.");
    }

    const { uid } = currentUser;

    // after success, delete an old icon.
    const oldIconRef =
      this.iconStorageUrl && storage().refFromURL(this.iconStorageUrl);

    const originalFileName = file.name;

    // @ts-ignore
    // TODO: handle file having no extension
    const extension = originalFileName
      .split(".")
      .pop()
      .toLowerCase();

    const fileId = Product.createNewFileName();

    const storageRef = Product.getImageStorageRef(uid, this.id).child(
      `${fileId}.${extension}`
    );

    const task = storageRef.put(file, {});

    const promise = new Promise<void>(resolve => {
      const unsubscribe = task.on(
        storage.TaskEvent.STATE_CHANGED,
        () => {
          //
        },
        e => {
          console.error(e);
        },
        async () => {
          unsubscribe();

          const partialNewDoc: Partial<ProductDocument> = {
            iconStorageUrl: storageRef.toString()
          };
          await this.ref.update(partialNewDoc);

          if (oldIconRef) {
            // it no longer be referred.
            await oldIconRef.delete();
          }

          resolve();
        }
      );
    });

    return {
      task,
      promise
    };
  }

  public async partialUpdateFields(
    values: Partial<ProductDocument>
  ): Promise<void> {
    await this.ref.update({
      ...values
    });
  }

  public async partialUpdateFile(
    updateId: string,
    edited: Partial<ProductFile>
  ) {
    const updateData: UpdateData = {};
    const productFilesKey: keyof Product = "productFiles";

    (Object.keys(edited) as (keyof ProductFile)[]).forEach(key => {
      updateData[`${productFilesKey}.${updateId}.${key}`] = edited[key];
    });

    const newIndex = edited.index;

    // Indexに更新がある場合、他のElementのIndexも更新する
    if (typeof newIndex !== "undefined") {
      const oldIndex = this.productFiles[updateId].index;

      Object.keys(this.productFiles).forEach(sortTargetId => {
        if (sortTargetId === updateId) {
          return;
        }

        const sortTargetOldIndex = this.productFiles[sortTargetId].index;
        const sortTargetIndexKey = `${productFilesKey}.${sortTargetId}.index`;

        // Indexの値が大きくなった場合、降順方向に他のIndex値をつめる
        if (oldIndex < newIndex) {
          if (
            oldIndex <= sortTargetOldIndex &&
            sortTargetOldIndex <= newIndex
          ) {
            updateData[sortTargetIndexKey] = sortTargetOldIndex - 1;
          }
        }

        // Indexの値が小さくなった場合、昇順方向に他のIndex値をつめる
        if (newIndex < oldIndex) {
          if (
            newIndex <= sortTargetOldIndex &&
            sortTargetOldIndex <= oldIndex
          ) {
            updateData[sortTargetIndexKey] = sortTargetOldIndex + 1;
          }
        }
      });
    }

    await this.ref.update(updateData);
  }

  private static createNewFileName(): string {
    return uuid();
  }

  /**
   * Get new unique id with logic of `AutoId.newId()`
   *
   * @link https://github.com/firebase/firebase-js-sdk/blob/master/packages/firestore/src/api/database.ts#L2162
   */
  private static getAutoNewId() {
    return firestore()
      .collection("any")
      .doc().id;
  }
}
