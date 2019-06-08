import { firestore, storage, auth } from "firebase/app";
import Timestamp = firestore.Timestamp;
import UpdateData = firebase.firestore.UpdateData;

// NominalTypings
// @link https://basarat.gitbooks.io/typescript/docs/tips/nominalTyping.html
type ProductName = string & {
  _productNameBrand: never;
};

type ProductDescription = string & {
  _productDescriptionBrand: never;
};

type ProductFileDisplayName = string & {
  _productFileDisplayNameBrand: never;
};

type ProductFileSize = number & {
  _productFileDisplayNameBrand: never;
};

type ProductFileOriginalName = string & {
  _productFileOriginalName: never;
};

interface ProductFile {
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
}

interface ProductDocument {
  name: ProductName;
  /**
   * @see storage#Reference#toString()
   */
  iconStorageUrl: string | null;
  description: ProductDescription;
  productFiles: {
    [id: string]: ProductFile;
  };
  ownerUid: string;
  createdAt: Date | firestore.FieldValue;
}

class Product implements ProductDocument {
  public static getColRef() {
    return firestore().collection(`products`);
  }

  public static getDocRef(id: string) {
    return Product.getColRef().doc(id);
  }

  public static getProductFileStorageRef() {
    return storage().ref(`productFiles`);
  }

  public static getIconStorageRef() {
    return storage().ref(`icons`);
  }

  public static async getOwns(): Promise<Product[]> {
    const owner = auth().currentUser;
    if (!owner) {
      // TODO
      // tslint:disable:no-console
      console.error("not logged-in");
      return [];
    }

    const ownProductsSnap = await Product.getColRef()
      .where("ownerUid", "==", owner.uid)
      .get();

    const owns: { [id: string]: Product } = {};

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
        (createdAt as Timestamp).toDate()
      );
    });
  }

  public static async getById(id: string): Promise<Product | null> {
    const snap = await Product.getColRef()
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
      (createdAt as Timestamp).toDate()
    );
  }

  public static async createNew(params: {
    name: ProductName;
    description?: ProductDescription;
  }): Promise<void> {
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
      createdAt: firestore.FieldValue.serverTimestamp()
    };

    await Product.getColRef().add(newProductDoc);
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
    readonly createdAt: Date
  ) {}

  public get ref() {
    return Product.getDocRef(this.id);
  }

  public addProductFile = (
    displayName: ProductFileDisplayName,
    file: File
  ): { task: storage.UploadTask; promise: Promise<Product> } => {
    const originalFileName = file.name as ProductFileOriginalName;
    const extension = originalFileName
      .split(".")
      .pop()
      .toLowerCase();

    // TODO replace secure random id.
    const id = Math.random()
      .toString(16)
      .substring(2);

    const storageRef = Product.getProductFileStorageRef().child(
      `${id}.${extension}`
    );
    const task = storageRef.put(file, {});
    const promise = new Promise<Product>(resolve => {
      task.on(
        storage.TaskEvent.STATE_CHANGED,
        () => {
          //
        },
        () => {
          //
        },
        async () => {
          const docRef = Product.getDocRef(this.ref.id);
          const newProductFileId = Product.getAutoNewId();
          const newProductFile: ProductFile = {
            displayName,
            storageUrl: storageRef.toString(),
            size: file.size,
            contentType: file.type,
            originalName: originalFileName
          };

          const partialNewDoc: Partial<ProductDocument> = {
            productFiles: {
              ...this.productFiles,
              [newProductFileId]: newProductFile
            }
          };
          await docRef.update(partialNewDoc);

          resolve(
            new Product(
              this.id,
              this.name,
              this.iconStorageUrl,
              this.description,
              this.ownerUid,
              partialNewDoc.productFiles,
              this.createdAt
            )
          );
        }
      );
    });

    return {
      task,
      promise
    };
  };

  public deleteProductFile = async (deleteTargetId: string) => {
    const docRef = Product.getDocRef(this.ref.id);
    const filteredFiles = {
      ...this.productFiles
    };
    delete filteredFiles[deleteTargetId];

    const deleteDoc: Partial<ProductDocument> = {
      productFiles: filteredFiles
    };
    await docRef.update(deleteDoc);

    await this.deleteProductFileFromStorage(deleteTargetId);

    return new Product(
      this.id,
      this.name,
      this.iconStorageUrl,
      this.description,
      this.ownerUid,
      filteredFiles,
      this.createdAt
    );
  };

  public deleteProductFileFromStorage = async (
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

  public uploadIconToStorage(file: File): storage.UploadTask {
    // after success, delete an old icon.
    const oldIconRef = storage().refFromURL(this.iconStorageUrl);

    const originalFileName = file.name;
    const extension = originalFileName
      .split(".")
      .pop()
      .toLowerCase();

    // TODO replace secure random id.
    const id = Math.random()
      .toString(16)
      .substring(2);

    const storageRef = Product.getIconStorageRef().child(`${id}.${extension}`);
    const task = storageRef.put(file, {});

    const unsubscribe = task.on(
      storage.TaskEvent.STATE_CHANGED,
      () => {
        //
      },
      () => {
        //
      },
      async () => {
        unsubscribe();

        const docRef = Product.getDocRef(this.ref.id);
        const partialNewDoc: Partial<ProductDocument> = {
          iconStorageUrl: storageRef.toString()
        };
        await docRef.update(partialNewDoc);

        // it no longer be referred.
        oldIconRef.delete();
      }
    );

    return task;
  }

  public async partialUpdateFields(
    values: Partial<ProductDocument>
  ): Promise<void> {
    await this.ref.update({
      ...values
    });
  }

  public async partialUpdateFile(id: string, edited: Partial<ProductFile>) {
    const updateData: UpdateData = {};
    const productFilesKey: keyof Product = "productFiles";

    Object.keys(edited).forEach((key: keyof ProductFile) => {
      updateData[`${productFilesKey}.${id}.${key}`] = edited[key];
    });

    await this.ref.update(updateData);
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

export {
  Product,
  ProductDocument,
  ProductName,
  ProductDescription,
  ProductFile,
  ProductFileDisplayName,
  ProductFileOriginalName
};
