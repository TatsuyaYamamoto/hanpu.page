import * as React from "react";

import styled from "styled-components";

import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelActions from "@material-ui/core/ExpansionPanelActions";
import Typography from "@material-ui/core/Typography";
import InputBase from "@material-ui/core/InputBase";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import Divider from "@material-ui/core/Divider";

import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons/Cancel";
import AddIcon from "@material-ui/icons/Add";
import { makeStyles } from "@material-ui/styles";

const OmakeItemListItemRoot = styled.div`
  width: 100%;
`;

const CancelButton = (props: any) => {
  const { ...others } = props;
  return (
    <Button size="small" color="primary" {...others}>
      <CancelIcon />
      Cancel
    </Button>
  );
};

const EditButton = (props: any) => {
  const { ...others } = props;
  return (
    <Button size="small" color="primary" {...others}>
      <EditIcon />
      Edit
    </Button>
  );
};

const DeleteButton = (props: any) => {
  const { ...others } = props;
  return (
    <Button size="small" color="primary" {...others}>
      <DeleteIcon />
      Delete
    </Button>
  );
};

const SaveButton = (props: any) => {
  const { ...others } = props;
  return (
    <Button size="small" color="primary" {...others}>
      <SaveIcon />
      Save
    </Button>
  );
};

const AddItemButton = (props: any) => {
  const { ...others } = props;
  return (
    <Button size="small" color="primary" {...others}>
      <AddIcon />
      ファイルを追加する
    </Button>
  );
};

const fileType = [
  {
    value: "wav_24bit",
    label: "WAV 24bit"
  },
  {
    value: "flac_16bit",
    label: "FLAC 16bit"
  }
];

const useStyles = makeStyles({
  container: {
    display: "flex",
    flexWrap: "wrap"
  },
  textField: {
    // marginLeft: theme.spacing.unit, TODO
    // marginRight: theme.spacing.unit, TODO
    // marginLeft: 15,
    // marginRight: 15,
    width: 200
  },
  dense: {
    marginTop: 19
  },
  menu: {
    width: 200
  }
});

const OmakeItemListItem: React.FC = () => {
  const [isExpanding, setExpanding] = React.useState(false);
  const [isEditing, setEditing] = React.useState(false);
  const classes = useStyles();

  const onHandleExpand = (event: React.ChangeEvent<{}>, expanded: boolean) => {
    if (isEditing) {
      return;
    }
    setExpanding(expanded);
  };

  const onEditClicked = () => {
    setEditing(true);
  };

  const onCancelClicked = () => {
    setEditing(false);
  };

  return (
    <ExpansionPanel expanded={isExpanding} onChange={onHandleExpand}>
      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
        {isEditing ? (
          <TextField value={"title is here"} />
        ) : (
          <InputBase value={"title is here"} readOnly={true} />
        )}
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        <Grid container={true} alignItems={"center"}>
          <Grid item={true}>
            {isEditing ? (
              <TextField
                id="standard-select-currency"
                select={true}
                className={classes.textField}
                value={`wav_24bit`}
                SelectProps={{
                  MenuProps: {
                    className: classes.menu
                  }
                }}
                margin="normal"
              >
                {fileType.map(({ value, label }) => (
                  <MenuItem key={value} value={value}>
                    {label}
                  </MenuItem>
                ))}
              </TextField>
            ) : (
              <InputBase value={"wav_24bit"} readOnly={true} />
            )}
          </Grid>
          <Grid item={true}>
            {isEditing ? (
              <TextField value={"temp_file_path"} />
            ) : (
              <InputBase value={"temp_file_path"} readOnly={true} />
            )}
          </Grid>
        </Grid>
      </ExpansionPanelDetails>
      <Divider />
      <ExpansionPanelActions>
        {isEditing ? (
          <React.Fragment>
            <CancelButton onClick={onCancelClicked} />
            <SaveButton />
          </React.Fragment>
        ) : (
          <React.Fragment>
            <EditButton onClick={onEditClicked} />
            <DeleteButton />
          </React.Fragment>
        )}
      </ExpansionPanelActions>
    </ExpansionPanel>
  );
};

const TryAddingItem = (props: any) => {
  const { onCanceled } = props;
  const classes = useStyles();

  return (
    <ExpansionPanel expanded={true}>
      <ExpansionPanelSummary>
        <TextField value={"title is here"} />
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        <Grid container={true} alignItems={"center"}>
          <Grid item={true}>
            <TextField
              id="standard-select-currency"
              select={true}
              className={classes.textField}
              value={`wav_24bit`}
              SelectProps={{
                MenuProps: {
                  className: classes.menu
                }
              }}
              margin="normal"
            >
              {fileType.map(({ value, label }) => (
                <MenuItem key={value} value={value}>
                  {label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item={true}>
            <TextField value={"temp_file_path"} />
          </Grid>
        </Grid>
      </ExpansionPanelDetails>
      <Divider />
      <ExpansionPanelActions>
        <React.Fragment>
          <CancelButton onClick={onCanceled} />
          <SaveButton />
        </React.Fragment>
      </ExpansionPanelActions>
    </ExpansionPanel>
  );
};

const OmakeItemListRoot = styled.div``;

interface OmakeItemListProps {
  items: any[];
}

const OmakeItemList: React.FC<OmakeItemListProps> = props => {
  const { items, ...others } = props;

  const [isTryAdding, setTryAdding] = React.useState(false);

  const onAddClicked = () => {
    setTryAdding(true);
  };

  const onCancelClicked = () => {
    setTryAdding(false);
  };

  return (
    <OmakeItemListRoot {...others}>
      <AddItemButton onClick={onAddClicked} />
      <OmakeItemListItemRoot>
        {isTryAdding && <TryAddingItem onCanceled={onCancelClicked} />}

        {items.map(({ key }) => (
          <OmakeItemListItem key={key} />
        ))}
      </OmakeItemListItemRoot>
    </OmakeItemListRoot>
  );
};

export default OmakeItemList;
