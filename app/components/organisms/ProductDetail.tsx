import * as React from "react";

import styled from "styled-components";

import Grid from "@material-ui/core/Grid";
import Typography, { TypographyProps } from "@material-ui/core/Typography";

import ProductThumbnail from "../atoms/ProductImageThumbnailImage";

const ProductName: React.FC<TypographyProps> = styled(Typography)``;
const ProductDescription: React.FC<TypographyProps> = styled(Typography)``;

interface ProductDetailProps {
  name: string;
  iconUrl: string;
  description: string;
}

const ProductDetail: React.FC<ProductDetailProps> = ({
  name,
  description,
  iconUrl
}) => {
  return (
    <Grid container={true}>
      <Grid item={true}>
        <ProductThumbnail src={iconUrl} width={200} />
      </Grid>
      <Grid item={true}>
        <ProductName variant="h4">{name}</ProductName>
        <ProductDescription variant="body1" component="pre">
          {description}
        </ProductDescription>
      </Grid>
    </Grid>
  );
};

export default ProductDetail;
