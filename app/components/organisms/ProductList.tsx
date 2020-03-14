import { default as React, useEffect, useState, FC } from "react";

import { useRouter } from "next/router";

import styled from "styled-components";

import useFirebase from "../hooks/useFirebase";
import useDlCodeUser from "../hooks/useDlCodeUser";
import ProductListItem, {
  ProductListAddItem
} from "../organisms/ProductListItem";

import { Product } from "../../domains/Product";
import useProgressBar from "../hooks/useProgressBar";

const Root = styled.div``;

const Item = styled(ProductListItem)`
  margin-bottom: 20px;
`;

const AddItem = styled(ProductListAddItem)`
  margin-bottom: 20px;
`;

interface ProductListProps {
  onAdd: () => void;
}
const ProductList: FC<ProductListProps> = props => {
  const { onAdd } = props;

  const [products, setProducts] = React.useState<Product[]>([]);
  const router = useRouter();
  const { app: firebaseApp } = useFirebase();
  const { user: dlCodeUser } = useDlCodeUser();
  const { start: startProgress, stop: stopProgress } = useProgressBar();

  useEffect(() => {
    if (!firebaseApp) {
      return;
    }

    if (!dlCodeUser) {
      return;
    }

    startProgress();

    const unsubscribe = Product.watchList(
      dlCodeUser.uid,
      firebaseApp.firestore(),
      owns => {
        setProducts(owns);
        stopProgress();
      }
    );

    return () => {
      unsubscribe();
    };
  }, [firebaseApp, dlCodeUser]);

  const onSelected = (id: string) => () => {
    router.push({
      pathname: `/publish/product/edit`,
      query: {
        id
      }
    });
  };

  const [thumbnailImageUrls, setThumbnailImageUrls] = useState<{
    [id: string]: string;
  }>({});

  useEffect(() => {
    (async () => {
      const map: { [id: string]: string } = {};

      await Promise.all(
        products.map(async product => {
          map[product.id] = (await product.getIconUrl()) || "none";
        })
      );

      setThumbnailImageUrls(map);
    })();
  }, [products]);

  return (
    <Root>
      <AddItem onClick={onAdd} />

      {products.map(p => {
        return (
          <Item
            key={p.name}
            onClick={onSelected(p.id)}
            id={p.id}
            name={p.name}
            thumbnailImageUrl={thumbnailImageUrls[p.id]}
            createdAt={p.createdAt}
            productFileCount={p.productFileCount}
          />
        );
      })}
    </Root>
  );
};

export default ProductList;
