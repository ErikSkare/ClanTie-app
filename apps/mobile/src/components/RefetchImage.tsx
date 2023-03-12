import {useState, useEffect} from "react";
import FastImage, {FastImageProps, Source} from "react-native-fast-image";

interface RefetchImageProps extends FastImageProps {
  refetchCount: number;
  refetchDelay: number;
  source: Source & {uri: string};
}

const RefetchImage: React.FC<RefetchImageProps> = ({
  refetchCount,
  refetchDelay,
  source,
  ...props
}) => {
  const [count, setCount] = useState(0);

  // eslint-disable-next-line
  const [uri, setUri] = useState<string>(source.uri);

  useEffect(() => {
    setCount(0);
    setUri(source.uri);
  }, [source.uri]);

  function handleError() {
    if (count >= refetchCount) return;
    setUri("");
    setTimeout(() => {
      setCount((val) => val + 1);
      // eslint-disable-next-line
      setUri(source.uri);
    }, refetchDelay);
  }

  return <FastImage source={{uri}} {...props} onError={handleError} />;
};

export default RefetchImage;
