import { default as React, FC, useMemo } from "react";

import styled from "styled-components";

import {
  Card,
  CardProps,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  Typography,
  Paper,
  CardActionsProps,
  PaperProps
} from "@material-ui/core";
import NextArrowIcon from "@material-ui/icons/ArrowRight";
import AddIcon from "@material-ui/icons/Add";

import { format as dateFormat } from "date-fns";
import ProductImageThumbnailNoImage from "../atoms/ProductImageThumbnailNoImage";

const Root = styled(Card as FC<CardProps>)`
  display: flex;

  width: 100%;
`;

const Media = styled(CardMedia)`
  flex-shrink: 0;
  align-self: center;

  width: 151px;
  height: 151px;

  margin-left: 16px;
`;

const NoMedia = styled(({ className }) => (
  <ProductImageThumbnailNoImage className={className} width={151} />
))`
  align-self: center;

  margin-left: 16px;
`;

const Actions = styled(CardActions as FC<CardActionsProps>)`
  justify-content: flex-end;
`;

const CardInfo = styled.div`
  flex: 1;
`;

interface ProductListItemProps {
  id: string;
  name: string;
  createdAt: Date;
  productFileCount: number;
  thumbnailImageUrl?: string | "none";
  onClick: () => void;
}

const ProductListItem: FC<ProductListItemProps> = props => {
  const {
    id,
    name,
    createdAt,
    thumbnailImageUrl,
    productFileCount,
    onClick,
    ...others
  } = props;

  const media = useMemo(() => {
    if (!thumbnailImageUrl) {
      return;
    }
    if (thumbnailImageUrl === "none") {
      return <NoMedia />;
    }
    return <Media image={thumbnailImageUrl} />;
  }, [thumbnailImageUrl]);

  return (
    <Root {...others}>
      {media}
      <CardInfo>
        <CardContent>
          <Typography variant="h5" color="textSecondary">
            {`${name}`}
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            {`ID: ${id}`}
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            {`作成日: ${dateFormat(createdAt, "yyyy/MM/dd")}`}
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            {`ファイル数: ${productFileCount}`}
          </Typography>
        </CardContent>
        <Actions>
          <Button
            size="small"
            color="primary"
            onClick={onClick}
            endIcon={<NextArrowIcon />}
          >
            {"詳細表示"}
          </Button>
        </Actions>
      </CardInfo>
    </Root>
  );
};

const ProductListAddItemRoot = styled(Paper as FC<PaperProps>)`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 100%;

  cursor: pointer;

  // TODO:fix SSR > SPA に切り替わるときに、default colorに戻る
  background-color: lightgray;
`;

interface ProductListAddItemProps {
  onClick: () => void;
}
export const ProductListAddItem: FC<ProductListAddItemProps> = props => {
  const { onClick, ...others } = props;
  return (
    <ProductListAddItemRoot onClick={onClick} {...others}>
      <CardContent>
        <AddIcon />
      </CardContent>
    </ProductListAddItemRoot>
  );
};

export default ProductListItem;
