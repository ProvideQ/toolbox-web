import {
  ButtonGroup,
  HStack,
  IconButton,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { TbDownload, TbHelp, TbUpload } from "react-icons/tb";
import { chooseFile } from "./FileInput";
import Link from "next/link";

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
   * Contents of uploaded problem files will be sent to this handler.
   */
  onUpload: (uploadContent: string) => void;

  /**
   * Link to the documentation for the problem type that is being edited.
   */
  documentationLink: string;
}

const download = (problemString: string) => {
  const element = document.createElement("a");
  const file = new Blob([problemString], { type: "text/plain;charset=utf-8" });
  element.href = URL.createObjectURL(file);
  element.download = "problem.txt";
  document.body.appendChild(element);
  element.click();
};

const upload = async (onUpload: (uploadContent: string) => void) => {
  const files = await chooseFile(false);

  if (files == null || files.length == 0) return;

  const text = await files[0].text();

  onUpload(text);
};

export const EditorControls = (props: EditorControlsProps) => (
  <HStack justifyContent={"space-between"} width="100%">
    {props.errorText ? (
      <Text backgroundColor="tomato">{props.errorText}</Text>
    ) : (
      <Text as="i">{props.idleText}</Text>
    )}
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
          onClick={() => upload(props.onUpload)}
        />
      </Tooltip>
      <Tooltip label="Open the documentation">
        <IconButton
          aria-label="Help"
          icon={<TbHelp />}
          onClick={() => window.open(props.documentationLink, "_blank")}
        />
      </Tooltip>
    </ButtonGroup>
  </HStack>
);
