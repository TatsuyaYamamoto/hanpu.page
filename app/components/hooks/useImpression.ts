import { Impression } from "../../domains/Impression";
import { Product } from "../../domains/Product";

const useImpression = () => {
  const postImpression = async (productId: string, text: string) => {
    const product = await Product.getById(productId);
    if (!product) {
      throw new Error("provided product dose not exist.");
    }

    await Impression.post(product.ref, text);
  };

  return { postImpression };
};

export default useImpression;
