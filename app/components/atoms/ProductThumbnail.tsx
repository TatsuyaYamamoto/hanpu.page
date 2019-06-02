import * as React from "react";

import styled from "styled-components";

const ThumbnailImage = styled.img`
  width: 200px;
  height: 200px;
`;

const ProgressThumbnail = styled.div`
  width: 200px;
  height: 200px;
  background-color: darkgray;

  ::after {
    content: "Loading...";
    color: whitesmoke;
  }
`;

interface ProductThumbnailProps {
  src: string | null;
}

const ProductThumbnail: React.FC<ProductThumbnailProps> = ({ src }) => {
  if (!src) {
    return <ProgressThumbnail />;
  }

  return <ThumbnailImage src={src} />;
};

export default ProductThumbnail;
