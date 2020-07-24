import { firestore } from "firebase/app";

import {
  AnalyticsDocument,
  AnalyticsType,
  CollectionPath as AnalyticsCollectionPath
} from "../../domains/Analytics";
import useFirebase from "./useFirebase";

// const log = (message?: any, ...optionalParams: any[]): void => {
//   // tslint:disable-next-line
//   console.log(`[useAnalytics] ${message}`, ...optionalParams);
// };

const useAnalytics = () => {
  const { user } = useFirebase();

  // prettier-ignore
  const analyticsColRef = firestore().collection(AnalyticsCollectionPath) as firestore.CollectionReference<AnalyticsDocument>;

  const loadSimpleActivateCount = async (productId: string) => {
    if (!user) {
      throw new Error("firebase user is not initialized");
    }

    const snap = await analyticsColRef
      .where("type", "==", AnalyticsType.SIMPLE_ACTIVATE_COUNT)
      .where("ownerUid", "==", user.uid)
      .where("productId", "==", productId)
      .get();

    return snap.docs.map(doc => doc.data());
  };

  return {
    loadSimpleActivateCount
  };
};

export default useAnalytics;
