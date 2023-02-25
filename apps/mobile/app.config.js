export default {
  "name": "Clantie-mobile",
  "slug": "clantie-mobile",
  "version": "1.0.0",
  "orientation": "portrait",
  "icon": "./assets/icon.png",
  "userInterfaceStyle": "dark",
  "splash": {
    "image": "./assets/splash.png",
    "resizeMode": "contain",
    "backgroundColor": "#334155"
  },
  "updates": {
    "fallbackToCacheTimeout": 0
  },
  "assetBundlePatterns": ["**/*"],
  "ios": {
    "bundleIdentifier": "com.erikskare.clantiemobile",
    "buildNumber": "1.0.0",
    "supportsTablet": false
  },
  "android": {
    "package": "com.erikskare.clantiemobile",
    "versionCode": 1,
    "googleServicesFile": "./google-services.json",
    "adaptiveIcon": {
      "foregroundImage": "./assets/adaptive-icon.png",
      "backgroundColor": "#0f172a"
    },
    "permissions": [
      "android.permission.RECORD_AUDIO",
      "android.permission.CAMERA"
    ]
  },
  "extra": {
    "apiUrl": "192.168.1.71:3000",
    "mapboxAccess": "pk.eyJ1Ijoic2thcmVlcmlrMDExIiwiYSI6ImNsZWJuN3hxZTFhd2Uzd21lMjhtdzl6eXYifQ.okCYlAQWtThdFjpA8k-amw",
    "styleUrl": "mapbox://styles/skareerik011/cled1mnss003e01pc07h42m8k",
    "eas": {
      "projectId": "9b3362ac-5574-4faa-9915-6556bb4f1e44"
    }
  },
  "plugins": [
    [
      "expo-image-picker",
      {
        "photosPermission": "Az alkalmazás hozzá szeretne férni a képeidhez!"
      }
    ],
    [
      "expo-camera",
      {
        "cameraPermission": "Az alkalmazás hozzá szeretne férni a kamerádhoz!"
      }
    ],
    [
      "@rnmapbox/maps",
      {
        "RNMapboxMapsImpl": "mapbox",
        // eslint-disable-next-line
          "RNMapboxMapsDownloadToken": process.env.DOWNLOAD_TOKEN
      }
    ],
    [
      "expo-location"
    ],
    [
      "./plugins/withAndroidSupportsScreens",
      {
        "smallScreens": true,
        "normalScreens": true,
        "largeScreens": false,
        "xlargeScreens": false,
      }
    ]
  ]
};
