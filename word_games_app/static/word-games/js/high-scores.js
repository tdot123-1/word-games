import { initPopover } from "./functions";

document.addEventListener("DOMContentLoaded", () => {

    initPopover();

    const tableHeads = document.querySelectorAll(".t-head");

    async function sortBy(column) {
        try {
            const response = await fetch(`/sort?column=${column}`);
            const result = await response.json();
            console.log("server response: ", result.message);

        }
        catch (error) {
            console.log("Error: ", error);
        }
    }

});