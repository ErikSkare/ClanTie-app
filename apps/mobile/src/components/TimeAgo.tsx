import {useEffect, useState, useMemo} from "react";
import {Text, TextProps} from "react-native";
import JSTimeAgo from "javascript-time-ago";
import hu from "javascript-time-ago/locale/hu";

JSTimeAgo.addLocale(hu);

interface TimeAgoProps extends TextProps {
  date: Date | string;
}

const TimeAgo: React.FC<TimeAgoProps> = ({date, ...props}) => {
  const timeAgo = useMemo(() => new JSTimeAgo("hu"), []);

  const [content, setContent] = useState(timeAgo.format(new Date(date)));

  useEffect(() => {
    setContent(timeAgo.format(new Date(date)));

    const interval = setInterval(() => {
      setContent(() => timeAgo.format(new Date(date)));
    }, 60000);

    return () => {
      clearInterval(interval);
    };
  }, [date]);

  return <Text {...props}>{content}</Text>;
};

export default TimeAgo;
