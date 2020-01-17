import * as React from "react";

import styled, { ThemeProps } from "styled-components";
import { Theme as MuiTheme } from "@material-ui/core/styles";

import Paper, { PaperProps } from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import TextField, { TextFieldProps } from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import LocalOffer from "@material-ui/icons/LocalOffer";
import Button from "@material-ui/core/Button";

const StyledPaper = styled(Paper as React.FC<PaperProps>)`
  padding: ${({ theme }: ThemeProps<MuiTheme>) => theme.spacing(2)}px;
`;

const StyledInputField = styled(TextField as React.FC<TextFieldProps>)`
  padding-top: ${({ theme }: ThemeProps<MuiTheme>) => theme.spacing(1)}px;
`;

interface DownloadCodeInputCardProps {
  value: string;
  onChange: React.ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  >;
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
      <TextField />
      <StyledInputField />
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
