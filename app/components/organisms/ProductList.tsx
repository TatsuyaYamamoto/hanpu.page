import { default as React, useEffect, FC } from "react";

import { useRouter } from "next/router";

import useFirebase from "..//hooks/useFirebase";
import useDlCodeUser from "../hooks/useDlCodeUser";

import { Product } from "../../domains/Product";

const ProductList: FC = () => {
  const [products, setProducts] = React.useState<Product[]>([]);
  const router = useRouter();
  const { app: firebaseApp } = useFirebase();
  const { user: dlCodeUser } = useDlCodeUser();

  useEffect(() => {
    if (!firebaseApp) {
      return;
    }

    if (!dlCodeUser) {
      return;
    }

    const unsubscribe = Product.watchList(
      dlCodeUser.uid,
      firebaseApp.firestore(),
      owns => {
        setProducts(owns);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [firebaseApp, dlCodeUser]);

  const onSelected = (id: string) => () => {
    router.push(`/publish/products/${id}`);
  };

  return (
    <ul>
      {products.map(p => {
        return (
          <li key={p.name} onClick={onSelected(p.id)}>
            name: <div>{p.name}</div>
            desc: <div>{p.description}</div>
            created: <div>{p.createdAt.toDateString()}</div>
          </li>
        );
      })}
    </ul>
  );
};

export default ProductList;
