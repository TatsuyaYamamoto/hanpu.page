import * as React from "react";

import Grid, { GridProps } from "@material-ui/core/Grid";

import styled from "styled-components";

const LabelArea: React.FC<GridProps> = styled(Grid)`
  flex-basis: 150px;
  // follow a style of InputBase
  // https://github.com/mui-org/material-ui/blob/master/packages/material-ui/src/InputBase/InputBase.js
  padding: ${8 - 2}px 0 ${8 - 1}px;
`;

const InputArea: React.FC<GridProps> = styled(Grid)``;

interface TextFieldProps {
  label: string;
  input: React.ReactNode;
}

const ProductDetailFormControl: React.FC<TextFieldProps> = ({
  label,
  input
}) => {
  return (
    <Grid container={true}>
      <LabelArea item={true}>{label}</LabelArea>
      <InputArea item={true} xs={true}>
        {input}
      </InputArea>
    </Grid>
  );
};

export default ProductDetailFormControl;
