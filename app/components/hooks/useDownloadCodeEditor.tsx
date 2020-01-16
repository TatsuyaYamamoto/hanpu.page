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

  /**
   * DownloadCodeSetを更新する
   *
   * 更新可能param
   *   - description
   *
   * @param id
   * @param edited
   */
  const updateDownloadCodeSet = async (
    id: string,
    edited: Pick<DownloadCodeSetDocument, "description">
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
