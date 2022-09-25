import React from "react";

interface IFileInputProps {
    multiple?: boolean;
    accept?: string;
    onFileChanged?: (files: FileList | null) => void;
}

interface IFileInputState {
    inputRef: React.MutableRefObject<HTMLInputElement | null>;
}

export class FileInput extends React.Component<IFileInputProps, IFileInputState> {
    constructor(props: IFileInputProps) {
        super(props);

        this.state = {
            inputRef: React.createRef()
        }
    }

    openInput(): void {
        this.state.inputRef.current?.click()
    }

    render() {
        return (
            <label>
                <input
                    hidden
                    ref={this.state.inputRef}
                    style={{display: "none"}}
                    type="file"
                    accept={this.props.accept}
                    multiple={this.props.multiple || false}
                    onChange={e => {
                        this.props.onFileChanged?.(e.target.files);
                    }}
                />
            </label>
        );
    }
}