import { 
    scrollPage,
} from "./functions.js";

document.addEventListener("DOMContentLoaded", () => {

    // scroll to bottom of page when item is expanded
    document.querySelectorAll(".accordion-header").forEach(button => {

        button.addEventListener("click", () => {

            setTimeout(() => {
                scrollPage("bottom");
            }, 300);

        });
    });
    

});