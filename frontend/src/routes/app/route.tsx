import { Outlet, createFileRoute } from "@tanstack/react-router";
import { authQueryOptions } from "../../utils_fetch/auth";
import { userQueryOptions } from "../../utils_fetch/fetch";
import { Suspense, createContext, useEffect, useState } from "react";
import "../../css/app.css";
import { useMediaQuery } from "react-responsive";
import { DimensionContextType, UserContextType } from "../../utils_other/types";
import AppNavbar from "../../components/app/AppNavbar.tsx";
import { ConfigProvider } from "antd";

export const DimensionContext = createContext<DimensionContextType>({
  isLandscape: window.innerWidth > window.innerHeight,
  //Y
  plus500h: window.innerHeight > 500,
  plus768h: window.innerHeight > 768,
  plus1080h: window.innerHeight > 1080,
  //X
  plus375: window.innerWidth > 375,
  plus425: window.innerWidth > 425,
  plus768: window.innerWidth > 768,
  plus1024: window.innerWidth > 1024,
  plus1440: window.innerWidth > 1440,
  //Extra
  plus550: window.innerWidth > 550,
});
export const UserContext = createContext<UserContextType>({
  theme: (localStorage.getItem("theme") as "light" | "dark" | null) ?? "light",
});

export const Route = createFileRoute("/app")({
  beforeLoad: async ({ context: { queryClient } }) => {
    const auth = await queryClient.ensureQueryData({
      ...authQueryOptions(),
      revalidateIfStale: true,
    });
    if (!auth) {
      window.location.href = "/login";
    }
  },
  loader: async ({ context: { queryClient } }) => {
    await Promise.all([queryClient.ensureQueryData(userQueryOptions())]);
  },
  component: App,
});

