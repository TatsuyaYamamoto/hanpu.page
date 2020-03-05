import * as React from "react";

import styled, { ThemeProps } from "styled-components";
import { Theme as MuiTheme } from "@material-ui/core/styles";

import Paper, { PaperProps } from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import TextField, { TextFieldProps } from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import LocalOffer from "@material-ui/icons/LocalOffer";
import Button from "@material-ui/core/Button";

const StyledPaper = styled(Paper)`
  padding: ${({ theme }: ThemeProps<MuiTheme>) => theme.spacing(2)}px;
` as React.FC<PaperProps>;

const StyledTextField = styled(TextField)`
  padding-top: ${({ theme }: ThemeProps<MuiTheme>) => theme.spacing(1)}px;
` as React.FC<TextFieldProps>;

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
      <StyledTextField
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
