import { add, hello } from "./functions.js";

document.addEventListener("DOMContentLoaded", () => {

    console.log("Running test.js");

    const result = add(2, 3);
    console.log(`Add() returns ${result}`)
    console.log(hello());

});