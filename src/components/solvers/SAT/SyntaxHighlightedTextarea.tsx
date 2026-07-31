import { Box } from "@chakra-ui/react";
import { Grammar, highlight } from "prismjs";
import "prismjs/themes/prism-solarizedlight.css";
import Editor from "react-simple-code-editor";

interface SyntaxHighlightedTextareaProps {
  text: string;
  setText: (value: string) => void;
  placeholder?: string;
  isInvalid?: boolean;
  grammar?: GrammarSettings;
  compact?: boolean;
}

export interface GrammarSettings {
  grammar: Grammar;
  language: string;
}

export const SyntaxHighlightedTextarea = (
  props: SyntaxHighlightedTextareaProps,
) => {
  return (
    <Box
      borderWidth={props.compact ? "1px" : "2px"}
      borderColor={
        props.isInvalid
          ? "red.400"
          : props.compact
            ? "blackAlpha.300"
            : "#AAAAAA"
      }
      borderRadius={props.compact ? "md" : "10px"}
      width="100%"
      maxHeight="50rem"
      overflowX="hidden"
      bg={props.compact ? "blackAlpha.50" : undefined}
      _dark={
        props.compact
          ? {
              bg: "whiteAlpha.50",
              borderColor: props.isInvalid ? "red.300" : "whiteAlpha.300",
            }
          : undefined
      }
    >
      <Editor
        placeholder={props.placeholder}
        value={props.text}
        onValueChange={(code) => props.setText(code)}
        highlight={(code) => {
          if (props.grammar) {
            return highlight(
              code,
              props.grammar.grammar,
              props.grammar.language,
            );
          }
          return code;
        }}
        padding={10}
        style={{
          fontFamily: '"Fira code", "Fira Mono", monospace',
          fontSize: props.compact ? 14 : 16,
          minHeight: props.compact ? "10rem" : undefined,
        }}
      />
    </Box>
  );
};
