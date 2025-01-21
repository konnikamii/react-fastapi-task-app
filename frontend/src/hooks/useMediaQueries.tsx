import { useMediaQuery } from 'react-responsive';

const useMediaQueries = () => {
  return {
    isLandscape: useMediaQuery({ orientation: 'landscape' }),
    plus500h: useMediaQuery({ minHeight: 500 }),
    plus768h: useMediaQuery({ minHeight: 768 }),
    plus1080h: useMediaQuery({ minHeight: 1080 }),
    plus375: useMediaQuery({ minWidth: 375 }),
    plus425: useMediaQuery({ minWidth: 425 }),
    plus768: useMediaQuery({ minWidth: 768 }),
    plus1024: useMediaQuery({ minWidth: 1024 }),
    plus1440: useMediaQuery({ minWidth: 1440 }),
    plus550: useMediaQuery({ minWidth: 550 }),
  };
};

export default useMediaQueries;