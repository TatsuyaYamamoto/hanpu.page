import * as React from "react";

import styled, { css } from "styled-components";

interface ThumbnailImageProps {
  dragActive: boolean;
}

const ProductImageThumbnailImage = styled.img`
  width: 200px;
  height: 200px;
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

export default ProductImageThumbnailImage;
