import * as React from "react";

import styled from "styled-components";

import Card, { CardProps } from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";

import { Product } from "../../domains/Product";

const StyledCard: React.FC<CardProps> = styled(Card)`
  max-width: 345px;
`;

interface PanelItemProps {
  product: Product;
  onClick: (id: string) => void;
}
const PanelItem: React.FC<PanelItemProps> = ({ product, onClick }) => {
  const [iconUrl, setIconUrl] = React.useState(null);

  React.useEffect(() => {
    product.getIconUrl().then(url => {
      setIconUrl(url);
    });
  }, []);

  const onCardClicked = () => {
    onClick(product.id);
  };

  return (
    <>
      <StyledCard>
        <CardActionArea onClick={onCardClicked}>
          <CardMedia title={product.name} image={iconUrl} component="img" />
          <CardContent>
            <Typography gutterBottom={true} variant="h5" component="h2">
              {product.name}
            </Typography>
          </CardContent>
        </CardActionArea>
      </StyledCard>
    </>
  );
};

interface ActivatedProductListProps {
  products: Product[];
  onPanelClicked: (selectedId: string) => void;
}

const ActivatedProductList: React.FC<ActivatedProductListProps> = ({
  products,
  onPanelClicked
}) => {
  const onClick = (id: string) => () => {
    onPanelClicked(id);
  };

  return (
    <>
      {products.map(p => {
        return <PanelItem key={p.id} product={p} onClick={onClick(p.id)} />;
      })}
    </>
  );
};

export default ActivatedProductList;
