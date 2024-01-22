import { Box } from "@chakra-ui/react";
import { highlight } from "prismjs";
import "prismjs/themes/prism-solarizedlight.css"; //TODO: use custom styling
import Editor from "react-simple-code-editor";
import { SAT_language } from "./prism-SAT";

interface TextAreaProps {
  problemString: string;
  setProblemString: (problemString: string) => void;
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
