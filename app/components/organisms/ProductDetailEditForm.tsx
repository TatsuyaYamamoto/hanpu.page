import * as React from "react";

import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";

import IdField from "../atoms/IdField";
import EditableField from "../atoms/EditableField";
import ProductImageThumbnail from "../molecules/ProductImageThumbnail";

import { Product } from "../../domains/Product";

interface ProductDetailEditFormProps {
  product: Product;
}

const ProductDetailEditForm: React.FC<ProductDetailEditFormProps> = ({
  product
}) => {
  const [iconUrl, setIconUrl] = React.useState<string | null>(null);

  React.useEffect(() => {
    product.getIconUrl().then(url => {
      setIconUrl(url);
    });
  }, []);

  const onNameSubmitted = () => {
    //
  };

  const onDescriptionSubmitted = () => {
    //
  };

  const onIconChanged = (file: File) => {
    product.uploadIconToStorage(file);
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

          <EditableField
            label={"Private note"}
            defaultValue={product.privateNote}
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
