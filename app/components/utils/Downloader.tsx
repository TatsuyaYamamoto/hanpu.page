import * as React from "react";

import { Product } from "../../domains/Product";

interface DownloaderContextType {
  products: Product[];
  addProduct: (product: Product) => void;
}

const DownloaderContext = React.createContext<DownloaderContextType>(
  undefined /* TODO: check required value */
);

const Downloader: React.FC = props => {
  const [products, setProducts] = React.useState<Product[]>([]);
  const addProduct = (product: Product) => {
    setProducts([...products, product]);
  };

  return (
    <DownloaderContext.Provider value={{ products, addProduct }}>
      {props.children}
    </DownloaderContext.Provider>
  );
};

export default Downloader;
export { DownloaderContext };
