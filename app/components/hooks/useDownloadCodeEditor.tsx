import { useEffect, useState } from "react";

import {
  DownloadCodeSet,
  DownloadCodeSetDocument
} from "../../domains/DownloadCodeSet";
import { Product } from "../../domains/Product";

const INITIAL_DOWNLOAD_CODE_SETS: DownloadCodeSet[] = [];

const useDownloadCodeEditor = (product: Product | null) => {
  const [codeSets, setCodeSets] = useState<DownloadCodeSet[]>(
    INITIAL_DOWNLOAD_CODE_SETS
  );

  useEffect(() => {
    if (!product) {
      setCodeSets(INITIAL_DOWNLOAD_CODE_SETS);
      return;
    }

    DownloadCodeSet.getByProductRef(product.ref).then(sets => {
      setCodeSets(sets);
    });
  }, [product]);

  const addDownloadCodeSet = async (
    numberOfCodes: number,
    expiredAt: Date
  ): Promise<void> => {
    if (!product) {
      return;
    }

    await DownloadCodeSet.create(product.ref, numberOfCodes, expiredAt);

    const updatedSets = await DownloadCodeSet.getByProductRef(product.ref);
    setCodeSets(updatedSets);
  };

  const updateDownloadCodeSet = async (
    id: string,
    // TODO: 今の所、"description"以外は更新を許さないはずなので、それがわかる型定義を、、、、
    edited: Partial<DownloadCodeSetDocument>
  ) => {
    if (!product) {
      return;
    }

    const ref = await DownloadCodeSet.getDocRef(id);
    await ref.update(edited);

    const updatedSets = await DownloadCodeSet.getByProductRef(product.ref);
    setCodeSets(updatedSets);
  };

  return {
    downloadCodeSets: codeSets,
    addDownloadCodeSet,
    updateDownloadCodeSet
  };
};

export default useDownloadCodeEditor;
