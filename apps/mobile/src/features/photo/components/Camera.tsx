import {useState, useEffect, useRef} from "react";
import {View, TouchableOpacity, Platform} from "react-native";
import {
  Camera as ExpoCamera,
  CameraType as ExpoCameraType,
  CameraProps as ExpoCameraProps,
  FlashMode as ExpoFlashMode,
} from "expo-camera";
import {manipulateAsync, FlipType} from "expo-image-manipulator";
import FastImage from "react-native-fast-image";
import {
  MaterialCommunityIcons,
  Ionicons,
  AntDesign,
  Feather,
} from "@expo/vector-icons";
import Button from "../../../components/Button";

interface CameraProps extends ExpoCameraProps {
  onPermissionDenied?: () => Promise<void>;
  onPictureSend?: (pictureUri: string) => Promise<void>;
  isLoading?: boolean;
  containerClassName?: string;
}

function transformRatio(ratio: string | undefined) {
  if (!ratio) return;
  const splitted = ratio.split(":");
  return (
    Number.parseInt(splitted[1] as string) /
    Number.parseInt(splitted[0] as string)
  );
}

const Camera: React.FC<CameraProps> = ({
  onPermissionDenied = () => undefined,
  onPictureSend = () => undefined,
  isLoading = false,
  containerClassName = "",
  ...props
}) => {
  const cameraRef = useRef<ExpoCamera>(null);
  const [permission, requestPermission] = ExpoCamera.useCameraPermissions();

  const [type, setType] = useState<ExpoCameraType>(ExpoCameraType.back);
  const [flash, setFlash] = useState<ExpoFlashMode>(ExpoFlashMode.off);
  const [ratio, setRatio] = useState<string>();
  const [pictureUri, setPictureUri] = useState<string>();

  useEffect(() => {
    if (!permission || (!permission.granted && permission.canAskAgain))
      requestPermission();
    else if (!permission.granted) onPermissionDenied();
  }, [permission, requestPermission]);

  async function initializeRatio(preferred: number) {
    if (Platform.OS !== "android") return;
    if (!cameraRef.current) return;
    if (ratio) return;

    const supporteds = await cameraRef.current.getSupportedRatiosAsync();
    let min = Infinity;
    let minLocation: string | undefined = undefined;
    for (const s of supporteds) {
      const splitted = s.split(":");
      const current =
        Number.parseInt(splitted[0] as string) /
        Number.parseInt(splitted[1] as string);
      if (Math.abs(current - preferred) < min) {
        min = Math.abs(current - preferred);
        minLocation = s;
      }
    }
    setRatio(minLocation);
  }

  function toggleType() {
    setType((current) =>
      current == ExpoCameraType.back
        ? ExpoCameraType.front
        : ExpoCameraType.back
    );
  }

  function toggleFlash() {
    setFlash((current) =>
      current == ExpoFlashMode.on ? ExpoFlashMode.off : ExpoFlashMode.on
    );
  }

  async function takePicture() {
    if (!cameraRef.current) return;
    await cameraRef.current.takePictureAsync({
      onPictureSaved: async (pic) => {
        let res = pic;
        if (type == ExpoCameraType.front)
          res = await manipulateAsync(res.uri, [
            {rotate: 180},
            {flip: FlipType.Vertical},
          ]);
        res = await manipulateAsync(res.uri, [], {compress: 0.5});
        setPictureUri(res.uri);
      },
      skipProcessing: true,
      base64: false,
    });
  }

  function clearPicture() {
    setPictureUri(undefined);
  }

  if (!permission || !permission.granted) return null;

  return (
    <View
      className={`bg-slate-900 flex justify-center items-center ${containerClassName}`}
    >
      {pictureUri ? (
        <View
          className="relative w-full max-h-full flex items-center"
          style={{aspectRatio: transformRatio(ratio)}}
        >
          <TouchableOpacity
            className="absolute left-4 top-4 z-10"
            onPress={clearPicture}
          >
            <AntDesign name="close" size={24} color="white" />
          </TouchableOpacity>
          <FastImage source={{uri: pictureUri}} className="w-full h-full" />
          <Button
            content="Elküldés"
            className="absolute bottom-4"
            onPress={() => onPictureSend(pictureUri)}
            LeftIcon={() => <Feather name="mail" size={18} color="white" />}
            isLoading={isLoading}
          />
        </View>
      ) : (
        <ExpoCamera
          ref={cameraRef}
          type={type}
          flashMode={flash}
          onCameraReady={() => initializeRatio(16 / 9)}
          ratio={ratio}
          className="w-full max-h-full"
          style={{aspectRatio: transformRatio(ratio)}}
          {...props}
        >
          <View className="absolute bottom-0 inset-x-0 flex flex-row justify-center items-center gap-8 pb-4">
            <TouchableOpacity onPress={toggleFlash}>
              {flash === ExpoFlashMode.on ? (
                <Ionicons name="flash-off" size={24} color="white" />
              ) : (
                <Ionicons name="flash" size={24} color="white" />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              className="w-20 h-20 rounded-full border-[5px] border-white"
              onPress={takePicture}
            />
            <TouchableOpacity onPress={toggleType}>
              <MaterialCommunityIcons
                name="rotate-3d-variant"
                size={24}
                color="white"
              />
            </TouchableOpacity>
          </View>
        </ExpoCamera>
      )}
    </View>
  );
};

export default Camera;
