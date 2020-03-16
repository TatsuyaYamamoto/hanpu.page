import { default as React, FC, useState } from "react";

import {
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  ListItemIcon,
  ListItemText
} from "@material-ui/core";
import LogoutIcon from "@material-ui/icons/ExitToApp";

interface UserIconMenuProps {
  iconUrl: string;
  onLogoutClicked: () => void;
}

const UserIconMenu: FC<UserIconMenuProps> = props => {
  const { iconUrl, onLogoutClicked } = props;
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event?: any) => {
    setAnchorEl(open ? null : event.currentTarget);
  };

  const onLogout = () => {
    onLogoutClicked();
  };

  return (
    <>
      <IconButton onClick={handleMenu}>
        <Avatar src={iconUrl} />
      </IconButton>
      <Menu
        keepMounted={true}
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenu}
        getContentAnchorEl={null}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center"
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center"
        }}
      >
        <MenuItem onClick={onLogout}>
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary={`ログアウト`} />
        </MenuItem>
      </Menu>
    </>
  );
};

export default UserIconMenu;
