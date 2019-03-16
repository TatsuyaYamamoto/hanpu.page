import * as React from "react";

import styled from "styled-components";
import grey from "@material-ui/core/colors/grey";
import Avatar from "@material-ui/core/Avatar";
import { ListItem } from "@material-ui/core";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";

import { LoginSessionContext } from "../helper/LoginSession";

const FakeName = styled.div`
  background-color: ${grey[200]};
  height: ${({ theme }) => theme.spacing.unit}px;
  margin: ${({ theme }) => theme.spacing.unit * 2}px;
`;

interface IBaseProps {
  name: any;
  url: string;
}
const Base: React.FunctionComponent<IBaseProps> = props => {
  const { name, url } = props;
  return (
    <ListItem>
      <ListItemAvatar>
        <Avatar src={url} />
      </ListItemAvatar>
      <ListItemText primary={name} />
    </ListItem>
  );
};

const LoginUserDrawerItem: React.FunctionComponent = props => {
  const { ...others } = props;
  return (
    <LoginSessionContext.Consumer>
      {({ firebaseUser }) => {
        if (!firebaseUser) {
          return <Base url={""} name={<FakeName />} {...others} />;
        }

        const {
          // TODO show twitter display name
          displayName,
          photoURL
        } = firebaseUser;

        return <Base url={photoURL} name={displayName} {...others} />;
      }}
    </LoginSessionContext.Consumer>
  );
};

export default LoginUserDrawerItem;
