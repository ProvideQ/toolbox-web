import {
  Alert,
  AlertDescription,
  AlertIcon,
  Button,
  ButtonGroup,
  HStack,
  IconButton,
  Select,
  SimpleGrid,
  Text,
  Tooltip,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import {
  TbDownload,
  TbHelp,
  TbRepeat,
  TbTrash,
  TbUpload,
} from "react-icons/tb";
import { baseUrl, toolboxApi } from "../../api/toolbox/ToolboxAPI";
import { chooseFile } from "./FileInput";

export interface EditorControlsProps {
  /**
   * EditorControls show this text as an error, if it is present.
   */
  errorText?: string;
  /**
   * EditorControls shows this text if no other informational text needs to be
   * displayed.
   */
  idleText: string;

  /**
   * Contents of the editor that these controls relate to.
   */
  editorContent: string;
  /**
   * Function to set the contents of the editor that these controls relate to.
   */
  setEditorContent: (newContent: string) => void;

  /**
   * Link to the documentation for the problem type that is being edited.
   * If omitted, the documentation link will point to the API docs.
   */
  documentationLink?: string;

  /**
   * Problem type id.
   */
  problemTypeId: string;

  /**
   * Stacks controls for use in narrow sidebars.
   */
  compact?: boolean;
}

/**
 * Downloads the given string as a text file.
 */
const download = (problemString: string) => {
  const element = document.createElement("a");
  const file = new Blob([problemString], { type: "text/plain;charset=utf-8" });
  element.href = URL.createObjectURL(file);
  element.download = "problem.txt";
  document.body.appendChild(element);
  element.click();
};

/**
 * Asks the user to choose a file to upload.
 * The text contents of the chosen file are forwarded to the given handler
 * function.
 * If no file was chosen, the handler function won't be called.
 */
const upload = async (onUpload: (uploadContent: string) => void) => {
  const files = await chooseFile(false);

  if (files == null || files.length == 0) return;

  const text = await files[0].text();

  onUpload(text);
};

/**
 * Control panel for a text editor that has a display panel for tips and error
 * messages, an upload, a download and a help button.
 */
export const EditorControls = (props: EditorControlsProps) => {
  const [examples, setExamples] = useState<string[]>([]);
  const [selectedExample, setSelectedExample] = useState<string>("");

  const documentationLink = props.documentationLink ?? baseUrl();

  useEffect(() => {
    toolboxApi
      .fetchExampleProblems(props.problemTypeId)
      .then((json) => setExamples(json));
  }, [props.problemTypeId]);

  const exampleSelect = examples.length > 0 && (
    <Select
      size={props.compact ? "sm" : "md"}
      placeholder="Load an example"
      overflow="hidden"
      textOverflow="ellipsis"
      width={props.compact ? "100%" : "10rem"}
      value={selectedExample}
      bg={props.compact ? "white" : undefined}
      _dark={props.compact ? { bg: "gray.800" } : undefined}
      onChange={(event) => {
        setSelectedExample(event.target.value);
        props.setEditorContent(event.target.value);
      }}
    >
      {examples.map((example) => (
        <option key={example} value={example}>
          {example.length > 100 ? example.slice(0, 100) + "..." : example}
        </option>
      ))}
    </Select>
  );

  const resetEditor = () => {
    setSelectedExample("");
    props.setEditorContent("");
  };

  const restartEditor = () => {
    props.setEditorContent("");
    setTimeout(() => {
      props.setEditorContent(props.editorContent);
    });
  };

  if (props.compact) {
    return (
      <VStack width="100%" align="stretch" spacing="2">
        {exampleSelect}

        {props.errorText && (
          <Alert status="error" variant="subtle" borderRadius="md" py="2">
            <AlertIcon boxSize="1rem" />
            <AlertDescription fontSize="xs">{props.errorText}</AlertDescription>
          </Alert>
        )}

        {!props.errorText && props.idleText && (
          <Text color="gray.500" fontSize="xs">
            {props.idleText}
          </Text>
        )}

        <SimpleGrid columns={2} gap="2">
          <Button
            size="sm"
            variant="outline"
            colorScheme="blue"
            justifyContent="flex-start"
            leftIcon={<TbDownload />}
            onClick={() => download(props.editorContent)}
          >
            Download
          </Button>
          <Button
            size="sm"
            variant="outline"
            colorScheme="blue"
            justifyContent="flex-start"
            leftIcon={<TbUpload />}
            onClick={() => upload(props.setEditorContent)}
          >
            Upload
          </Button>
          <Button
            size="sm"
            variant="outline"
            colorScheme="red"
            justifyContent="flex-start"
            leftIcon={<TbTrash />}
            onClick={resetEditor}
          >
            Clear
          </Button>
          <Button
            size="sm"
            variant="outline"
            justifyContent="flex-start"
            leftIcon={<TbRepeat />}
            onClick={restartEditor}
          >
            Restart
          </Button>
          <Button
            gridColumn="1 / -1"
            size="sm"
            variant="ghost"
            colorScheme="blue"
            leftIcon={<TbHelp />}
            onClick={() => window.open(documentationLink, "_blank")}
          >
            Open documentation
          </Button>
        </SimpleGrid>
      </VStack>
    );
  }

  return (
    <HStack justifyContent={"space-between"} width="100%">
      <HStack>
        {exampleSelect}

        {props.errorText ? (
          <Text textColor="tomato">{props.errorText}</Text>
        ) : (
          <Text as="i">{props.idleText}</Text>
        )}
      </HStack>

      <ButtonGroup isAttached variant="outline" colorScheme="teal">
        <Tooltip label="Download problem from editor">
          <IconButton
            aria-label="Download"
            icon={<TbDownload />}
            onClick={() => download(props.editorContent)}
          />
        </Tooltip>
        <Tooltip label="Upload a problem to this editor">
          <IconButton
            aria-label="Upload"
            icon={<TbUpload />}
            onClick={() => upload(props.setEditorContent)}
          />
        </Tooltip>
        <Tooltip label="Reset the problem">
          <IconButton
            aria-label="Reset"
            icon={<TbTrash />}
            onClick={resetEditor}
          />
        </Tooltip>
        <Tooltip label="Restart the problem">
          <IconButton
            aria-label="Restart"
            icon={<TbRepeat />}
            onClick={restartEditor}
          />
        </Tooltip>
        <Tooltip label="Open the documentation">
          <IconButton
            aria-label="Help"
            icon={<TbHelp />}
            onClick={() => window.open(documentationLink, "_blank")}
          />
        </Tooltip>
      </ButtonGroup>
    </HStack>
  );
};
