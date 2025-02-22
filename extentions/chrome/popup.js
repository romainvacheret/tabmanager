// TODO: check response status
const getStoredTabs = async (collectionName) => {
    return fetch(`http://127.0.0.1:5000/collection/retrieve?collection=${collectionName}`)
    .then(response => response.json())
    .then(data => {
        console.log(data);
            const urls = data["collection"]
        localStorage.setItem("tabs", JSON.stringify(urls));
            return urls
        })
}

const storeTabs = async (collectionName, urls) => {
    return fetch(`http://127.0.0.1:5000/collection/store`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ collection: collectionName, urls })
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
            const urls = data["collection"]
        localStorage.setItem("tabs", JSON.stringify(urls));
            return urls
        })
}

const openTabs = (urls, windowId) => urls.forEach(url => chrome.tabs.create({ url, windowId }));

document.addEventListener("DOMContentLoaded", () => {
    console.log("Tabmanager Popup loaded");
    const homePage = document.getElementById("homePage");
    const storePage = document.getElementById("storePage");
    const retrievePage = document.getElementById("retrievePage");

    const storePageButton = document.getElementById("storePageButton");
    const retrievePageButton = document.getElementById("retrievePageButton");
    const backPageButtons = document.querySelectorAll(".homePageButton");

    const listTabsButton = document.getElementById("listTabs");

    const retrieveTabsButton = document.getElementById("retrieveTabsButton");
    const storeTabsButton = document.getElementById("storeTabsButton");

    const collectionRetrievalInput = document.getElementById("collectionRetrievalInput");
    const collectionStorageInput = document.getElementById("collectionStorageInput");

    const buttonListeners = [
        [storePageButton, storePage],
        [retrievePageButton, retrievePage],
        [backPageButtons[0], homePage],
        [backPageButtons[1], homePage],
    ];

    const showPage = (page) => {
        console.log("showPage", page);
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
        tabs => {
            createTabTable(tabs)
            sessionStorage.setItem("tabs", JSON.stringify(tabs.map(tab => tab.url)));
        }
    );

    listTabsButton.addEventListener("click", listTabs);


    retrieveTabsButton.addEventListener("click", async () => {
        const collectionName = collectionRetrievalInput.value;
        const urls = await getStoredTabs(collectionName);
        const isInNewWindow = document.getElementById("newWindow").checked;

        if (isInNewWindow) {
            chrome.windows.create({ url: urls.shift() }, window =>  openTabs(urls, window.id));
        } else {
            chrome.windows.getCurrent(window =>  openTabs(urls, window.id));
        }
    });

    storeTabsButton.addEventListener("click", async () => 
        chrome.tabs.query({ highlighted: true, currentWindow: true }, tabs => {
            const collectionName = collectionStorageInput.value;
            storeTabs(collectionName, tabs.map(tab => tab.url));
        }
    ));
    
    const listTabssButton = document.getElementById("listTabsButton");
    listTabssButton.addEventListener("click", () => {
        getStoredTabs("first_collection");
    });

});
