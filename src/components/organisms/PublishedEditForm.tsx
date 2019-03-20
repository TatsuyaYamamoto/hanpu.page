import * as React from "react";

import styled from "styled-components";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";

import { useDropzone } from "react-dropzone";

import { getLogger } from "../../logger";
import QrCodeView from "../molecules/QrCodeView";
import OmakeItemList from "./OmakeItemList";

const logger = getLogger("drawer");
const Root = styled.div``;

const StyledTextField = styled(TextField)`
  margin-left: ${({ theme }) => theme.spacing.unit}px;
  margin-right: ${({ theme }) => theme.spacing.unit}px;
  width: 200px;
`;

const dropAreaSize = 150;

const DropAreaRoot = styled.div`
  height: ${dropAreaSize}px;
  min-width: ${dropAreaSize}px;
  border: 2px dashed #ccc;

  outline: 0;

  &:hover {
    //border: 2px dashed #ccc;
    box-shadow: 0 3px 15px rgba(0, 0, 0, 0.2);
    transition: all 0.3s;
  }
`;

const DropAreaInput = styled.input``;

const Preview = styled.img`
  width: ${dropAreaSize}px;
  height: ${dropAreaSize}px;
  object-fit: contain;
`;

interface ActivationCodeForm {}

const PublishedEditForm: React.FunctionComponent<
  ActivationCodeForm
> = props => {
  const { ...others } = props;

  // input value status list
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");

  const onChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value.trim());
  };

  const onChangeDescription = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value.trim());
  };

  // todo validate
  const handleButtonDisable = name === "" || description === "";

  const [previewSrc, setPreviewSrc] = React.useState(null);

  const onDrop = React.useCallback((acceptedFiles: File[]) => {
    logger.info("dragged file.");
    acceptedFiles.forEach(file => {
      logger.info(`name: ${file.name}, size: ${file.size}`);

      const reader = new FileReader();
      reader.onload = () => {
        logger.info(`on loaded.`);

        setPreviewSrc(reader.result);
      };
      reader.readAsDataURL(file);
    });
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: "image/*",
    multiple: false
  });

  return (
    <Root {...others}>
      <Grid container={true} alignItems="center">
        <div>Thumbnail</div>

        <DropAreaRoot {...getRootProps()}>
          <DropAreaInput {...getInputProps()} />
          {previewSrc ? (
            <Preview src={previewSrc} />
          ) : isDragActive ? (
            <p>Drop the files here ...</p>
          ) : (
            <p>DnD here!</p>
          )}
        </DropAreaRoot>
      </Grid>

      <Grid container={true} justify={"space-between"} alignItems="center">
        <Grid item={true} xs={true}>
          <StyledTextField
            label="Omake Name"
            margin="normal"
            fullWidth={true}
            InputProps={{
              readOnly: true
            }}
            onChange={onChangeName}
          />
        </Grid>
        <Grid item={true} xs={2}>
          <Button>Edit</Button>
        </Grid>
      </Grid>

      <Grid container={true} justify={"space-between"} alignItems="center">
        <Grid item={true} xs={true}>
          <StyledTextField
            label="Description"
            multiline={true}
            margin="normal"
            fullWidth={true}
            InputProps={{
              readOnly: true
            }}
            onChange={onChangeDescription}
          />
        </Grid>
        <Grid item={true} xs={2}>
          <Button>Edit</Button>
        </Grid>
      </Grid>

      <Grid container={true} alignItems="center">
        <div>Activation Code</div>
        <QrCodeView text={"hogehoge"} />
        <p>
          {`このQRコードを読み込むことで、Omakeをダウンロード出来るようになります。`}
        </p>
      </Grid>

      <Grid container={true} justify={"space-between"} alignItems="center">
        <OmakeItemList items={[{ key: 1 }, { key: 2 }, { key: 3 }]} />
      </Grid>
    </Root>
  );
};

export { ActivationCodeForm };
export default PublishedEditForm;
