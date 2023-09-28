import "prismjs/themes/prism-solarizedlight.css"; //TODO: use custom styling
import React from "react";
import Editor from "react-simple-code-editor";
import { highlight } from "prismjs";
import { Box, Container } from "@chakra-ui/react";
import { SAT_language } from "./prism-SAT";

interface TextAreaProps {
  problemString: string;
  setProblemString: React.Dispatch<React.SetStateAction<string>>;
}

export const TextArea = (props: TextAreaProps) => {
  return (
    <Box border="1px" borderColor="#AAAAAA" borderRadius="10px">
      <Editor
        value={props.problemString}
        onValueChange={(code) => props.setProblemString(code)}
        highlight={(code) => highlight(code, SAT_language, "SAT_language")}
        padding={10}
        style={{
          fontFamily: '"Fira code", "Fira Mono", monospace',
          fontSize: 24,
        }}
      />
    </Box>
  );
};
