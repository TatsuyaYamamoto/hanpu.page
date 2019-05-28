import { storage, firestore } from "firebase/app";
import DocumentReference = firestore.DocumentReference;
import StorageReference = storage.Reference;

interface ProductFileDocument {
  name: string;
  productRef: DocumentReference;
  storageUrl: string;
}

class ProductFile implements ProductFileDocument {
  public static getColRef() {
    return firestore().collection(`productFiles`);
  }

  public static getDocRef(id: string) {
    return ProductFile.getColRef().doc(id);
  }

  public static getStorageRef() {
    return storage().ref(`productFiles`);
  }

  public static async getById(id: string): Promise<ProductFile | null> {
    const snap = await ProductFile.getColRef()
      .doc(id)
      .get();

    if (!snap.exists) {
      // tslint:disable-next-line:no-console
      console.error(`no doc of provided id. ${id}`);
      return null;
    }

    const { name, productRef, storageUrl } = snap.data() as ProductFileDocument;

    return new ProductFile(snap.id, name, productRef, storageUrl);
  }

  public static upload(file: File): storage.UploadTask {
    const originalFileName = file.name;
    const extension = originalFileName
      .split(".")
      .pop()
      .toLowerCase();
    // TODO replace secure random id.
    const id = Math.random()
      .toString(16)
      .substring(2);

    const ref = ProductFile.getStorageRef().child(`${id}.${extension}`);
    return ref.put(file, {});
  }

  public static async create(
    name: string,
    productRef: DocumentReference,
    storageRef: StorageReference
  ): Promise<ProductFile> {
    const newDoc: ProductFileDocument = {
      name,
      productRef,
      storageUrl: storageRef.toString()
    };

    const newDocRef = await ProductFile.getColRef().add(newDoc);

    return new ProductFile(
      newDocRef.id,
      newDoc.name,
      newDoc.productRef,
      newDoc.storageUrl
    );
  }

  public constructor(
    // metadata
    readonly id: string,

    // document fields
    readonly name: string,
    readonly productRef: DocumentReference,
    readonly storageUrl: string
  ) {}

  public get ref() {
    return ProductFile.getDocRef(this.id);
  }

  public getStorageRef() {
    storage().refFromURL(this.storageUrl);
  }

  public deleteFile = async (): Promise<void> => {
    const targetRef = storage().refFromURL(this.storageUrl);
    return targetRef.delete();
  };
}

export { ProductFile, ProductFileDocument };
