import styled, { css } from "styled-components";

interface ThumbnailImageProps {
  dragActive?: boolean;
  width: number;
}

const ProductImageThumbnailNoImage = styled.div`
  background-color: darkgray;

  display: flex;
  justify-content: center;
  align-items: center;

  ${({ width }: ThumbnailImageProps) => css`
    width: ${width}px;
    height: ${width}px;
  `}

  &::after {
    content: "No Image";
    font-size: 2rem;
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
