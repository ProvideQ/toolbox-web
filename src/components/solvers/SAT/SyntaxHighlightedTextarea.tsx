import { Box } from "@chakra-ui/react";
import { Grammar, highlight } from "prismjs";
import "prismjs/themes/prism-solarizedlight.css"; //TODO: use custom styling
import React from "react";
import Editor from "react-simple-code-editor";

interface TextAreaProps {
  problemString: string;
  setProblemString: React.Dispatch<React.SetStateAction<string>>;
  grammar: Grammar;
  language: string;
}

export const SyntaxHighlightedTextarea = (props: TextAreaProps) => {
  return (
    <Box border="1px" borderColor="#AAAAAA" borderRadius="10px">
      <Editor
        value={props.problemString}
        onValueChange={(code) => props.setProblemString(code)}
        highlight={(code) => highlight(code, props.grammar, props.language)}
        padding={10}
        style={{
          fontFamily: '"Fira code", "Fira Mono", monospace',
          fontSize: 24,
        }}
      />
    </Box>
  );
};
