import React, {useState} from "react";
import { Icon, SimpleGrid } from "@chakra-ui/react";
import { TbDownload, TbUpload } from 'react-icons/tb'
import { InputButton } from "./InputButton";
import { HelpButton } from "./HelpButton";
import {chooseFile} from "../FileInput";

interface InputProps {
    helpBody: React.ReactElement;
    problemString: string;
    setProblemString: React.Dispatch<React.SetStateAction<string>>;
}

export const InputButtonPanel = (props : InputProps) => {
    return (
        <>
            <SimpleGrid columns={3} gap={6} >
                <InputButton icon={<Icon as={TbDownload}/>} text="Download problem"
                             toolTipText="Download problem as local file"
                             onClick={() => {
                                 onDownloadClicked(props.problemString);
                             }}/>
                <InputButton icon={<Icon as={TbUpload}/>} text="Upload problem"
                             toolTipText="Upload problem from local file"
                             onClick={() => {
                                 chooseFile().then((files: FileList|null) => onFileUploaded(files, props.setProblemString));
                             }}/>
                <HelpButton helpBody={props.helpBody}/>
            </SimpleGrid>
        </>
        )
}

const onFileUploaded = (files: FileList | null, setProblemString: React.Dispatch<React.SetStateAction<string>>) => {
    if (files == null || files.length == 0) return;

    files[0].text().then((text: string) => {
        setProblemString(text);
    });
}

const onDownloadClicked = (problemString: string) => {
    const element = document.createElement("a");
    const fileContent = problemString as BlobPart;
    const file = new Blob([fileContent], {type: 'text/plain;charset=utf-8'});
    element.href = URL.createObjectURL(file);
    element.download = "problem.txt";
    document.body.appendChild(element);
    element.click();
}