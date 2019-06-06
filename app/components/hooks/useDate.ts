import { useEffect, useState } from "react";

import * as dateFormat from "dateformat";

const useDate = () => {
  const [now, setNow] = useState<Date>();

  useEffect(() => {
    setNow(new Date());
  }, []);

  const formattedNow = (mask?: string): string => {
    return dateFormat(now, mask);
  };

  return {
    now,
    formattedNow
  };
};

export default useDate;
