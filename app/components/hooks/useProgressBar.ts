import NProgress from "nprogress";

/**
 * Routing progress is defined in {@link MyApp class}
 */
const useProgressBar = () => {
  const start = () => {
    NProgress.start();
  };
  const stop = () => {
    NProgress.done();
  };

  return {
    start,
    stop
  };
};

export default useProgressBar;
