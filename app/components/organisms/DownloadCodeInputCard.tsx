import * as React from "react";

import styled, { ThemeProps } from "styled-components";
import { Theme as MuiTheme } from "@material-ui/core/styles";

import Grid from "@material-ui/core/Grid";
import Paper, { PaperProps } from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import InputAdornment from "@material-ui/core/InputAdornment";
import TextField, { TextFieldProps } from "@material-ui/core/TextField";
import LocalOffer from "@material-ui/icons/LocalOffer";
import Button from "@material-ui/core/Button";

const StyledPaper: React.FC<PaperProps> = styled(Paper)`
  padding: ${({ theme }: ThemeProps<MuiTheme>) => {
    return theme.spacing(2);
  }}px;
`;

const StyledInputField = styled(TextField)`
  padding-top: ${({ theme }: ThemeProps<MuiTheme>) => {
    return theme.spacing(1);
  }}px;
` as React.FC<TextFieldProps>; // TODO: fix type check without casting.

interface DownloadCodeInputCardProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
}
const DownloadCodeInputCard: React.FC<DownloadCodeInputCardProps> = ({
  value,
  onChange,
  onSubmit
}) => {
  const disableSubmit = value.length === 0;

  return (
    <StyledPaper>
      <Typography>ダウンロードコードを入力してください</Typography>
      <StyledInputField
        value={value}
        onChange={onChange}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <LocalOffer />
            </InputAdornment>
          )
        }}
      />
      <Button
        variant="contained"
        color="primary"
        disabled={disableSubmit}
        onClick={onSubmit}
      >
        実行
      </Button>
    </StyledPaper>
  );
};

export default DownloadCodeInputCard;
