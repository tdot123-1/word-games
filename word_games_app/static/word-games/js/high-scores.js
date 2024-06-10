import { initPopover, } from "./functions.js";

document.addEventListener("DOMContentLoaded", () => {

    initPopover();

    const tableHeads = document.querySelectorAll(".t-head");

    const tableBody = document.querySelector("tbody");

    async function sortBy(column) {
        try {
            const response = await fetch(`/high-scores?column=${column}`);
            
            // update the contents of tbody
            if (!response.ok) {
                throw new Error(`HTTP error: ${response.status}`);
            }
            const data = await response.json();
            tableBody.innerHTML = "";

            data.forEach((user, index) => {
                const row = `
                <tr>
                    <th scope="row">${index + 1}</th>
                    <td>${user.username}</td>
                    <td>${user.total_points}</td>
                    <td>${user.hs_guess}</td>
                    <td>${user.hs_rush}</td>
                    <td>${user.hs_search}</td>
                </tr>`
                tableBody.innerHTML += row;
            });
        }
        catch (error) {
            console.log("Error: ", error);
        }
    }


    tableHeads.forEach(header => {
        header.addEventListener("click", () => {
            sortBy(header.id);
        });
    });

});