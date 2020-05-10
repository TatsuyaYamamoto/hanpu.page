import * as React from "react";
import TextAvatarChip from "../TextAvatarChip";

export default { title: "TextAvatarChip" };

export const withSmall = () => (
  <TextAvatarChip avatar={`有効期限`} label={`2019/6/18`} />
);

export const withLarge = () => (
  <TextAvatarChip
    avatar={`有効期限有効期限有効期限`}
    label={`2019/6/182019/6/182019/6/182019/6/18`}
  />
);
