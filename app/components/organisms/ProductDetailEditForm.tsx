import * as React from "react";
const { useEffect } = React;

import { Paper } from "@material-ui/core";
import { PaperProps } from "@material-ui/core/Paper";

import styled from "styled-components";

import FormControl from "../molecules/ProductDetailFormControl";
import FormInput from "../molecules/ProductDetailFormInput";

import ProductImageThumbnail from "../molecules/ProductImageThumbnail";

import {
  Product,
  ProductDescription,
  ProductDocument,
  ProductName
} from "../../domains/Product";
import TextField from "../molecules/TextField";

const StyledPaper: React.FC<PaperProps> = styled(Paper)`
  // TODO: set padding value with theme
  padding: 24px;
`;

interface ProductDetailEditFormProps {
  product: Product;
  onUpdateFields: (values: Partial<ProductDocument>) => Promise<void>;
  onUpdateIcon: (file: File) => Promise<void>;
}

/**
 * Productの詳細、ProductFile、DownloadCodeの編集を行うForm
 *
 * @param product
 * @param onUpdate
 * @constructor
 */
const ProductDetailEditForm: React.FC<ProductDetailEditFormProps> = ({
  product,
  onUpdateFields,
  onUpdateIcon
}) => {
  const [iconUrl, setIconUrl] = React.useState<string | null>(null);

  useEffect(() => {
    // TODO: check whether url is updated
    product.getIconUrl().then(url => {
      setIconUrl(url);
    });
  }, [product]);

  const onNameSubmitted = (value: ProductName) => {
    return onUpdateFields({
      name: value
    });
  };

  const onDescriptionSubmitted = async (value: ProductDescription) => {
    return onUpdateFields({
      description: value
    });
  };

  const onIconChanged = (file: File) => {
    return onUpdateIcon(file);
  };

  return (
    <StyledPaper>
      <FormControl
        label={"ID"}
        input={<FormInput readonly={true} defaultValue={product.id} />}
      />

      <FormControl
        label={"Thumbnail"}
        input={<ProductImageThumbnail src={iconUrl} onChange={onIconChanged} />}
      />

      <FormControl
        label={"Name"}
        input={
          <FormInput defaultValue={product.name} onSubmit={onNameSubmitted} />
        }
      />
      <FormControl
        label={"Description"}
        input={
          <FormInput
            defaultValue={product.description}
            multiline={true}
            onSubmit={onDescriptionSubmitted}
          />
        }
      />

      <FormControl
        label={"Created Date"}
        input={
          <FormInput
            readonly={true}
            defaultValue={product.createdAt.toDateString()}
          />
        }
      />
    </StyledPaper>
  );
};

export default ProductDetailEditForm;
