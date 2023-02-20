import {useEffect, useState} from "react";
import * as Location from "expo-location";

const useLocation = (onDenied: () => void) => {
  const [hasPermission, setHasPermission] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      const {status} = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        onDenied();
      } else {
        setHasPermission(true);
      }
    })();
  }, []);

  return hasPermission;
};

export default useLocation;
