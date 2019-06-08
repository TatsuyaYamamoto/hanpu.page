import * as React from "react";

import styled, { css } from "styled-components";

interface ThumbnailImageProps {
  dragActive?: boolean;
  width: number;
}

const ProductImageThumbnailImage = styled.img`
  ${({ width }: ThumbnailImageProps) => css`
    width: ${width}px;
    height: ${width}px;
  `}

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
