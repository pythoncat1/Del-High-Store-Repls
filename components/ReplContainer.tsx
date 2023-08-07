import { rcss, icons, Surface, Text } from "../rui";
import { useNavigate } from "react-router-dom";

const ReplContainer = ({ replData, SID }) => {
  const navigate = useNavigate();

  const bytesToGiB = (bytes) => {
    return bytes / 1073741824; // 1024^3 (1 GiB)
  };

  return (
    <Surface
      background="higher"
      onClick={() => navigate(`https://replit.com/${replData.repl.url}`)}
      css={[rcss.flex.row, rcss.rowWithGap()]}
    >
      <icons.Icon>
        <img src={replData.repl.iconUrl} css={[]}/>
      </icons.Icon>
      <Text>{replData.repl.title}</Text>
      <svg width="100%" xmlns="http://www.w3.org/2000/svg">
        <line x1="0%" y1="50%" x2="100%" y2="50%" stroke="var(--outline-default)"></line>
      </svg>
      <Text>{bytesToGiB(replData.usage)}</Text>
    </Surface>
  );
};

export default ReplContainer;
