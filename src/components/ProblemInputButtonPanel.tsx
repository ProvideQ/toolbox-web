import { Stack, Spacer, Text } from "@chakra-ui/react";
import { JSXElementConstructor, ReactElement } from "react";
import { TbRotate, TbDownload, TbUpload} from 'react-icons/tb'
import { ProblemInputButton } from "./ProblemInputButton";
import { ProblemInputButton_HelpButton } from "./ProblemInputButton_HelpButton";

export const ProblemInputButtonPanel = (props: {helpBody: ReactElement<any, string | JSXElementConstructor<any>>, problemText: () => string | undefined}) => (
  <Stack spacing='24px' direction='row'>
    <Spacer />
    <ProblemInputButton icon={<TbRotate/>} text="New problem" toolTipText="Clear textfield" />
    <ProblemInputButton icon={<TbDownload />} text="Download problem" toolTipText="Download problem as local file" onClick={
      () => {
        const element = document.createElement("a");
        const fileContent = props.problemText() as BlobPart;
        const file = new Blob([fileContent], {type: 'text/plain;charset=utf-8'});
        element.href = URL.createObjectURL(file);
        element.download = "problem.txt";
        document.body.appendChild(element);
        element.click();
      }
    }/>
    <ProblemInputButton icon={<TbUpload />} text="Upload problem" toolTipText="Upload problem from local file" />
    <ProblemInputButton_HelpButton helpBody={props.helpBody}/>
    <Spacer />
  </Stack>
);