function App() {
  // #region Dimensions
  const isLandscape = useMediaQuery({ orientation: "landscape" });
  const plus500h = useMediaQuery({ minHeight: 500 });
  const plus768h = useMediaQuery({ minHeight: 768 });
  const plus1080h = useMediaQuery({ minHeight: 1080 });
  const plus375 = useMediaQuery({ minWidth: 375 });
  const plus425 = useMediaQuery({ minWidth: 425 });
  const plus768 = useMediaQuery({ minWidth: 768 });
  const plus1024 = useMediaQuery({ minWidth: 1024 });
  const plus1440 = useMediaQuery({ minWidth: 1440 });
  const plus550 = useMediaQuery({ minWidth: 550 });

  const [dimensions, setDimensions] = useState({
    isLandscape: isLandscape,
    //Y
    plus500h: plus500h,
    plus768h: plus768h,
    plus1080h: plus1080h,
    //X
    plus375: plus375,
    plus425: plus425,
    plus768: plus768,
    plus1024: plus1024,
    plus1440: plus1440,
    //Extra
    plus550: plus550,
  });
  useEffect(() => {
    const newDimensions = {
      isLandscape,
      plus500h,
      plus768h,
      plus1080h,
      plus375,
      plus425,
      plus768,
      plus1024,
      plus1440,
      plus550,
    };

    // Check if any value is different
    const hasChanged = (
      Object.keys(newDimensions) as (keyof typeof newDimensions)[]
    ).some((key) => newDimensions[key] !== dimensions[key]);

    if (hasChanged) {
      setDimensions(newDimensions);
    }
  }, [
    isLandscape,
    plus500h,
    plus768h,
    plus1080h,
    plus375,
    plus425,
    plus768,
    plus1024,
    plus1440,
    plus550,
    dimensions,
  ]);
  // #endregion

  const [theme, _] = useState<"light" | "dark">(() => {
    let newTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    if (!newTheme) {
      newTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
      localStorage.setItem("theme", newTheme);
      return newTheme;
    } else {
      return newTheme;
    }
  });
  const isLight = theme === "light";

  return (
    <>
      <DimensionContext.Provider value={dimensions}>
        <UserContext.Provider value={{ theme: theme }}>
          <AppNavbar>
            <ConfigProvider
              theme={{
                components: isLight
                  ? {
                      Select: {
                        hoverBorderColor: "gray",
                        activeBorderColor: "black",
                        activeOutlineColor: "#f3f4f6",
                      },
                      DatePicker: {
                        hoverBorderColor: "gray",
                        activeBorderColor: "black",
                        activeShadow: "black",
                        colorPrimary: "black", // underline
                        cellActiveWithRangeBg: "lightgray", // bg of cells in between
                      },
                      InputNumber: {
                        hoverBorderColor: "gray",
                        activeBorderColor: "black",
                        activeShadow: "black",
                      },
                      Modal: {
                        contentBg: "#f3f4f6",
                        headerBg: "#f3f4f6",
                      },
                      // Select: { zIndexPopup: 115},
                      // DatePicker: { zIndexPopup: 115},
                      // Dropdown: { zIndexPopup: 115}
                    }
                  : {
                      Select: {
                        colorBgContainer: "#2c2c2c",
                        colorBorder: "gray",
                        hoverBorderColor: "lightgray",
                        colorText: "white",
                        colorTextPlaceholder: "gray",
                        colorTextDescription: "gray",
                        colorTextDisabled: "gray",
                        multipleItemBg: "#434344",
                        multipleItemBorderColor: "gray",
                        colorTextQuaternary: "darkgray", // icons color
                        colorBgElevated: "#232a35", // bg of pop up container
                        optionActiveBg: "gray", // bg of option on hover
                        optionSelectedBg: "#2a5d97a8", // bg of selected option
                      },
                      DatePicker: {
                        colorBgContainer: "#2c2c2c",
                        colorBorder: "gray",
                        hoverBorderColor: "lightgray",
                        colorText: "white",
                        colorTextPlaceholder: "gray",
                        colorTextHeading: "white",
                        colorTextDescription: "white", // hover for X button
                        colorTextDisabled: "darkgray", // icons color
                        colorBgElevated: "#232a35", // bg of pop up container
                        cellActiveWithRangeBg: "darkgray", // bg of cells in between
                        colorIcon: "lightgray", // arrows in popup
                        colorIconHover: "gray", // hover arrows in popup

                        cellHoverBg: "#2a5d97a8", // hover for time picker
                        controlItemBgActive: "#1677ff", // bg selected cells for time picker
                      },
                      InputNumber: {
                        colorBgContainer: "#2c2c2c",
                        colorBorder: "gray",
                        hoverBorderColor: "lightgray",
                        colorText: "white",
                        colorTextPlaceholder: "gray",

                        handleBg: "#b3b3b391",
                        handleActiveBg: "white", // handle bg click
                        handleBorderColor: "gray",
                        colorTextDescription: "white", // handle fill
                        handleHoverColor: "white", // handle fill on hover
                      },
                      Input: {
                        colorBgContainer: "#2c2c2c",
                        colorBgContainerDisabled: "transparent",
                        colorBorder: "gray",
                        hoverBorderColor: "lightgray",
                        colorText: "white",
                        colorTextPlaceholder: "gray",
                        colorTextDescription: "white", // char count
                        colorIcon: "lightgray", // show pass icon
                        colorIconHover: "white", // show pass icon hover
                        colorTextQuaternary: "darkgray", // clear icon color
                      },
                      Pagination: {
                        colorPrimary: "white", // current page text
                        colorPrimaryHover: "white", // current page text hover
                        itemActiveBg: "#1677ff", // current page bg
                        itemBg: "#52525296", // other page bg
                        colorText: "white", // other page text
                        colorBgTextHover: "gray", // other page text hover
                        colorTextDisabled: "gray", // icons color
                      },
                      ColorPicker: {
                        colorBgContainer: "transparent",
                        colorBorder: "gray",
                        colorText: "black",
                        colorTextPlaceholder: "gray",
                        colorTextQuaternary: "darkgray", // icons color
                        colorBgElevated: "#232a35", // bg of pop up container
                      },
                      Popover: {
                        colorBgElevated: "#374151f0",
                      },
                      Popconfirm: {
                        colorText: "white",
                        colorTextHeading: "white",
                      },
                      Switch: {
                        handleBg: "#d1d5db ", // circle
                        colorPrimary: "#1677ff", // on bg
                        colorPrimaryHover: "#3f8fff", // on bg hover
                        colorTextQuaternary: "#6b7280  ", // off bg
                        colorTextTertiary: "#9ca3af ", // off bg hover
                      },
                      Tooltip: {
                        colorBgSpotlight: "#374151f0",
                      },
                      Upload: {
                        colorTextHeading: "white",
                        colorTextDescription: "white",
                      },
                      Progress: {
                        colorText: "white",
                      },
                      Empty: {
                        colorText: "white",
                        colorTextHeading: "white",
                        colorTextDescription: "white",
                        opacityImage: 0.5,
                      },
                      Modal: {
                        contentBg: "#111827",
                        headerBg: "#111827",
                        colorBgMask: "#000000b8",
                        colorTextHeading: "white",
                        colorIcon: "white",
                        colorIconHover: "lightgray",
                      },
                    },
                token: {
                  fontFamily: "Roboto",
                },
              }}
            >
              <Suspense
                fallback={
                  <div
                    className={`loader ${isLight ? "loader-dark" : "loader-light"} fixed top-0 right-0 m-[2px] size-6 opacity-100`}
                  />
                }
              >
                <Outlet />
              </Suspense>
            </ConfigProvider>
          </AppNavbar>
        </UserContext.Provider>
      </DimensionContext.Provider>
    </>
  );
}
