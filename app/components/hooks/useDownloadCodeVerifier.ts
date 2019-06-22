import Dexie from "dexie";
import * as React from "react";
import { LogType } from "../../domains/AuditLog";
import { DownloadCodeSet } from "../../domains/DownloadCodeSet";

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
  public activeProducts: Dexie.Table<ActiveProductSchema, number>; // id is number in this case

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

const useDownloadCodeVerifier = () => {
  const { okAudit, errorAudit } = useAuditLogger();
  const [actives, setActives] = useState<ActiveProduct[]>([]);

  useEffect(() => {
    loadActives();
  }, []);

  const verifyDownloadCode = async (code: string) => {
    const {
      productId: verifiedProductId,
      expiredAt
    } = await DownloadCodeSet.verify(code);

    // TODO: check code is expired too!
    if (!verifiedProductId) {
      const e = new Error("provided code is not valid.");

      errorAudit({
        type: LogType.ACTIVATE_WITH_DOWNLOAD_CODE,
        params: { code },
        error: e
      });
      throw e;
    }

    okAudit({
      type: LogType.ACTIVATE_WITH_DOWNLOAD_CODE,
      params: { code }
    });

    const db = new DlCodeDb();
    db.transaction("rw", db.activeProducts, async () => {
      await db.activeProducts.add({
        downloadCode: code,
        productId: verifiedProductId,
        expiredAt
      });
    })
      .catch(e => {
        // tslint:disable-next-line:no-console
        console.error(e);
      })
      .then(() => {
        return loadActives();
      });
  };

  const loadActives = async () => {
    const db = new DlCodeDb();

    const activeProducts = await db.activeProducts.toArray();
    const activeIds = activeProducts.map(activeProduct => ({
      productId: activeProduct.productId,
      expiredAt: activeProduct.expiredAt
    }));

    const loadProductPromises = activeIds.map(({ productId, expiredAt }) => {
      return Product.getById(productId).then(product => {
        return {
          product,
          expiredAt
        };
      });
    });

    await Promise.all(loadProductPromises).then(resolveActives => {
      setActives(resolveActives);
    });
  };

  return { verifyDownloadCode, actives };
};

export default useDownloadCodeVerifier;
