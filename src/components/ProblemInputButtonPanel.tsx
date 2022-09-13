import { Stack, Spacer } from "@chakra-ui/react";
import React, { ReactElement } from "react";
import { TbRotate, TbDownload, TbUpload } from 'react-icons/tb'
import { FileInput } from "./FileInput";
import { ProblemInputButton } from "./ProblemInputButton";
import { ProblemInputButton_HelpButton } from "./ProblemInputButton_HelpButton";

export const ProblemInputButtonPanel = (props: { helpBody: ReactElement, problemText: () => string | undefined } ) => {
    let fileRef : React.MutableRefObject<FileInput | null> = React.createRef();

    function onFileUploaded(files: FileList | null): void {

    }

    return (
        <Stack spacing='24px' direction='row'>
            <FileInput ref={fileRef} onFileChanged={onFileUploaded} />
            <Spacer/>
            <ProblemInputButton icon={<TbRotate/>} text="New problem" onClick={function () {

            }} toolTipText="Clear textfield"/>
            <ProblemInputButton icon={<TbDownload/>} text="Download problem"
                                toolTipText="Download problem as local file"
                                onClick={
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
            <ProblemInputButton icon={<TbUpload/>} text="Upload problem"
                                toolTipText="Upload problem from local file"
                                onClick={() => {
                                    fileRef.current?.openInput();
                                }}/>
            <ProblemInputButton_HelpButton helpBody={props.helpBody}/>
            <Spacer/>
        </Stack>
    )
};