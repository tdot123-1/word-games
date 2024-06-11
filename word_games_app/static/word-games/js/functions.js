
// update game statistics in db
export async function sendGameData(points, game, userId) {
    // send data back to server, wait for response
    try {
        const response = await fetch("/update-game-data", {
           method: "POST",
           headers: {
            "Content-Type": "application/json",
           },
           body: JSON.stringify({"points": points, "game": game, "userId": userId}), 
        });

        if (!response.ok) {
            throw new Error("HTTP error: ", response.status);
        }
        const result = await response.json();
        console.log("server response: ", result.message);
        // return true if result was succesfull
        if (result.category === "success") {
            return true;
        }
    }
    catch (error) {
        console.log("Error: ", error);
    }
    return false;
}


// display flashed messages in DOM
export function displayFlashMessage(message, category) {

    const alertsContainer = document.getElementById("custom-dyn-alerts");
    // create element to display message
    // add appropriate classes
    let alertDiv = document.createElement("div");
    alertDiv.classList.add("alert");
    alertDiv.classList.add("alert-dismissible");
    alertDiv.classList.add("fade");
    alertDiv.classList.add("show");
    if (category === "warning") {
        alertDiv.classList.add("alert-warning");
    }
    else if (category === "success") {
        alertDiv.classList.add("alert-success");
    }
    else {
        alertDiv.classList.add("alert-danger");
    }
    alertDiv.setAttribute("role", "alert");

    // fill in message received from server, add close button
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;

    // append the alertDiv to alerts container
    scrollPage("top");
    alertsContainer.appendChild(alertDiv);
}


// initialize bootstrap popover
export function initPopover() {
    const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]')
    const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl))
    return {
        "popoverTriggerList": popoverTriggerList,
        "popoverList": popoverList,
    };
}


// scroll to bottom/top
export function scrollPage(direction) {
    if (direction === "bottom") {
        direction = document.body.scrollHeight
    }
    else {
        direction = 0;
    }
    window.scrollTo({
        top: direction,
        behavior: 'smooth'
    });
}


// check word validity depending on game
export async function checkWordValidity(word, game, endpoint) {
    let valid = false;
    try {
        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({"word": word, "game": game}), 
        });

        if (!response.ok) {
            throw new Error("HTTP error: ", response.status);
        }
        const result = await response.json();
        console.log(result.message);
        if (result.category !== "success") {
            displayFlashMessage(result.message, result.category);
        }
        else {
            valid = true;
        }
    }
    catch(error) {
        console.log("Error: ", error);
    }
    finally {
        return valid;
    }
}


// save properties that all games will share in one class
export class GameState {
    constructor(gameName, points, playBtn, spinner, userId) {
        this.gameName = gameName;
        this.ended = false;
        this.won = false;
        this.resendData = false;
        this.points = points;
        this.playBtn = playBtn;
        this.spinner = spinner;
        this.userId = userId;
    }

    // game over proces will be the same across games
    async gameOver() {
        // game ended and play button disabled
        this.ended = true;
        this.playBtn.disabled = true;
        if (this.won) {
            // show spinner if stats need to be updated
            this.spinner.style.display = "flex";
            try {
                const statsUpdated = await sendGameData(this.points, this.gameName, this.userId);
                this.spinner.style.display = "none";
                this.playBtn.disabled = false;
                // if something went wrong, change button to try re sending data
                if (!statsUpdated) {
                    this.resendData = true;
                    this.playBtn.innerHTML = "retry sending data";
                    return;
                }
            }
            catch (error) {
                console.log("Error: ", error);
                this.resendData = true;
                this.playBtn.innerHTML = "retry sending data";
                return;
            }
        }
        // if stats don't need to be updated, set up button accordingly
        this.playBtn.disabled = false;
        this.playBtn.innerHTML = "play again?";
    }
}