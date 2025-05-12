import {
  CompletionParams,
  DidOpenTextDocumentNotification,
  DidOpenTextDocumentParams,
  Position,
} from "vscode-languageserver-protocol";

export class LanguageServerAPI {
  private url: string;
  private webSocket: WebSocket;
  private fileUri: string = "file:///C:/Users/nickp/Downloads/test.py";
  private languageId: string = "python";

  public constructor(url: string) {
    this.url = url;

    this.webSocket = new WebSocket(url);
    this.webSocket.onopen = (event) => {
      console.log("WebSocket connection opened:", event);

      const params: DidOpenTextDocumentParams = {
        textDocument: {
          uri: this.fileUri,
          languageId: this.languageId,
          version: 1,
          text: `print('Hello, world!')\n"test".`,
        },
      };
      this.webSocket.send(
        JSON.stringify({
          jsonrpc: "2.0",
          method: DidOpenTextDocumentNotification.method,
          params: params,
        })
      );
      // const params2: CompletionParams = {
      //   textDocument: {
      //     uri: this.fileUri,
      //   },
      //   position: {
      //     line: 1,
      //     character: 8,
      //   },
      // };
      // this.webSocket.send(
      //   JSON.stringify({
      //     jsonrpc: "2.0",
      //     method: "textDocument/completion",
      //     params: params2,
      //   })
      // );
    };
    this.webSocket.onmessage = (event) => {
      console.log("Message received:", JSON.parse(event.data));
    };
    this.webSocket.onclose = (event) => {
      console.log("WebSocket connection closed:", event);
    };
    this.webSocket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
  }

  public getCompletion(position: Position): Promise<any> {
    return new Promise((resolve, reject) => {
      const handleMessage = (event: MessageEvent) => {
        const response = JSON.parse(event.data);

        if (response.result && response.result.items) {
          this.webSocket.removeEventListener("message", handleMessage);
          console.log("Completion items received:", response.result.items);
          resolve(response.result.items);
        } else if (response.error) {
          this.webSocket.removeEventListener("message", handleMessage);
          console.error("Error in completion response:", response.error);
          reject(response.error);
        }
      };

      this.webSocket.addEventListener("message", handleMessage);

      const params: CompletionParams = {
        textDocument: {
          uri: this.fileUri,
        },
        position: {
          line: position.line - 1,

          character: position.character,
        },
      };
      this.webSocket.send(
        JSON.stringify({
          jsonrpc: "2.0",
          id: Date.now(),
          method: "textDocument/completion",
          params: params,
        })
      );
      console.log("sent completion request", params);
    });
    // return new Promise((resolve, reject) => {
    //   const params: CompletionParams = {
    //     textDocument: {
    //       uri: this.fileUri,
    //     },
    //     position: position,
    //   };
    //   this.webSocket.send(
    //     JSON.stringify({
    //       jsonrpc: "2.0",
    //       method: "textDocument/completion",
    //       params: params,
    //     })
    //   );
    //   console.log("sent completion request", params);
    //   this.webSocket.addEventListener("message", (event) => {
    //     console.log("AAAAAAAAAAAAAAAAAAAAAA Message received:", event.data);
    //     const response = JSON.parse(event.data);
    //     if (response.method === CompletionRequest.method) {
    //       console.log("Completion response:", response);
    //       resolve(response);
    //     }
    //   });
    // });
  }
}
