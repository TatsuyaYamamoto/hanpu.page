import React, { FC, useEffect, useState } from "react";
import styled from "styled-components";

import {
  VictoryLine,
  VictoryChart,
  VictoryTheme,
  VictoryBrushContainer,
  VictoryAxis,
  VictoryZoomContainer,
  DomainTuple
} from "victory";
import { Paper, Tabs, Tab } from "@material-ui/core";
import { useDebouncedCallback } from "use-debounce";

import useAnalytics from "../../hooks/useAnalytics";

const ChartRoot = styled.div`
  svg {
    max-height: calc(20rem);
    max-width: 100%;
    margin: 0 auto;
  }
`;

const zoomableGraphWidth = 550;
const zoomableGraphHeight = 300;
const fullScaleGraphWidth = zoomableGraphWidth;
const fullScaleGraphHeight = 100;

interface VisibleData {
  timeline: { x: Date; y: number }[];
  cumulative: { x: Date; y: number }[];
}

const UsageGraph: FC = () => {
  const analytics = useAnalytics();
  const [total, setTotal] = useState("");
  const [visibleData, setVisibleData] = useState<VisibleData>({
    timeline: [],
    cumulative: []
  });

  useEffect(() => {
    (async () => {
      const simpleActivateCount = await analytics.loadSimpleActivateCount();
      if (simpleActivateCount) {
        const {
          total: rowTimeline,
          timeline: rowTimelineDatumMap
        } = simpleActivateCount[0].data;
        const rowTimelineData = Object.keys(rowTimelineDatumMap)
          .map(date => {
            return {
              x: date,
              y: rowTimelineDatumMap[date]
            };
          })
          .sort((a, b) => (a.x < b.x ? -1 : 1));

        const timelineData: { x: Date; y: number }[] = [];
        const cumulativeData: { x: Date; y: number }[] = [];

        rowTimelineData.forEach(({ x, y }, index) => {
          const prevCount = cumulativeData[index - 1]?.y ?? 0;

          timelineData.push({ x: new Date(x), y });
          cumulativeData.push({ x: new Date(x), y: y + prevCount });
        });

        setVisibleData({
          timeline: timelineData,
          cumulative: cumulativeData
        });
        setTotal(rowTimeline.toString(10));
      }
    })();
  }, []);

  const [zoomDomain, setZoomDomain] = useState<
    { x?: DomainTuple; y: DomainTuple } | undefined
  >(undefined);
  const [handleBrush] = useDebouncedCallback(
    (domain: { x?: DomainTuple; y: DomainTuple }) => {
      setZoomDomain(domain);
    },
    500
  );

  return (
    <Paper>
      <Tabs
        value={0}
        indicatorColor="primary"
        textColor="primary"
        aria-label="disabled tabs example"
      >
        <Tab label={`アクティベーション数 (${total})`} />
      </Tabs>

      <ChartRoot>
        <VictoryChart
          scale={{ x: "time" }}
          width={zoomableGraphWidth}
          height={zoomableGraphHeight}
          theme={VictoryTheme.material}
          containerComponent={
            <VictoryZoomContainer
              responsive={false}
              zoomDimension="x"
              zoomDomain={zoomDomain}
            />
          }
        >
          <VictoryLine
            data={visibleData.timeline}
            style={{
              data: { stroke: "tomato" }
            }}
          />
          <VictoryLine
            data={visibleData.cumulative}
            style={{
              data: { stroke: "blue" }
            }}
          />
        </VictoryChart>
        <VictoryChart
          width={fullScaleGraphWidth}
          height={fullScaleGraphHeight}
          scale={{ x: "time" }}
          padding={{ top: 0, left: 50, right: 50, bottom: 30 }}
          containerComponent={
            <VictoryBrushContainer
              responsive={false}
              brushDimension="x"
              // @ts-ignore
              onBrushDomainChange={handleBrush}
            />
          }
        >
          <VictoryAxis
            tickValues={[
              new Date(2019, 1, 1),
              new Date(2020, 1, 1),
              new Date(2021, 1, 1)
            ]}
            // TODO
            // tslint:disable-next-line
            tickFormat={x => new Date(x).getFullYear()}
          />
          <VictoryLine
            style={{
              data: { stroke: "tomato" }
            }}
            data={visibleData.timeline}
          />
          <VictoryLine
            style={{
              data: { stroke: "blue" }
            }}
            data={visibleData.cumulative}
          />
        </VictoryChart>
      </ChartRoot>
    </Paper>
  );
};

export default UsageGraph;
