document.addEventListener("DOMContentLoaded", () => {
    const homePage = document.getElementById("homePage");
    const storePage = document.getElementById("storePage");
    const retrievePage = document.getElementById("retrievePage");

    const storeButton = document.getElementById("storeButton");
    const retrieveButton = document.getElementById("retrieveButton");
    const backButtons = document.querySelectorAll(".backButton");
    const listTabsButton = document.getElementById("listTabs");

    const buttonListeners = [
        [storeButton, storePage],
        [retrieveButton, retrievePage],
        [backButtons[0], homePage],
        [backButtons[1], homePage],
    ];

    const showPage = (page) => {
        document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
        page.classList.add("active");
    }

    buttonListeners.forEach(([button, page]) => button.addEventListener("click", () => showPage(page)));

    const createTabTable = (tabs) => {
        let tableBody = document.querySelector("#tabsTable tbody");
        tableBody.innerHTML = ""; 

        tabs.forEach(tab => {
            let row = document.createElement("tr");
            let cell = document.createElement("td");
            cell.textContent = tab.title; 

            row.appendChild(cell);
            tableBody.appendChild(row);
        });
    };

    const listTabs = () => chrome.tabs.query(
        // We only want the selected tabs from the current window
        // If currentWindow is false, would also take the active tab 
        // from other windows
        { highlighted: true, currentWindow: true },
        tabs => createTabTable(tabs)
    );

    listTabsButton.addEventListener("click", listTabs);
});
