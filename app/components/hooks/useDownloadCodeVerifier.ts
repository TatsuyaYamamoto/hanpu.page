import Dexie from "dexie";
import * as React from "react";
import { LogType } from "../../domains/AuditLog";
import {
  DownloadCodeSet,
  DownloadCodeSetDocument
} from "../../domains/DownloadCodeSet";

import { Product } from "../../domains/Product";
import useAuditLogger from "./useAuditLogger";

const { useEffect, useState } = React;

interface ActiveProductSchema {
  downloadCode: string;
  productId: string;
  expiredAt: Date;
}

//
// Declare Database
//
class DlCodeDb extends Dexie {
  public activeProducts: Dexie.Table<ActiveProductSchema, string>;

  public constructor() {
    super("dlCodeDb");
    this.version(1).stores({
      activeProducts: "productId,downloadCode"
    });
    this.activeProducts = this.table("activeProducts");
  }
}

interface ActiveProduct {
  product: Product;
  expiredAt: Date;
}

const useDownloadCodeVerifier = (preventLoadActives: boolean = false) => {
  const { okAudit, errorAudit } = useAuditLogger();
  const [actives, setActives] = useState<ActiveProduct[]>([]);

  useEffect(() => {
    if (!preventLoadActives) {
      loadActives();
    }
  }, []);

  const verifyDownloadCode = async (code: string) => {
    const result = await DownloadCodeSet.verify(code);

    // TODO: check code is expired too!
    if (!result) {
      const e = new Error("provided code is not valid.");

      errorAudit({
        type: LogType.ACTIVATE_WITH_DOWNLOAD_CODE,
        params: { code },
        error: e
      });
      throw e;
    }

    const { productId: verifiedProductId, expiredAt } = result;

    const db = new DlCodeDb();

    const target = await db.activeProducts.get({
      productId: verifiedProductId
    });

    if (!!target /* exists */) {
      // tslint:disable-next-line:no-console
      console.info("requested product is already registered.");

      okAudit({
        type: LogType.ACTIVATE_WITH_DOWNLOAD_CODE,
        params: {
          code,
          alreadyRegistered: true
        }
      });

      return;
    }

    okAudit({
      type: LogType.ACTIVATE_WITH_DOWNLOAD_CODE,
      params: { code }
    });

    db.transaction("rw", db.activeProducts, () => {
      return db.activeProducts.add({
        downloadCode: code,
        productId: verifiedProductId,
        expiredAt
      });
    }).then(() => {
      return loadActives();
    });
  };

  /**
   * @public
   */
  const getByProductId = async (
    id: string
  ): Promise<ActiveProductSchema | undefined> => {
    const db = new DlCodeDb();

    return await db.activeProducts.get({
      productId: id
    });
  };

  /**
   * @public
   */
  const checkFormat = (decoded: string) => {
    console.log(`QRCode is found. decoded: ${decoded}`);

    const validFormat = new RegExp(
      "https://dl-code.web.app/d/\\?c=[A-Z2-9]{8}"
    ).test(decoded);

    if (!validFormat) {
      console.log("unexpected qrcode.");
      return;
    } else {
      const downloadCode = decoded.replace("https://dl-code.web.app/d/?c=", "");
      console.log(
        `Decoded text is expected URL format. download code: ${downloadCode}`
      );

      return downloadCode;
    }
  };

  const checkLinkedProduct = async (downloadCode: string) => {
    console.log(
      `Decoded text is expected URL format. download code: ${downloadCode}`
    );

    const snap = await DownloadCodeSet.getColRef()
      .where(`codes.${downloadCode}`, "==", true)
      .get();

    if (snap.empty) {
      console.log("non-existed download code.");
      return;
    }

    const doc = snap.docs[0].data() as DownloadCodeSetDocument;
    const productId = doc.productRef.id;

    console.log("productId", productId);

    return productId;
  };

  /**
   * @private
   */
  const loadActives = async () => {
    const db = new DlCodeDb();

    const activeProducts = await db.activeProducts.toArray();
    const activeIds = activeProducts.map(activeProduct => ({
      productId: activeProduct.productId,
      expiredAt: activeProduct.expiredAt
    }));

    const loadProductPromises = activeIds.map(({ productId, expiredAt }) => {
      return Product.getById(productId).then(product => {
        const active: ActiveProduct | null = product
          ? {
              product,
              expiredAt
            }
          : null;

        return active;
      });
    });

    await Promise.all(loadProductPromises).then(resolveActives => {
      setActives(resolveActives.filter(a => a) as ActiveProduct[]);
    });
  };

  return {
    actives,
    verifyDownloadCode,
    getByProductId,
    checkFormat,
    checkLinkedProduct
  };
};

export default useDownloadCodeVerifier;
