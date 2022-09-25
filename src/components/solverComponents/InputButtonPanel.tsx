import { Spacer, Flex } from "@chakra-ui/react";
import React from "react";
import { TbDownload, TbUpload } from 'react-icons/tb'
import { FileInput } from "./FileInput";
import { InputButton } from "./InputButton";
import { HelpButton } from "./HelpButton";

interface IInputProps {
    helpBody: React.ReactElement;
    problemText: () => (string | undefined);
    setProblemText: (code: string) => void;
}

interface IInputState {
    fileRef: React.MutableRefObject<FileInput | null>;
}

export class InputButtonPanel extends React.Component<IInputProps, IInputState> {
    constructor(props: IInputProps) {
        super(props);

        this.state = {
            fileRef: React.createRef()
        }

        this.onFileUploaded = this.onFileUploaded.bind(this);
    }

    onFileUploaded(files: FileList | null): void {
        if (files == null || files.length == 0) return;

        files[0].text().then((text: string) => {
            this.props.setProblemText(text);
        });
    }

    render() {
        return (
            <Flex >
                <FileInput ref={this.state.fileRef} onFileChanged={this.onFileUploaded}/>
                <Spacer/>
                <InputButton icon={<TbDownload/>} text="Download problem"
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
                <Spacer />
                <InputButton icon={<TbUpload/>} text="Upload problem"
                                    toolTipText="Upload problem from local file"
                                    onClick={() => {
                                        this.state.fileRef.current?.openInput();
                                    }}/>
                <Spacer/>
                <HelpButton helpBody={this.props.helpBody}/>
                <Spacer/>
            </Flex>
        )
    }
}