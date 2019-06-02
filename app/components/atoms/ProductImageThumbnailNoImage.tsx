import * as React from "react";

import styled, { css } from "styled-components";

interface ThumbnailImageProps {
  dragActive: boolean;
}

const ProductImageThumbnailNoImage = styled.div`
  width: 200px;
  height: 200px;
  background-color: darkgray;
  &::after {
    content: "No Image";
    color: white;
  }
  ${({ dragActive }: ThumbnailImageProps) =>
    dragActive &&
    css`
      border: 2px #ff0000 solid;
      box-sizing: border-box;

      &::after {
        content: "Drop the files here";
      }
    `}
`;

export default ProductImageThumbnailNoImage;
