import {Pressable, PressableProps, Text, ActivityIndicator} from "react-native";

interface ButtonProps extends PressableProps {
  content?: string;
  color?: "success" | "danger";
  shape?: "primary" | "secondary";
  size?: "large" | "small";
  isLoading?: boolean;
  LeftIcon?: () => JSX.Element;
  RightIcon?: () => JSX.Element;
}

const Button: React.FC<ButtonProps> = ({
  content = "",
  color = "success",
  shape = "primary",
  size = "large",
  isLoading = false,
  disabled,
  LeftIcon = () => <></>,
  RightIcon = () => <></>,
  ...props
}) => {
  const bgClasses = {
    success: {
      primary: "bg-green-400 active:bg-green-500",
      secondary: "border-2 border-green-400 active:border-green-500",
    },
    danger: {
      primary: "bg-red-400 active:bg-red-500",
      secondary: "border-2 border-red-400 active:border-red-500",
    },
  };

  const sizeClasses = {
    large: "p-4",
    small: "p-2",
  };

  const fontClasses = {
    large: "text-base",
    small: "text-xs",
  };

  return (
    <Pressable
      className={`${sizeClasses[size]} ${
        bgClasses[color][shape]
      } rounded flex flex-row items-center justify-center ${
        (isLoading || disabled) && "opacity-60"
      }`}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator color="white" />
      ) : (
        <>
          <LeftIcon />
          {content != "" && (
            <Text
              className={`text-center text-white mx-1 ${fontClasses[size]}`}
              style={{fontFamily: "Roboto_700Bold"}}
            >
              {content}
            </Text>
          )}
          <RightIcon />
        </>
      )}
    </Pressable>
  );
};

export default Button;
