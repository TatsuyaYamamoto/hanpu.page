import React, { FC } from "react";
import styled from "styled-components";

import { VictoryBar, VictoryChart, VictoryTheme, VictoryAxis } from "victory";
import { Paper, Tabs, Tab } from "@material-ui/core";

const data = [
  { quarter: 1, earnings: 13000 },
  { quarter: 2, earnings: 16500 },
  { quarter: 3, earnings: 14250 },
  { quarter: 4, earnings: 19000 }
];

const ChartRoot = styled.div`
  svg {
    max-height: calc(20rem);
    max-width: 100%;
    margin: 0 auto;
  }
`;

const UsageGraph: FC = () => {
  return (
    <Paper>
      <Tabs
        value={0}
        indicatorColor="primary"
        textColor="primary"
        aria-label="disabled tabs example"
      >
        <Tab label="総ダウンロード数" />
      </Tabs>

      <ChartRoot>
        <VictoryChart
          // height={333}
          // domainPadding will add space to each side of VictoryBar to
          // prevent it from overlapping the axis
          // domainPadding={20}
          theme={VictoryTheme.material}
        >
          <VictoryBar data={data} x="quarter" y="earnings" />
          <VictoryAxis
            // tickValues specifies both the number of ticks and where
            // they are placed on the axis
            tickValues={[1, 2, 3, 4]}
            tickFormat={["Quarter 1", "Quarter 2", "Quarter 3", "Quarter 4"]}
          />
          <VictoryAxis dependentAxis={true} />
          <VictoryBar data={data} x="quarter" y="earnings" />
        </VictoryChart>
      </ChartRoot>
    </Paper>
  );
};

export default UsageGraph;
