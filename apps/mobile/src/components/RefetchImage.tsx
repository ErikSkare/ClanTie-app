import {useState} from "react";
import FastImage, {FastImageProps} from "react-native-fast-image";

interface RefetchImageProps extends FastImageProps {
  refetchCount: number;
  refetchDelay: number;
}

const RefetchImage: React.FC<RefetchImageProps> = ({
  refetchCount,
  refetchDelay,
  source,
  ...props
}) => {
  const [count, setCount] = useState(0);

  // eslint-disable-next-line
  const [uri, setUri] = useState<string>((source as any).uri);

  function handleError() {
    if (count >= refetchCount) return;
    setUri("");
    setTimeout(() => {
      setCount((val) => val + 1);
      // eslint-disable-next-line
      setUri((source as any).uri);
    }, refetchDelay);
  }

  return <FastImage source={{uri}} {...props} onError={handleError} />;
};

export default RefetchImage;
