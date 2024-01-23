import { Link, Text } from "@chakra-ui/react";

export interface TextWithLinksProps {
  text: string;
}

const urlRegex = /(https?:\/\/\S+|www\.\S+|\b\w+@\w+\.\w+(?:\.\w+)?\b)/;

const TextWithLinks = (props: TextWithLinksProps) => {
  // Split the text into parts based on the presence of urls
  const parts: string[] = props.text.split(urlRegex);

  return (
    <Text>
      {parts.map((part, index) => {
        // Check if the part is a link
        if (urlRegex.test(part)) {
          return (
            <Link key={index} color="blue.500" href={part} isExternal>
              {part}
            </Link>
          );
        } else {
          return <span key={index}>{part}</span>;
        }
      })}
    </Text>
  );
};

export default TextWithLinks;
