import * as React from "react";

import styled from "styled-components";

import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelActions from "@material-ui/core/ExpansionPanelActions";
import Typography from "@material-ui/core/Typography";
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

const OmakeItemListItemRoot = styled.div`
  width: 100%;
`;

const fileTypes = [
  {
    value: "USD",
    label: "$"
  },
  {
    value: "EUR",
    label: "€"
  },
  {
    value: "BTC",
    label: "฿"
  },
  {
    value: "JPY",
    label: "¥"
  }
];

const CancelButton = () => (
  <Button size="small" color="primary">
    <CancelIcon />
    Cancel
  </Button>
);

const EditButton = () => (
  <Button size="small" color="primary">
    <EditIcon />
    Edit
  </Button>
);

const DeleteButton = () => (
  <Button size="small" color="primary">
    <DeleteIcon />
    Delete
  </Button>
);

const SaveButton = () => (
  <Button size="small" color="primary">
    <SaveIcon />
    Save
  </Button>
);

type State = "editting";

const OmakeItemListItem: React.FC = () => {
  const [isEditing, setEditing] = React.useState(false);

  return (
    <OmakeItemListItemRoot>
      <ExpansionPanel defaultExpanded={true} expanded={true}>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <TextField label={"title is here"} />
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Grid container={true}>
            <TextField label={"Description"} multiline={true} />
          </Grid>

          <Grid container={true}>
            <TextField label={"file path"} />
          </Grid>
        </ExpansionPanelDetails>
        <Divider />
        <ExpansionPanelActions>
          {isEditing ? (
            <React.Fragment>
              <CancelButton />
              <SaveButton />
            </React.Fragment>
          ) : (
            <React.Fragment>
              <EditButton />
              <DeleteButton />
            </React.Fragment>
          )}
        </ExpansionPanelActions>
      </ExpansionPanel>
    </OmakeItemListItemRoot>
  );
};

const OmakeItemListRoot = styled.div``;

interface OmakeItemListProps {
  items: any[];
}

const OmakeItemList: React.FC<OmakeItemListProps> = props => {
  const { items, ...others } = props;

  return (
    <OmakeItemListRoot {...others}>
      {items.map(({ key }) => (
        <OmakeItemListItem key={key} />
      ))}
    </OmakeItemListRoot>
  );
};

export default OmakeItemList;
