import { firestore } from "firebase";

export enum AnalyticsType {
  SIMPLE_ACTIVATE_COUNT = "simple_activate_count",
  TIMELINE_VIEWS = "timeline_views",
  SUM_VIEWS = "sum_views",
  TIMELINE_DOWNLOADS = "timeline_downloads",
  SUM_DOWNLOADS = "sum_downloads"
}

export interface AbstractAnalyticsDocument<T> {
  type: AnalyticsType;
  data: T;
  ownerUid: string;
  productId: string;
  updatedAt: firestore.FieldValue;
}

export interface SimpleActivateCountAnalyticsDocument
  extends AbstractAnalyticsDocument<{
    total: number;
    timeline: {
      [date: string]: number;
    };
  }> {
  type: AnalyticsType.SIMPLE_ACTIVATE_COUNT;
}

export interface TimelineViewsAnalyticsDocument
  extends AbstractAnalyticsDocument<{
    [date: string]: number;
  }> {
  type: AnalyticsType.TIMELINE_VIEWS;
}

export interface SumViewsAnalyticsDocument
  extends AbstractAnalyticsDocument<number> {
  type: AnalyticsType.SUM_VIEWS;
}

export interface TimelineDownloadsAnalyticsDocument
  extends AbstractAnalyticsDocument<{
    [date: string]: number;
  }> {
  type: AnalyticsType.TIMELINE_DOWNLOADS;
}

export interface SumDownloadsAnalyticsDocument
  extends AbstractAnalyticsDocument<number> {
  type: AnalyticsType.SUM_DOWNLOADS;
}

export type AnalyticsDocument = SimpleActivateCountAnalyticsDocument;

export const CollectionPath = `analytics`;
