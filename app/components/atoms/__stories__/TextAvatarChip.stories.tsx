import * as React from "react";
import LetterAvatar from "../LetterAvatar";

export default { title: "LetterAvatar" };

export const withSmall = () => <LetterAvatar>有効</LetterAvatar>;

export const withMiddle = () => <LetterAvatar>有効期限</LetterAvatar>;

export const withLarge = () => (
  <LetterAvatar>めちゃめちゃながいゆうこうきげん</LetterAvatar>
);
