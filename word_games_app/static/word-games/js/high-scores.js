import { initPopover, } from "./functions.js";

document.addEventListener("DOMContentLoaded", () => {
    // initialize bootstrap component
    initPopover();
    // select clickable table heads, table body content
    const tableHeads = document.querySelectorAll(".t-head");
    const tableBody = document.querySelector("tbody");

    async function sortBy(column) {
        try {
            // send clicked column back to server to perform sorting query there
            const response = await fetch(`/high-scores?column=${column}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error: ${response.status}`);
            }
            // receive sorted rows in json format
            const data = await response.json();
            
            // empty table body, then add each row from received data
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

    // add event listener to each clickable table head
    tableHeads.forEach(header => {
        header.addEventListener("click", () => {
            sortBy(header.id);
        });
    });

});