import * as React from "react";

import styled from "styled-components";
import Paper from "@material-ui/core/Paper";
import StyledLink from "../helper/StyledLink";

const Root = styled.div``;
const StyledItemPaper = styled(Paper)``;
const Thumbnail = styled.img``;
const Info = styled.div``;
const Name = styled.div``;
const ActivatedDate = styled.div``;

const testOmakeList = [
  {
    id: "1",
    name: "すごいおまけ",
    imageUrl:
      "https://pbs.twimg.com/profile_images/650672536976388097/EtKqyP-E_400x400.png",
    activatedAt: new Date().toLocaleDateString()
  },
  {
    id: "2",
    name: "そこそこのおまけ",
    imageUrl:
      "https://pbs.twimg.com/profile_images/650672536976388097/EtKqyP-E_400x400.png",
    activatedAt: new Date().toLocaleDateString()
  }
];

const ActivatedOmakeList = () => {
  return (
    <Root>
      {testOmakeList.map(omake => {
        return (
          <StyledLink to={`/dashboard/activated/${omake.id}`} key={omake.id}>
            <StyledItemPaper key={omake.id}>
              <Thumbnail src={omake.imageUrl} />
              <Info>
                <Name>{omake.name}</Name>
                <ActivatedDate>{omake.activatedAt}</ActivatedDate>
              </Info>
            </StyledItemPaper>
          </StyledLink>
        );
      })}
    </Root>
  );
};

export default ActivatedOmakeList;
