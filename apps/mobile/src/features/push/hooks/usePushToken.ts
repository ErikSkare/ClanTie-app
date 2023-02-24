import {useEffect, useState} from "react";
import {Platform} from "react-native";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import {trpc} from "@/lib/trpc";
import {useAuthenticate} from "@/features/auth";

const EXPERIENCE_ID = "@skareerik011/clantie-mobile";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldSetBadge: true,
    shouldPlaySound: false,
  }),
});

export default function usePushToken() {
  const [pushToken, setPushToken] = useState<string>();

  const {isAuthed} = useAuthenticate();

  const {mutate: registerToken} = trpc.push.registerToken.useMutation();
  const {mutate: removeToken} = trpc.push.removeToken.useMutation();

  useEffect(() => {
    if (isAuthed) {
      registerForPushNotificationsAsync().then((token) => {
        if (token) {
          registerToken({token});
          setPushToken(token);
        }
      });
    } else {
      if (pushToken) {
        removeToken({token: pushToken});
        setPushToken(undefined);
      }
    }
  }, [isAuthed, pushToken]);
}

async function registerForPushNotificationsAsync() {
  let token;
  if (Device.isDevice) {
    const {status: existingStatus} = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const {status} = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Hoppá! Nem sikerült a push-értesítések regisztrálása!");
      return;
    }
    token = (
      await Notifications.getExpoPushTokenAsync({
        experienceId: EXPERIENCE_ID,
      })
    ).data;
  } else {
    alert("Fizikai eszköz használata kötelező!");
  }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  return token;
}
