import * as React from "react";

import styled, { ThemeProps } from "styled-components";

import Grid from "@material-ui/core/Grid";
import { Theme as MuiTheme } from "@material-ui/core/styles";
import Typography, { TypographyProps } from "@material-ui/core/Typography";

import ProductThumbnail from "../atoms/ProductThumbnail";

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
        <ProductThumbnail src={iconUrl} />
      </Grid>
      <Grid item={true}>
        <ProductName variant="h3">{name}</ProductName>
        <ProductDescription variant="body1">{description} </ProductDescription>
      </Grid>
    </Grid>
  );
};

export default ProductDetail;
