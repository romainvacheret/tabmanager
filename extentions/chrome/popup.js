document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("listTabs").addEventListener("click", () => {
        chrome.tabs.query({ highlighted: true}, (tabs) => {
            let tableBody = document.querySelector("#tabsTable tbody");
            tableBody.innerHTML = ""; 

            chrome.tabs.query({ active: true, currentWindow: true }, (activeTabs) => {
                let activeTabId = activeTabs.length > 0 ? activeTabs[0].id : null;

                tabs.forEach((tab) => {
                    let row = document.createElement("tr");
                    let cell = document.createElement("td");
                    cell.textContent = tab.url; 

                    if (tab.id === activeTabId) {
                        cell.style.color = "blue";
                        cell.style.fontWeight = "bold";
                    }

                    row.appendChild(cell);
                    tableBody.appendChild(row);
                });
            });
        });
    });
});
