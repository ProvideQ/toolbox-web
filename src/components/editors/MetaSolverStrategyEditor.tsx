import Editor, { useMonaco } from "@monaco-editor/react";
import { CancellationToken, editor, languages, Position } from "monaco-editor";
import { useEffect, useState } from "react";
import { LanguageServerAPI } from "../../api/LanguageServerAPI";
import ITextModel = editor.ITextModel;
import CompletionContext = languages.CompletionContext;

const languageId: string = "test";

export const MetaSolverStrategyEditor = () => {
  const monaco = useMonaco();
  const [webServerApi, setWebServerApi] = useState<LanguageServerAPI | null>(
    null
  );

  useEffect(() => {
    if (monaco) {
      console.log("here is the monaco instance:", monaco);
      // Initialize the LanguageServerAPI with the WebSocket URL
      const webSocketUrl = "ws://localhost:5001/";
      const api = new LanguageServerAPI(webSocketUrl);
      setWebServerApi(api);
    }
  }, [monaco]);

  useEffect(() => {
    if (!monaco) return;

    // Register the language server
    monaco.languages.register({ id: languageId });
    monaco.languages.registerCompletionItemProvider(languageId, {
      provideCompletionItems: async (
        model: ITextModel,
        position: Position,
        context: CompletionContext,
        token: CancellationToken
      ) => {
        const completion = await webServerApi?.getCompletion({
          line: position.lineNumber,
          character: position.column,
        });
        console.log("result", completion);
        const word = model.getWordUntilPosition(position);
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn,
        };
        console.log("completions!");
        return {
          suggestions: completion,
        };
      },
    });
  }, [webServerApi]);

  return (
    <Editor
      height="50vh"
      defaultValue={`print('Hello, world!')\n"test".`}
      defaultLanguage={languageId}
      language={languageId}
    />
  );
};
