const useGa = () => {
  const gtagPageView = (pathname: string) => {
    // @ts-ignore
    gtag("config", GA_TRACKING_ID, { page_path: pathname });
  };

  const gtagError = (description: string, fatal = false) => {
    // @ts-ignore
    gtag("event", "exception", {
      description,
      fatal
    });
  };

  return { gtagPageView, gtagError };
};

export default useGa;
