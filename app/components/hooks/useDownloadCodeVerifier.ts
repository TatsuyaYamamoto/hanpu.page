import * as React from "react";
const { useEffect, useState } = React;

import Dexie from "dexie";
import { DownloadCodeSet } from "../../domains/DownloadCodeSet";

import { Product } from "../../domains/Product";

interface ActiveProductSchema {
  downloadCode: string;
  productId: string;
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

const useDownloadCodeVerifier = () => {
  const [activeProductIds, setActiveProductIds] = useState<string[]>([]);
  const [activeProducts, setActiveProducts] = useState<Product[]>([]);

  useEffect(() => {
    const db = new DlCodeDb();

    db.activeProducts.toArray().then(active => {
      const ids = active.map(({ productId }) => productId);
      setActiveProductIds(ids);
    });
  }, []);

  useEffect(() => {
    const loadedProductIds = activeProducts.map(({ id }) => id);

    const nonLoadedProductIds = activeProductIds.filter(activeProductId => {
      return !loadedProductIds.includes(activeProductId);
    });

    Promise.all(nonLoadedProductIds.map(id => Product.getById(id))).then(
      products => {
        setActiveProducts(products);
      }
    );
  }, [activeProductIds]);

  const verifyDownloadCode = async (code: string) => {
    const verifiedProductId = await DownloadCodeSet.verify(code);

    // TODO: check code is expired too!
    if (!verifiedProductId) {
      throw new Error("provided code is not valid.");
    }

    const db = new DlCodeDb();
    db.transaction("rw", db.activeProducts, async () => {
      const id = await db.activeProducts.add({
        downloadCode: code,
        productId: verifiedProductId
      });

      const productIds = (await db.activeProducts.toArray()).map(
        ({ productId }) => productId
      );
      setActiveProductIds(productIds);
    }).catch(e => {
      // tslint:disable-next-line:no-console
      console.error(e);
    });
  };

  return { verifyDownloadCode, activeProducts };
};

export default useDownloadCodeVerifier;
