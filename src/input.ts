import { tokenType, transitionFunction, tokenize } from "./lexer";
import { setInitialSymbols } from "./tape";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";

const textareas = document.getElementById("textarea") as HTMLTextAreaElement;
const runBtn = document.getElementById("run") as HTMLButtonElement;
const error = document.getElementById("error") as HTMLDivElement;

runBtn.addEventListener("click", () => {
    error.innerHTML = "";
    let input = textareas.value;
    let transitionFunctions: transitionFunction[];
    try {
        const tokens = tokenize(input);
        tokens.forEach((token) => {
            if (token.type === tokenType.NAME) {
                document.getElementById("name")!.innerHTML = `MACHINE NAME: ${(
                    token.value as string
                ).toUpperCase()}`;
            } else if (token.type === tokenType.INITIALSTATE) {
                document.getElementById(
                    "currentState"
                )!.innerHTML = `CURRENT STATE: ${token.value as string}`;
            } else if (token.type === tokenType.TRANSITIONFUNCTION) {
                transitionFunctions = token.value as transitionFunction[];
            } else if (token.type === tokenType.TAPE) {
                setInitialSymbols(token.value as string);
            }
        });
    } catch (e: any) {
        const errorLine = e.message.split(":")[0];
        Toastify({
            text: errorLine as string,
            duration: 3000,
            close: true,
            gravity: "top",
            position: "right",
            backgroundColor: "red",
        }).showToast();
        error.innerHTML = e.message;
    }
});
