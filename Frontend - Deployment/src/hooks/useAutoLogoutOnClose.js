import { useEffect } from "react";
import { getApiUrl } from "../utils/config";

const useAutoLogoutOnClose = () => {
  const apiUrl = getApiUrl();

  useEffect(() => {
    const handleUnload = () => {
      const token = localStorage.getItem("token");

      if (token) {
        const logoutData = JSON.stringify({ token });

        // Send a logout request using sendBeacon
        const blob = new Blob([logoutData], { type: "application/json" });
        navigator.sendBeacon(`${apiUrl}/api/logout`, blob);

        // Clean up localStorage
        localStorage.removeItem("token");
      }
    };

    window.addEventListener("beforeunload", handleUnload);

    return () => {
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, []);
};

export default useAutoLogoutOnClose;
