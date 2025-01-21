export const main_domain = import.meta.env.VITE_MAIN_DOMAIN;
export const email_address = import.meta.env.VITE_EMAIL_ADDRESS;
export const companyDetails = {
  name: "Taskify",
  full_name: "Taskify LLC",
  street: "49 Test Street, 12345, CA, USA",
  number: "DA43213241",
};

// Button styles
export const btnClassBase = ` text-nowrap text-center px-3 py-1 border shadow-sm rounded-lg text-black hover:text-black bg-white border-gray-300 shadow-gray-200 transition-all duration-300 hover:bg-gray-50 hover:border-gray-400 hover:shadow-gray-400 active:border-black active:shadow-gray-500 disabled:bg-gray-200 disabled:text-gray-400 disabled:active:border-gray-400 disabled:hover:border-gray-400 disabled:shadow-transparent disabled:cursor-not-allowed relative overflow-hidden `;
export const btnClassBaseDark = ` text-nowrap text-center px-3 py-1 border shadow-sm rounded-lg text-white hover:text-white bg-[#3a3a3a] border-gray-600 shadow-gray-600 transition-all duration-300 hover:bg-[#242424] hover:border-gray-500 hover:shadow-gray-500 active:border-gray-300 active:shadow-gray-400 disabled:opacity-40 disabled:shadow-transparent disabled:active:border-gray-500 disabled:cursor-not-allowed relative overflow-hidden `;
export const btnClassPrimary = ` font-[500] text-nowrap text-center px-3 py-1 border shadow-sm rounded-lg 
                text-white hover:text-white bg-black border-gray-300 shadow-gray-200
                hover:border-gray-400 hover:shadow-gray-400 hover:opacity-75 
                active:border-black active:shadow-gray-500
                disabled:bg-gray-600 disabled:text-gray-400 disabled:active:border-gray-400 disabled:hover:border-gray-400 disabled:shadow-transparent disabled:cursor-not-allowed
                transition-all duration-300 relative overflow-hidden `;
export const btnClassPrimaryDark = ` font-[500] text-nowrap text-center px-3 py-1 border shadow-md rounded-lg 
                text-black hover:text-black bg-white border-gray-500 shadow-transparent 
                hover:border-gray-500 hover:shadow-gray-700 hover:opacity-80 
                active:border-gray-200 active:shadow-gray-500 
                disabled:active:border-gray-500 disabled:shadow-transparent disabled:opacity-60 disabled:cursor-not-allowed
                transition-all duration-300 relative overflow-hidden `;
export const btnClassPrimaryDarkBlue = ` text-nowrap text-center px-3 py-1 border shadow-md rounded-lg 
                text-white hover:text-white bg-[#1677ff] border-gray-500 shadow-transparent 
                hover:border-gray-500 hover:shadow-blue-700 hover:opacity-80 
                active:border-gray-200 active:shadow-blue-500 
                disabled:active:border-gray-500 disabled:shadow-transparent disabled:opacity-60 disabled:cursor-not-allowed
                transition-all duration-300 relative overflow-hidden `;
