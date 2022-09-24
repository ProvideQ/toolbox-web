import { Stack, Spacer } from "@chakra-ui/react";
import React from "react";
import { TbRotate, TbDownload, TbUpload } from 'react-icons/tb'
import { FileInput } from "./FileInput";
import { ProblemInputButton } from "./ProblemInputButton";
import { ProblemInputButton_HelpButton } from "./ProblemInputButton_HelpButton";

interface IProblemInputProps {
    helpBody: React.ReactElement;
    problemText: () => (string | undefined);
    setProblemText: (code: string) => void;
}

interface IProblemInputState {
    fileRef: React.MutableRefObject<FileInput | null>;
}

export class ProblemInputButtonPanel extends React.Component<IProblemInputProps, IProblemInputState> {
    constructor(props: IProblemInputProps) {
        super(props);

        this.state = {
            fileRef: React.createRef()
        }

        this.onFileUploaded = this.onFileUploaded.bind(this);
    }

    onFileUploaded(files: FileList | null): void {
        if (files.length == 0) return;

        files[0].text().then((text: string) => {
            this.props.setProblemText(text);
        });
    }

    render() {
        return (
            <Stack spacing='24px' direction='row'>
                <FileInput ref={this.state.fileRef} onFileChanged={this.onFileUploaded}/>
                <Spacer/>
                <ProblemInputButton icon={<TbRotate/>} text="New problem" onClick={function () {

                }} toolTipText="Clear textfield"/>
                <ProblemInputButton icon={<TbDownload/>} text="Download problem"
                                    toolTipText="Download problem as local file"
                                    onClick={
                                        () => {
                                            const element = document.createElement("a");
                                            const fileContent = this.props.problemText() as BlobPart;
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
                                        this.state.fileRef.current?.openInput();
                                    }}/>
                <ProblemInputButton_HelpButton helpBody={this.props.helpBody}/>
                <Spacer/>
            </Stack>
        )
    }
}