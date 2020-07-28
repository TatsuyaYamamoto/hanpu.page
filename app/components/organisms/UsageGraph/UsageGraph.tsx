import React, { FC, useEffect, useState, ChangeEvent } from "react";
import styled from "styled-components";

import {
  VictoryLine,
  VictoryChart,
  VictoryTheme,
  VictoryBrushContainer,
  VictoryAxis,
  VictoryTooltip,
  DomainTuple,
  createContainer,
  VictoryZoomContainerProps,
  VictoryVoronoiContainerProps,
  VictoryTooltipProps
} from "victory";
import {
  Paper,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from "@material-ui/core";
import { useDebouncedCallback } from "use-debounce";
import moment from "moment-timezone";

import useAnalytics from "../../hooks/useAnalytics";
import { Product } from "../../../domains/Product";
import useFirebase from "../../hooks/useFirebase";
import useDlCodeUser from "../../hooks/useDlCodeUser";

const zoomableGraphWidth = 550;
const zoomableGraphHeight = 300;
const fullScaleGraphWidth = zoomableGraphWidth;
const fullScaleGraphHeight = 100;

/**
 * @see https://formidable.com/open-source/victory/docs/create-container/
 */
const VictoryZoomVoronoiContainer = createContainer<
  VictoryZoomContainerProps,
  VictoryVoronoiContainerProps
>("zoom", "voronoi");

interface GraphData {
  timeline: { x: Date; y: number; type: "timeline" }[];
  cumulative: { x: Date; y: number; type: "cumulative" }[];
}

const CustomTooltip: FC<VictoryTooltipProps> = props => {
  const { datum, x, y } = props;
  const d = datum as any;
  const date = moment(d.x)
    .tz("Asia/Tokyo")
    .format("YYYY-MM-DD");
  // @ts-ignore
  const { activePoints } = props;

  return (
    <g style={{ pointerEvents: "none" }}>
      <foreignObject x={x} y={y} width="150" height="100">
        <div className="graph-tooltip">
          <div>{date}</div>
          <div>
            {activePoints.map((point: any) => (
              <div key={point.type}>
                {point.type === "timeline" ? "日別" : "累計"}: {point.y}
              </div>
            ))}
          </div>
        </div>
      </foreignObject>
    </g>
  );
};

const AnalyticsGraphRoot = styled.div`
  svg {
    max-height: calc(20rem);
    max-width: 100%;
    margin: 0 auto;
  }
`;

const AnalyticsGraph: FC<{ data: GraphData }> = props => {
  const { data } = props;
  const [zoomDomain, setZoomDomain] = useState<
    { x?: DomainTuple; y: DomainTuple } | undefined
  >(undefined);
  const [handleBrush] = useDebouncedCallback(
    (domain: { x?: DomainTuple; y: DomainTuple }) => {
      setZoomDomain(domain);
    },
    500
  );

  const dummyLabels = () => `_`;

  const maxTimelineY = Math.max(...data.timeline.map(d => d.y));
  const normalizeTimelineY = (datum: any) => datum.y / maxTimelineY;
  const timelineTickFormat = (t: any) => Math.round(t * maxTimelineY);

  const maxCumulativeY = Math.max(...data.cumulative.map(d => d.y));
  const normalizeCumulativeY = (datum: any) => datum.y / maxCumulativeY;
  const cumulativeTickFormat = (t: any) => Math.round(t * maxCumulativeY);

  return (
    <AnalyticsGraphRoot>
      <VictoryChart
        scale={{ x: "time" }}
        width={zoomableGraphWidth}
        height={zoomableGraphHeight}
        theme={VictoryTheme.material}
        containerComponent={
          <VictoryZoomVoronoiContainer
            // zoom
            responsive={false}
            zoomDimension="x"
            zoomDomain={zoomDomain}
            // voronoi
            voronoiDimension="x"
            labels={dummyLabels}
            labelComponent={
              <VictoryTooltip
                constrainToVisibleArea={true}
                flyoutComponent={<CustomTooltip />}
              />
            }
          />
        }
      >
        <VictoryAxis
          dependentAxis={true}
          tickValues={[0, 0.5, 1]}
          tickFormat={timelineTickFormat}
          offsetX={50}
          style={{
            ticks: { padding: 0 },
            tickLabels: { textAnchor: "end" }
          }}
        />
        <VictoryAxis
          dependentAxis={true}
          tickValues={[0, 0.5, 1]}
          tickFormat={cumulativeTickFormat}
          offsetX={500}
          style={{
            ticks: { padding: -50 },
            tickLabels: { textAnchor: "end" }
          }}
        />
        <VictoryAxis dependentAxis={false} />
        <VictoryLine
          data={data.timeline}
          style={{
            data: { stroke: "tomato" },
            labels: { fill: "tomato" }
          }}
          y={normalizeTimelineY}
        />
        <VictoryLine
          data={data.cumulative}
          style={{
            data: { stroke: "blue" }
          }}
          y={normalizeCumulativeY}
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
        <VictoryAxis />
        <VictoryLine
          style={{
            data: { stroke: "tomato" }
          }}
          data={data.timeline}
          y={normalizeTimelineY}
        />
        <VictoryLine
          style={{
            data: { stroke: "blue" }
          }}
          data={data.cumulative}
          y={normalizeCumulativeY}
        />
      </VictoryChart>
    </AnalyticsGraphRoot>
  );
};

const UsageGraph: FC = () => {
  const analytics = useAnalytics();
  const { app: firebaseApp } = useFirebase();
  const { user: dlCodeUser } = useDlCodeUser();

  const [total, setTotal] = useState("");
  const [loadedProducts, setLoadedProducts] = React.useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = React.useState<
    string | null
  >(null);
  const [graphData, setGraphData] = useState<GraphData>({
    timeline: [],
    cumulative: []
  });

  useEffect(() => {
    if (!selectedProductId) {
      return;
    }

    (async () => {
      const simpleActivateCount = await analytics.loadSimpleActivateCount(
        selectedProductId
      );

      if (1 <= simpleActivateCount.length) {
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

        const timelineData: { x: Date; y: number; type: "timeline" }[] = [];
        const cumulativeData: { x: Date; y: number; type: "cumulative" }[] = [];

        rowTimelineData.forEach(({ x, y }, index) => {
          const prevCount = cumulativeData[index - 1]?.y ?? 0;

          timelineData.push({ x: new Date(x), y, type: "timeline" });
          cumulativeData.push({
            x: new Date(x),
            y: y + prevCount,
            type: "cumulative"
          });
        });

        setGraphData({
          timeline: timelineData,
          cumulative: cumulativeData
        });
        setTotal(rowTimeline.toString(10));
      }
    })();
  }, [selectedProductId]);

  useEffect(() => {
    if (!dlCodeUser) {
      return;
    }

    const unsubscribe = Product.watchList(
      dlCodeUser.uid,
      firebaseApp.firestore(),
      owns => {
        setLoadedProducts(owns);
        if (0 < owns.length) {
          setSelectedProductId(owns[0].id);
        }
      }
    );

    return () => {
      unsubscribe();
    };
  }, [firebaseApp, dlCodeUser]);

  const onSelectProduct = (event: ChangeEvent<{ value: unknown }>) => {
    setSelectedProductId(event.target.value as string);
  };

  return (
    <Paper style={{ margin: "0 auto" }}>
      <FormControl variant="outlined" style={{ minWidth: 200 }}>
        <InputLabel>プロダクト</InputLabel>
        <Select
          value={selectedProductId ?? "loading"}
          onChange={onSelectProduct}
        >
          {loadedProducts.length === 0 && (
            <MenuItem value="loading">Loading...</MenuItem>
          )}
          {loadedProducts.map(p => (
            <MenuItem key={p.id} value={p.id}>
              {p.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Tabs
        value={0}
        indicatorColor="primary"
        textColor="primary"
        aria-label="disabled tabs example"
      >
        <Tab label={`アクティベーション数 (${total})`} />
      </Tabs>
      <AnalyticsGraph data={graphData} />
    </Paper>
  );
};

export default UsageGraph;
