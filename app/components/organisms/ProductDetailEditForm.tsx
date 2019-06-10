import * as React from "react";
const { useEffect } = React;

import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";

import IdField from "../atoms/IdField";
import EditableField from "../atoms/EditableField";
import ProductImageThumbnail from "../molecules/ProductImageThumbnail";

import {
  Product,
  ProductDescription,
  ProductDocument,
  ProductName
} from "../../domains/Product";

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
    <Grid container={true}>
      <Box display="flex">
        <Box>
          <ProductImageThumbnail src={iconUrl} onChange={onIconChanged} />
        </Box>

        <Box>
          <IdField id={product.id} />

          <EditableField
            label={"Name"}
            defaultValue={product.name}
            onSubmit={onNameSubmitted}
          />

          <EditableField
            label={"Description"}
            defaultValue={product.description}
            multiline={true}
            onSubmit={onDescriptionSubmitted}
          />

          <TextField
            label={"created"}
            value={product.createdAt.toDateString()}
          />
        </Box>
      </Box>
    </Grid>
  );
};

export default ProductDetailEditForm;
