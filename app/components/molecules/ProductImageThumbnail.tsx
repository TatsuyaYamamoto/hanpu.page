import * as React from "react";

import styled from "styled-components";
import { useDropzone } from "react-dropzone";

import ProductImageThumbnailNoImage from "../atoms/ProductImageThumbnailNoImage";
import ProductImageThumbnailImage from "../atoms/ProductImageThumbnailImage";

const MB = 1000 * 1000;
const THUMBNAIL_WIDTH = 200;

const ErrorMessage = styled.div`
  color: red;
`;

interface ProductImageThumbnailProps {
  src: string | null;
  onChange: (file: File) => void;
}

const ProductImageThumbnail: React.FC<ProductImageThumbnailProps> = ({
  src,
  onChange,
}) => {
  const [selectedFileErrorMessage, setSelectedFileErrorMessage] =
    React.useState<string | null>(null);

  const onDrop = (acceptedFiles: File[]) => {
    const acceptedFile = acceptedFiles[0];

    if (1 * MB < acceptedFile.size) {
      setSelectedFileErrorMessage("file size should be less than 1MB.");
      return;
    }

    onChange(acceptedFile);
  };
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: "image/*",
  });

  const thumbnail = !!src ? (
    <ProductImageThumbnailImage
      width={THUMBNAIL_WIDTH}
      src={src}
      dragActive={isDragActive}
    />
  ) : (
    <ProductImageThumbnailNoImage
      width={THUMBNAIL_WIDTH}
      dragActive={isDragActive}
    />
  );

  return (
    <>
      {selectedFileErrorMessage && (
        <ErrorMessage>{selectedFileErrorMessage}</ErrorMessage>
      )}
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        {thumbnail}
      </div>
    </>
  );
};

export default ProductImageThumbnail;
