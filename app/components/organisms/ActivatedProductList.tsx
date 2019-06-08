import * as React from "react";

import styled from "styled-components";

import {
  Grid,
  Card,
  CardActionArea,
  CardContent,
  Typography
} from "@material-ui/core/";
import { CardProps } from "@material-ui/core/Card";

import ThumbnailImage from "../atoms/ProductImageThumbnailImage";
import NoImage from "../atoms/ProductImageThumbnailNoImage";

import { Product } from "../../domains/Product";

const CARD_WIDTH = 200;

const StyledCard: React.FC<CardProps> = styled(Card)`
  width: ${CARD_WIDTH}px;
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

  const cardMedia = iconUrl ? (
    <ThumbnailImage src={iconUrl} width={CARD_WIDTH} />
  ) : (
    <NoImage width={CARD_WIDTH} />
  );

  return (
    <>
      <StyledCard>
        <CardActionArea onClick={onCardClicked}>
          {cardMedia}
          <CardContent>
            <Typography variant="h6">{product.name}</Typography>
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
    <Grid
      container={true}
      justify="flex-start"
      spacing={2 /* TODO: get it from theme */}
    >
      {products.map(p => (
        <Grid key={p.id} item={true}>
          <PanelItem product={p} onClick={onClick(p.id)} />
        </Grid>
      ))}
    </Grid>
  );
};

export default ActivatedProductList;
