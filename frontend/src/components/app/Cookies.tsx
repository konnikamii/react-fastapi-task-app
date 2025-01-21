import { FC, useEffect } from "react";
import ReactGA from "react-ga4";

export const acceptAll: ConsentData = {
  ad_storage: "granted",
  analytics_storage: "granted",
  ad_user_data: "granted",
  ad_personalization: "granted",
  personalization_storage: "granted",
  functionality_storage: "granted",
  security_storage: "granted",
};
export const rejectAll: ConsentData = {
  ad_storage: "denied",
  analytics_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied",
  personalization_storage: "denied",
  functionality_storage: "denied",
  security_storage: "denied",
};
export interface ConsentData {
  ad_storage: "granted" | "denied";
  analytics_storage: "granted" | "denied";
  ad_user_data: "granted" | "denied";
  ad_personalization: "granted" | "denied";
  personalization_storage: "granted" | "denied";
  functionality_storage: "granted" | "denied";
  security_storage: "granted" | "denied";
}
export const bannerDelay = 500;
interface CookiesFCProps {
  theme: "light" | "dark";
}
const CookiesFC: FC<CookiesFCProps> = ({ theme }) => {
  const isLight = theme === "light";
  // Cookie banner
  useEffect(() => {
    const banner = document.getElementById("cookie-consent-banner");
    const settingsPopup = document.getElementById("cookie-settings-popup");
    const popupClose = document.querySelectorAll("#closing-popup-element");
    const btnSettings = document.getElementById("btn-settings");
    const btnSaveSettings = document.getElementById("btn-save-settings");
    const btnAcceptAll = document.getElementById("btn-accept-all");
    const btnRejectAll = document.getElementById("btn-reject-all");
    const btnReopenCookies = document.getElementById("nav-footer-cookies");

    const analyticsInput = document.getElementById(
      "consent-analytics"
    ) as HTMLInputElement;
    const marketingInput = document.getElementById(
      "consent-marketing"
    ) as HTMLInputElement;

    if (banner) {
      //show banner if no cookies in local storage or if any are denied
      try {
        const storedConsentData = localStorage.getItem("ucData");
        const expiration = localStorage.getItem("ucDataExpire");
        if (storedConsentData) {
          const parsedConsentData = JSON.parse(
            storedConsentData
          ) as ConsentData;
          analyticsInput.checked =
            parsedConsentData.analytics_storage === "granted";
          marketingInput.checked = parsedConsentData.ad_storage === "granted";
          // Check if any consent is denied
          const isAnyDenied = Object.values(parsedConsentData).some(
            (value) => value === "denied"
          );
          ReactGA.gtag("consent", "default", parsedConsentData);
          if (isAnyDenied) {
            if (expiration) {
              const currentTime = new Date().getTime();
              const oneDayInMilliseconds = 24 * 60 * 60 * 1000;
              if (currentTime - parseInt(expiration) > oneDayInMilliseconds) {
                setTimeout(() => {
                  banner.classList.add("show");
                }, bannerDelay);
              }
            } else {
              setTimeout(() => {
                banner.classList.add("show");
              }, bannerDelay);
            }
          } else {
            // if we have all acepted hide it
            banner.style.display = "none";
          }
        } else {
          ReactGA.gtag("consent", "default", rejectAll);
          setTimeout(() => {
            banner.classList.add("show");
          }, bannerDelay);
        }
      } catch (error) {
        console.error("Failed to parse consent data:", error);
        setTimeout(() => {
          banner.style.display = "fixed";
          banner.style.opacity = "1";
        }, bannerDelay);
      }

      // Prevent background click from triggering close when clicking inside the popup
      settingsPopup?.addEventListener("click", (event) => {
        event.stopPropagation();
      });

      // Show and hide settings popup
      const hideSettingsPopup = () => {
        if (settingsPopup) settingsPopup.style.display = "none";
      };
      const showSettingsPopup = () => {
        if (settingsPopup) settingsPopup.style.display = "flex";
      };
      popupClose.forEach((element) => {
        element.addEventListener("click", hideSettingsPopup);
      });
      btnSettings?.addEventListener("click", showSettingsPopup);
      btnReopenCookies?.addEventListener("click", showSettingsPopup);

      // Save settings
      btnSaveSettings?.addEventListener("click", () => {
        const newConsentData = {
          ad_storage: marketingInput.checked ? "granted" : "denied",
          analytics_storage: analyticsInput.checked ? "granted" : "denied",
          ad_user_data: marketingInput.checked ? "granted" : "denied",
          ad_personalization: marketingInput.checked ? "granted" : "denied",
          personalization_storage: analyticsInput.checked
            ? "granted"
            : "denied",
          functionality_storage: analyticsInput.checked ? "granted" : "denied",
          security_storage: analyticsInput.checked ? "granted" : "denied",
        };
        ReactGA.gtag("consent", "update", newConsentData);
        // window.gtag('consent', 'update', newConsentData);
        localStorage.setItem("ucData", JSON.stringify(newConsentData));
        if (!analyticsInput.checked || !marketingInput.checked) {
          localStorage.setItem("ucDataExpire", new Date().getTime().toString());
        }
        hideSettingsPopup();
        banner.classList.remove("show");
        setTimeout(() => {
          banner.style.display = "none";
        }, 500);
      });

      // Accept all
      btnAcceptAll?.addEventListener("click", () => {
        ReactGA.gtag("consent", "update", acceptAll);
        // window.gtag('consent', 'update', acceptAll);
        localStorage.setItem("ucData", JSON.stringify(acceptAll));
        banner.classList.remove("show");
        setTimeout(() => {
          banner.style.display = "none";
        }, 500);
      });

      // Reject all
      btnRejectAll?.addEventListener("click", () => {
        ReactGA.ga("consent", "update", rejectAll);
        // window.gtag('consent', 'update', rejectAll);
        localStorage.setItem("ucData", JSON.stringify(rejectAll));
        localStorage.setItem("ucDataExpire", new Date().getTime().toString());
        banner.classList.remove("show");
        setTimeout(() => {
          banner.style.display = "none";
        }, 500);
      });
    }
  }, []);
  return (
    <>
      <div
        id="cookie-consent-banner"
        className="fixed bottom-0 left-0 w-full transition-all duration-300 p-2"
      >
        <div
          className={`rounded-lg border-t px-10 py-6 backdrop-blur ${isLight ? "text-black bg-gray-300/70 border-gray-200" : "text-white bg-gray-800/70 border-gray-600"} select-text transition-all duration-300`}
        >
          <h3 className="text-xl font-semibold mb-4">Cookie Notice</h3>
          <div className="flex justify-between md:flex-row flex-col gap-4">
            <p className="text-sm ">
              We use cookies to provide you with the best possible experience!
              They allow us to analyze user behavior in order to constantly
              improve the website for you. By clicking 'Accept All', you consent
              to our use of cookies.{" "}
              <a
                href="/privacy"
                className="underline underline-offset-2"
                draggable="false"
              >
                Read More
              </a>
            </p>
            <div className="flex sm:space-x-2 sm:space-y-0 space-y-2 sm:flex-row flex-col justify-end flex-grow text-nowrap h-fit select-none">
              <button
                id="btn-reject-all"
                className={`cookie-consent-button btn-grayscale
                  text-nowrap text-center px-3 py-1 border shadow-sm rounded-lg text-black hover:text-black bg-gray-100 border-gray-400 shadow-transparent transition-all duration-300 hover:bg-gray-300 hover:border-gray-400 hover:shadow-gray-400 active:border-black active:shadow-gray-500 disabled:bg-gray-200 disabled:text-gray-400 disabled:active:border-gray-400 disabled:hover:border-gray-400 disabled:shadow-transparent disabled:cursor-not-allowed relative overflow-hidden`}
              >
                Reject All
              </button>
              <button
                id="btn-settings"
                className="cookie-consent-button btn-outline 
                  text-nowrap text-center px-3 py-1 border shadow-sm rounded-lg text-black hover:text-black bg-gray-100 border-gray-400 shadow-transparent transition-all duration-300 hover:bg-gray-300 hover:border-gray-400 hover:shadow-gray-400 active:border-black active:shadow-gray-500 disabled:bg-gray-200 disabled:text-gray-400 disabled:active:border-gray-400 disabled:hover:border-gray-400 disabled:shadow-transparent disabled:cursor-not-allowed relative overflow-hidden"
              >
                Settings
              </button>
              <button
                id="btn-accept-all"
                className={`cookie-consent-button btn-success 
                  font-[500] text-nowrap text-center px-3 py-1 border shadow-sm rounded-lg 
                  text-white hover:text-white ${isLight ? "bg-[#1677ff]" : "bg-[#1677ff]"} border-gray-700 shadow-transparent
                  hover:border-gray-500 hover:shadow-gray-500 active:border-gray-700 active:shadow-gray-600 hover:opacity-75 
                  disabled:bg-gray-600 disabled:text-gray-400 disabled:active:border-gray-400 disabled:hover:border-gray-400 disabled:shadow-transparent disabled:cursor-not-allowed
                  transition-all duration-300 relative overflow-hidden`}
              >
                Accept All
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
        id="cookie-settings-popup"
        className={`cookie-settings-popup fixed inset-0 bg-gray-900 ${isLight ? "" : "text-white/95"} bg-opacity-75 flex flex-col items-center justify-center z-50`}
        style={{ display: "none" }}
      >
        <div
          id="closing-popup-element"
          className="flex-1 w-full min-h-[90px]"
        ></div>
        <div className="flex w-full justify-stretch h-auto">
          <div id="closing-popup-element" className="flex-1"></div>
          <div
            className={`flex-1 ${isLight ? "bg-white" : "bg-gray-800"} p-6 rounded-lg shadow-lg sm:min-w-[500px] sm:max-w-[500px] min-w-[90%] max-w-[90%] mx-2 z-10`}
          >
            <div className="flex justify-between mb-4">
              <h3 className="text-xl font-semibold">Privacy Settings</h3>
              <button
                id="closing-popup-element"
                className={`text-lg font-semibold ${isLight ? "text-gray-600 hover:text-gray-800" : "text-gray-400 hover:text-gray-100"} translate-y-[-8px] transition duration-300`}
              >
                &times;
              </button>
            </div>
            <p className="text-sm">
              This tool helps you to select, activate or deactivate certain
              features on this website such as trackers, tags and analysis
              tools.
            </p>
            <div className="cookie-consent-options space-y-2 mt-4 overflow-auto max-h-[50vh]">
              <label
                className={`flex items-center space-x-2 py-4 px-2 rounded-md border ${isLight ? "bg-gray-50 hover:bg-gray-50 border-gray-500" : "bg-gray-700 hover:bg-gray-700 border-gray-600"}  relative`}
              >
                <div>
                  <h4 className="mb-1 font-medium">Necessary</h4>
                  <p
                    className={`text-sm italics ${isLight ? "text-gray-500" : "text-gray-200"} pr-20`}
                  >
                    Essential tags required to provide basic functionalities to
                    the website.
                  </p>
                </div>
                <input
                  id="consent-necessary"
                  type="checkbox"
                  value="Necessary"
                  checked
                  disabled
                  className="form-checkbox absolute top-1/2 right-[15px] -translate-y-1/2"
                />
              </label>
              <label
                id="analytics-label"
                className={`flex items-center space-x-2 py-4 px-2 rounded-md border ${isLight ? "bg-gray-50 hover:bg-gray-100 border-gray-500" : "bg-gray-700 hover:bg-gray-600 border-gray-500"} relative cursor-pointer transition-all duration-300`}
              >
                <div>
                  <h4 className="mb-1 font-medium">Analytics</h4>
                  <p
                    className={`text-sm italics  ${isLight ? "text-gray-500" : "text-gray-200"} pr-20`}
                  >
                    Analytical cookies used to understand visitor interactions
                    with the website. They help us find areas of improvement to
                    provide you with a better experience.
                  </p>
                </div>
                <input
                  id="consent-analytics"
                  type="checkbox"
                  value="Analytics"
                  className="form-checkbox absolute top-1/2 right-[15px] -translate-y-1/2"
                />
              </label>
              <label
                id="marketing-label"
                className={`flex items-center space-x-2 py-4 px-2 rounded-md border ${isLight ? "bg-gray-50 hover:bg-gray-100 border-gray-500" : "bg-gray-700 hover:bg-gray-600 border-gray-500"} relative cursor-pointer transition-all duration-300`}
              >
                <div>
                  <h4 className="mb-1 font-medium">Marketing</h4>
                  <p
                    className={`text-sm italics ${isLight ? "text-gray-500" : "text-gray-200"} pr-20`}
                  >
                    Marketing cookies provide visitors with relevant
                    advertisements based on their previous browsing activity.
                    They also help us analyze the effectiveness of the ad
                    campaigns.
                  </p>
                </div>
                <input
                  id="consent-marketing"
                  type="checkbox"
                  value="Marketing"
                  className="form-checkbox absolute top-1/2 right-[15px] -translate-y-1/2"
                />
              </label>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                id="closing-popup-element"
                className="text-nowrap text-center px-3 py-1 border shadow-sm rounded-lg text-black hover:text-black bg-white border-gray-300 shadow-gray-200 transition-all duration-300 hover:bg-gray-50 hover:border-gray-400 hover:shadow-gray-400 active:border-black active:shadow-gray-500 disabled:bg-gray-200 disabled:text-gray-400 disabled:active:border-gray-400 disabled:hover:border-gray-400 disabled:shadow-transparent disabled:cursor-not-allowed relative overflow-hidden"
              >
                Close
              </button>
              <button
                id="btn-save-settings"
                className="text-nowrap text-center px-3 py-1 border shadow-md rounded-lg 
          text-white hover:text-white bg-[#1677ff] border-gray-500 shadow-transparent 
          hover:border-gray-500 hover:shadow-blue-700 hover:opacity-80 
          active:border-gray-200 active:shadow-blue-500 
          disabled:active:border-gray-500 disabled:shadow-transparent disabled:opacity-60 disabled:cursor-not-allowed
          transition-all duration-300 relative overflow-hidden w-[100px]"
              >
                Save
              </button>
            </div>
          </div>
          <div id="closing-popup-element" className="flex-1"></div>
        </div>
        <div
          id="closing-popup-element"
          className="flex-1 w-full min-h-[30px]"
        ></div>
      </div>
    </>
  );
};
export default CookiesFC;
