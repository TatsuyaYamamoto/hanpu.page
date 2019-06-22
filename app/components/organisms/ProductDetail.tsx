import * as React from "react";

import styled from "styled-components";

import { Grid, Chip, Avatar } from "@material-ui/core";
import Typography, { TypographyProps } from "@material-ui/core/Typography";

import ProductThumbnail from "../atoms/ProductImageThumbnailImage";

const ProductName: React.FC<TypographyProps> = styled(Typography)`
  text-overflow: ellipsis;
`;
const ProductDescription: React.FC<TypographyProps> = styled(Typography)`
  white-space: pre-wrap;
  word-wrap: break-word;
`;

// TODO 動的にwidth radiusを調整する
const LetterAvatar = styled(Avatar)`
  && {
    width: 94px;
    border-radius: 32px;
  }
`;

interface ProductDetailProps {
  name: string;
  iconUrl: string;
  description: string;
  downloadCodeExpiredAt: Date;
}

const ProductDetail: React.FC<ProductDetailProps> = ({
  name,
  description,
  iconUrl,
  downloadCodeExpiredAt
}) => {
  return (
    <Grid container={true}>
      <Grid item={true}>
        <ProductThumbnail src={iconUrl} width={200} />
      </Grid>
      <Grid item={true}>
        <ProductName variant="h4">{name}</ProductName>
        <ProductDescription variant="body1">{description}</ProductDescription>
        <Chip
          variant="outlined"
          avatar={<LetterAvatar>有効期限</LetterAvatar>}
          label={downloadCodeExpiredAt.toLocaleDateString()}
        />
      </Grid>
    </Grid>
  );
};

export default ProductDetail;
