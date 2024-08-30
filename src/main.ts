import "./style.css";
import { init } from "./tape";
import "./input";

const textPlaceholder =
    "enter the transition function here in the format: q0,0,R,q1";

document
    .getElementById("textarea")!
    .setAttribute("placeholder", textPlaceholder);

init();
