import * as React from "react";
const { useEffect, useMemo } = React;

import { Paper } from "@material-ui/core";
import { PaperProps } from "@material-ui/core/Paper";

import styled from "styled-components";

import { format as dateFormat } from "date-fns";

import FormControl from "../molecules/ProductDetailFormControl";
import FormInput from "../molecules/ProductDetailFormInput";

import ProductImageThumbnail from "../molecules/ProductImageThumbnail";

import {
  Product,
  ProductDescription,
  ProductDocument,
  ProductName
} from "../../domains/Product";

const StyledPaper = styled(Paper as React.FC<PaperProps>)`
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

  const createdDate = useMemo(
    () => dateFormat(product.createdAt, "yyyy/MM/dd"),
    [product]
  );

  const onNameSubmitted = (value: string) => {
    return onUpdateFields({
      name: value as ProductName
    });
  };

  const onDescriptionSubmitted = async (value: string) => {
    return onUpdateFields({
      description: value as ProductDescription
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
        label={"サムネイル画像"}
        input={<ProductImageThumbnail src={iconUrl} onChange={onIconChanged} />}
      />

      <FormControl
        label={"プロダクト名"}
        input={
          <FormInput defaultValue={product.name} onSubmit={onNameSubmitted} />
        }
      />
      <FormControl
        label={"説明"}
        input={
          <FormInput
            defaultValue={product.description}
            multiline={true}
            onSubmit={onDescriptionSubmitted}
          />
        }
      />

      <FormControl
        label={"作成日"}
        input={<FormInput readonly={true} defaultValue={createdDate} />}
      />
    </StyledPaper>
  );
};

export default ProductDetailEditForm;
