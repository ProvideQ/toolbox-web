import { Box } from "@chakra-ui/react";
import { Grammar, highlight } from "prismjs";
import "prismjs/themes/prism-solarizedlight.css"; //TODO: use custom styling
import Editor from "react-simple-code-editor";

interface SyntaxHighlightedTextareaProps {
  text: string;
  setText: (value: string) => void;
  placeholder?: string;
  isInvalid?: boolean;
  grammar?: GrammarSettings;
}

export interface GrammarSettings {
  grammar: Grammar;
  language: string;
}

export const SyntaxHighlightedTextarea = (
  props: SyntaxHighlightedTextareaProps
) => {
  return (
    <Box
      border="2px"
      borderColor={props.isInvalid ? "tomato" : "#AAAAAA"}
      borderRadius="10px"
      width="100%"
      maxHeight="50rem"
      overflowX="hidden"
    >
      <Editor
        value={props.text}
        onValueChange={(code) => props.setText(code)}
        highlight={(code) => {
          if (props.grammar) {
            return highlight(
              code,
              props.grammar.grammar,
              props.grammar.language
            );
          }
          return code;
        }}
        padding={10}
        style={{
          fontFamily: '"Fira code", "Fira Mono", monospace',
          fontSize: 16,
        }}
      />
    </Box>
  );
};
