import { Box, Link } from "@chakra-ui/react";
import React from "react";

export interface TextWithLinksProps {
  text: string;
}

const urlRegex = /(https?:\/\/\S+|www\.\S+|\b\w+@\w+\.\w+(?:\.\w+)?\b)/;

const TextWithLinks = (props: TextWithLinksProps) => {
  // Split the text into parts based on the presence of urls
  const parts: string[] = props.text.split(urlRegex);

  return (
    <Box>
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
    </Box>
  );
};

export default TextWithLinks;
