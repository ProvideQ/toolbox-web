import React from "react";
import { Icon, SimpleGrid } from "@chakra-ui/react";
import { TbDownload, TbUpload } from 'react-icons/tb'
import { FileInput } from "../FileInput";
import { InputButton } from "./InputButton";
import { HelpButton } from "./HelpButton";

interface InputProps {
    helpBody: React.ReactElement;
    problemText: () => (string | undefined);
    setProblemText: (code: string) => void;
}

interface InputState {
    fileRef: React.MutableRefObject<FileInput | null>;
}

export class InputButtonPanel extends React.Component<InputProps, InputState> {
    constructor(props: InputProps) {
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

    onDownloadClicked() {
        const element = document.createElement("a");
        const fileContent = this.props.problemText() as BlobPart;
        const file = new Blob([fileContent], {type: 'text/plain;charset=utf-8'});
        element.href = URL.createObjectURL(file);
        element.download = "problem.txt";
        document.body.appendChild(element);
        element.click();
    }

    render() {
        return (
            <>
            <FileInput ref={this.state.fileRef} onFileChanged={this.onFileUploaded}/>
            <SimpleGrid columns={3} gap={6} >
                <InputButton icon={<Icon as={TbDownload}/>} text="Download problem"
                                    toolTipText="Download problem as local file"
                                    onClick={() => {
                                        this.onDownloadClicked();   
                                    }}/>
                <InputButton icon={<Icon as={TbUpload}/>} text="Upload problem"
                                    toolTipText="Upload problem from local file"
                                    onClick={() => {
                                        this.state.fileRef.current?.openInput();
                                    }}/>
                <HelpButton helpBody={this.props.helpBody}/>
            </SimpleGrid>
            </>
        )
    }
}