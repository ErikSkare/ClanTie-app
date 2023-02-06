import {Pressable, PressableProps, Text, ActivityIndicator} from "react-native";

interface ButtonProps extends PressableProps {
  content: string;
  isLoading?: boolean;
  LeftIcon?: () => JSX.Element;
  RightIcon?: () => JSX.Element;
}

const Button: React.FC<ButtonProps> = ({
  content,
  isLoading = false,
  disabled,
  LeftIcon = () => <></>,
  RightIcon = () => <></>,
  ...props
}) => {
  return (
    <Pressable
      className={`p-4 bg-green-400 active:bg-green-600 rounded flex flex-row items-center justify-center ${
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
          <Text
            className="text-center text-white mx-1"
            style={{fontFamily: "Roboto_700Bold"}}
          >
            {content}
          </Text>
          <RightIcon />
        </>
      )}
    </Pressable>
  );
};

export default Button;
