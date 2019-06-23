const useGa = () => {
  const gtagPageView = (pathname: string) => {
    // @ts-ignore
    gtag("config", GA_TRACKING_ID, { page_path: pathname });
  };
  return { gtagPageView };
};

export default useGa;
