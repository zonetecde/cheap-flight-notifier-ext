import { doc } from "prettier";

setInterval(addSpyButtons, 1000);

function formatFrenchDate(dateText: string) {
    // Define a mapping of French month names to their numerical representations
    const monthMap: any = {
        "janv.": 0,
        "févr.": 1,
        mars: 2,
        "avr.": 3,
        mai: 4,
        juin: 5,
        "juil.": 6,
        août: 7,
        "sept.": 8,
        "oct.": 9,
        "nov.": 10,
        "déc.": 11,
        janvier: 0,
        février: 1,
        avril: 3,
        juillet: 6,
        septembre: 8,
        octobre: 9,
        novembre: 10,
        décembre: 11,
    };

    // Split the date string into parts
    const parts = dateText.split(" ");

    // Extract day, month, and year
    const day = parseInt(parts[1], 10);
    const month = monthMap[parts[2]];
    const year = parseInt(parts[3], 10);

    // Create a new Date object
    const dateObj = new Date(year, month, day);

    // Format the date
    const formattedDate = dateObj.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });

    return formattedDate;
}

function getDate(dateText: string, forceYear: number | null = null): string {
    const originalDateText = dateText;

    if (forceYear) {
        dateText += " " + forceYear;
    } else {
        const url = window.location.href;

        // between '&depDate=' and '-'
        const dateRegex = /&depDate=(.*?)-/;
        const dateMatch = url.match(dateRegex);
        if (dateMatch) {
            dateText += " " + dateMatch[1];
        }
    }

    if (dateText) {
        const formattedDate = formatFrenchDate(dateText);

        if (formattedDate === "Invalid Date") {
            return getDate(originalDateText, Number(new Date().getFullYear()));
        }

        return formattedDate;
    }

    return dateText;
}

function addSpyButtons() {
    const element = document.querySelector(".FlightInformation__selectionStatus") as HTMLElement;

    if (element && element.querySelector(".spy-btn") === null) {
        // grid, 2 cols
        element.style.display = "grid";
        element.style.gridTemplateColumns = "0.75fr 1fr";
        element.style.gap = "5px";

        const button = element.children[0].cloneNode(false) as HTMLButtonElement;
        button.classList.add("spy-btn");
        button.textContent = "Espionner";
        button.style.backgroundColor = "#d2ffb4";
        button.addEventListener("click", () => {
            const date = document.querySelector(".SelectedDate__selectedDate");
            let dateText = date?.textContent;

            if (!dateText) return;

            dateText = getDate(dateText);

            addDateToSpyList(dateText);
        });
        element.appendChild(button);
    }

    // bouton aussi sur les éléments du carrousel
    const elements = document.querySelectorAll(".DataCarouselItem__tabFlightPrice");
    elements.forEach((element) => {
        if (element.innerHTML.includes("Aucun vol") === false && element.querySelector(".spy-btn") === null) {
            const button = document.createElement("button") as HTMLButtonElement;
            button.classList.add("spy-btn");

            button.textContent = "Espionner";
            button.style.textAlign = "center";
            button.style.marginTop = "10px";
            button.style.padding = "2.5px";
            button.style.border = "1px solid black";
            button.style.cursor = "pointer";
            button.style.borderRadius = "5px";

            button.style.backgroundColor = "#d2ffb4";
            button.addEventListener("click", () => {
                const date = element.parentElement?.querySelector(".DataCarouselItem__tabFlightDate");

                let dateText = date?.textContent;

                if (!dateText) return;

                dateText = getDate(dateText);

                addDateToSpyList(dateText);
            });
            element.appendChild(button);
        }
    });
}
async function addDateToSpyList(dateText: string) {
    chrome.storage.sync.get(["telegramsId"], function (result) {
        if (result.telegramsId) {
            alert(result.telegramsId);
        }
    });
}
