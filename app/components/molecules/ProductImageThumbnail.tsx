import * as React from "react";

import styled from "styled-components";
import { useDropzone } from "react-dropzone";

import ProductImageThumbnailNoImage from "../atoms/ProductImageThumbnailNoImage";
import ProductImageThumbnailImage from "../atoms/ProductImageThumbnailImage";

const MB = 1000 * 1000;

const readAsDataURLWithReader = (file: File): Promise<string> => {
  const reader = new FileReader();

  const promise = new Promise<string>(resolve => {
    reader.onload = () => resolve(reader.result as string);
  });

  reader.readAsDataURL(file);

  return promise;
};

const ErrorMessage = styled.div`
  color: red;
`;

interface ProductImageThumbnailProps {
  src: string | null;
  onChange: (file: File) => void;
}

const ProductImageThumbnail: React.FC<ProductImageThumbnailProps> = ({
  src,
  onChange
}) => {
  const [
    selectedFileErrorMessage,
    setSelectedFileErrorMessage
  ] = React.useState(null);

  const onDrop = React.useCallback((acceptedFiles: File[]) => {
    const acceptedFile = acceptedFiles[0];

    if (1 * MB < acceptedFile.size) {
      setSelectedFileErrorMessage("file size should be less than 1MB.");
      return;
    }
    readAsDataURLWithReader(acceptedFile).then(dataUrl => {
      // setSrc(dataUrl);
    });

    onChange(acceptedFile);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: "image/*"
  });

  const thumbnail = !!src ? (
    <ProductImageThumbnailImage src={src} dragActive={isDragActive} />
  ) : (
    <ProductImageThumbnailNoImage dragActive={isDragActive} />
  );

  return (
    <>
      {selectedFileErrorMessage && (
        <ErrorMessage>{selectedFileErrorMessage}</ErrorMessage>
      )}
      <div id="hogehoge" {...getRootProps()}>
        <input {...getInputProps()} />
        {thumbnail}
      </div>
    </>
  );
};

export default ProductImageThumbnail;
