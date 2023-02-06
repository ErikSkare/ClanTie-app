import {Pressable, PressableProps, Text, ActivityIndicator} from "react-native";

interface ButtonProps extends PressableProps {
  content: string;
  isLoading?: boolean;
  RightIcon?: () => JSX.Element;
}

const Button: React.FC<ButtonProps> = ({
  content,
  isLoading = false,
  disabled,
  RightIcon = () => <></>,
  ...props
}) => {
  return (
    <Pressable
      className={`p-4 bg-green-400 active:bg-green-600 rounded flex flex-row items-center ${
        (isLoading || disabled) && "opacity-60"
      }`}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator color="white" />
      ) : (
        <>
          <Text
            className="text-center text-white"
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
