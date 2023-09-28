import React from "react";

export async function chooseFile(
  multiple?: boolean,
  accept?: string
): Promise<FileList | null> {
  const input = document.createElement("input");
  input.accept = accept || "";
  input.multiple = multiple || false;
  input.hidden = true;
  input.style.all = "display: none";
  input.type = "file";
  document.body.appendChild(input);

  return new Promise((resolve, reject) => {
    input.addEventListener("change", (e) => {
      resolve(input.files);
    });
    input.click();
  });
}
