import { default as React, FC } from "react";
import { Chip } from "@material-ui/core";

import styled from "styled-components";

const TextAvatar = styled.span`
  // Mui-ChipAvatarに上書きされないため
  width: inherit !important;
  height: auto !important;
  color: #fafafa !important;

  //display: inline-block;
  background-color: #bdbdbd;
  padding: 2px 10px;
  border-radius: 24px;
`;

interface TextAvatarChipProps {
  avatar: string;
  label: string;
}

const TextAvatarChip: FC<TextAvatarChipProps> = props => {
  const { avatar, label } = props;
  return (
    <Chip
      variant="outlined"
      avatar={<TextAvatar>{avatar}</TextAvatar>}
      label={label}
    />
  );
};

export default TextAvatarChip;
