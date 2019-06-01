import * as React from "react";
import { RouteComponentProps } from "react-router-dom";

import AppBar from "../../organisms/AppBar";

import { Product } from "../../../domains/Product";

const ProductListPage: React.FC<RouteComponentProps> = props => {
  const [products, setProducts] = React.useState<Product[]>([]);

  React.useEffect(() => {
    // TODO delete this logic!!
    setTimeout(() => {
      Product.getOwns().then(owns => {
        // TODO
        // tslint:disable:no-console
        console.log(owns);
        setProducts(owns);
      });
    }, 1000);
  }, []);

  const onSelected = (id: string) => () => {
    props.history.push(`/publish/products/${id}`);
  };

  return (
    <>
      <AppBar title={`Product List!`} />
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
    </>
  );
};

export default ProductListPage;
