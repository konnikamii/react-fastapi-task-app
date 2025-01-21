import axios from "axios";
import { AuthResponse } from "../utils_other/types";
import { queryOptions } from "@tanstack/react-query";

export const isAuthenticated = async () => {
  console.log("authenthicating");
  try {
    const response = await axios.post<AuthResponse>(
      `/api/auth/`,
      {},
      {
        withCredentials: true,
      }
    );
    if (response.status === 200) {
      return true;
    } else {
      window.location.href = "/login";
      return false;
    }
  } catch (error) {
    window.location.href = "/login";
    console.error(error);
    return false;
  }
};

export const authQueryOptions = () => {
  return queryOptions({
    queryKey: ["auth"],
    queryFn: isAuthenticated,
    staleTime: 5 * 60 * 1000, //auth every 5 minutes
  });
};
