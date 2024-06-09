export function add(a, b) {
    return a + b;
}

export function hello() {
    return "Hello world";
}

// update game statistics in db
export async function sendGameData(points, game, endpoint) {
    
    try {
        const response = await fetch(endpoint, {
           method: "POST",
           headers: {
            "Content-Type": "application/json",
           },
           body: JSON.stringify({"points": points, "game": game}), 
        });
        const result = await response.json();
        console.log("Success: ", result.message);
        displayFlashMessage(result.message, result.category)
    }
    catch (error) {
        console.log("Error: ", error);
    }
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