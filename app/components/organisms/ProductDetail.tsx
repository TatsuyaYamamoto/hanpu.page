import * as React from "react";
const { useMemo } = React;

import styled from "styled-components";

import { Grid, Typography } from "@material-ui/core";
import { TypographyProps } from "@material-ui/core/Typography";
// tslint:disable-next-line:no-var-requires
const reactStringReplace = require("react-string-replace");

import ProductThumbnail from "../atoms/ProductImageThumbnailImage";
import TextAvatarChip from "../atoms/TextAvatarChip";

const URL_REGEXP = /(https?:\/\/\S+)/g;

const ProductName = styled(Typography as React.FC<TypographyProps>)`
  text-overflow: ellipsis;
`;
const ProductDescription = styled(Typography as React.FC<TypographyProps>)`
  white-space: pre-wrap;
  word-wrap: break-word;
`;

const StyledA = styled.a`
  word-break: break-all;
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
  const linkifyDescription = useMemo(
    () =>
      reactStringReplace(description, URL_REGEXP, (match: string) => (
        <StyledA href={match} key={match}>
          {match}
        </StyledA>
      )),
    [description]
  );

  return (
    <Grid container={true}>
      <Grid item={true}>
        <ProductThumbnail src={iconUrl} width={200} />
      </Grid>
      <Grid item={true}>
        <ProductName variant="h4">{name}</ProductName>
        <ProductDescription variant="body1">
          {linkifyDescription}
        </ProductDescription>
        <TextAvatarChip
          avatar={`有効期限`}
          label={downloadCodeExpiredAt.toLocaleDateString()}
        />
      </Grid>
    </Grid>
  );
};

export default ProductDetail;
