import * as React from "react";

import styled from "styled-components";
import Paper from "@material-ui/core/Paper";
import StyledLink from "../helper/StyledLink";
import { Omake } from "../../domain/Omake";

const Root = styled.div``;
const StyledItemPaper = styled(Paper)``;
const Thumbnail = styled.img``;
const Info = styled.div``;
const Name = styled.div``;
const CreatedDate = styled.div``;

interface PublishedOmakeListProps {}

interface PublishedOmakeListState {
  omakes: Map<string, Omake>;
}

class PublishedOmakeList extends React.Component<
  PublishedOmakeListProps,
  PublishedOmakeListState
> {
  constructor(params: any) {
    super(params);

    this.state = {
      omakes: new Map()
    };
  }

  public componentDidMount(): void {
    Omake.getOwnPublishes().then(omakes => {
      this.setState({ omakes });
    });
  }

  public render(): React.ReactNode {
    const { omakes } = this.state;

    const listItem: any[] = [];
    omakes.forEach((omake, id) => {
      listItem.push(
        <StyledLink to={`/dashboard/publishes/${id}`} key={id}>
          <StyledItemPaper>
            <Thumbnail src={``} />
            <Info>
              <Name>{omake.name}</Name>
              <CreatedDate>{omake.createdAt.toLocaleDateString()}</CreatedDate>
            </Info>
          </StyledItemPaper>
        </StyledLink>
      );
    });

    return <Root>{listItem}</Root>;
  }
}

export default PublishedOmakeList;
