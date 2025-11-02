const healthButton = document.getElementById("health-button");
const statusMessage = document.getElementById("status-message-health");

console.log("healthButton:", healthButton);
console.log("statusMessage:", statusMessage);

healthButton.addEventListener('click', (event) =>
{console.log("clicking from addEventListener");
    getHealthApi(event)
})

function getHealthApi(event) {
if(statusMessage.classList.contains("error")) {
    statusMessage.classList.remove("error")
}
statusMessage.textContent = "Loading...";
statusMessage.classList.add("loading");

fetch("/api/health")
    .then((response) => response.text())
    .then((data) => {
        console.log("API response: ", data);
        statusMessage.textContent = data;
        statusMessage.classList.remove("loading")
    }). catch((error) => {
        console.error("Fetch error: ", error);
        statusMessage.textContent = "Error fetching health status page."
        statusMessage.classList.remove("loading");
        statusMessage.classList.add("error-health")
    })
    
}