import { useState } from "react";

export const useAssignableState = <T>(
  initialState: T
): [T, (value: Partial<T>) => void] => {
  const [state, dispatch] = useState<T>(initialState);

  const assignableDispatcher = (value: Partial<T>) => {
    dispatch((prev: T) => ({ ...prev, ...value }));
  };

  return [state, assignableDispatcher];
};
