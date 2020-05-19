import { useCallback } from "react";

import { Impression } from "../../domains/Impression";
import { Product } from "../../domains/Product";
import useFirebase from "./useFirebase";

const useImpression = () => {
  const { app: firebaseApp } = useFirebase();

  const postImpression = useCallback(
    async (productId: string, text: string) => {
      const product = await Product.getById(productId, firebaseApp.firestore());
      if (!product) {
        throw new Error("provided product dose not exist.");
      }

      await Impression.post(product.ref, text);
    },
    [firebaseApp]
  );

  return { postImpression };
};

export default useImpression;
