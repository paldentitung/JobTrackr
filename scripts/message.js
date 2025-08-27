const messageBox = document.getElementById("message");
const messageButton = document.getElementById("message-btn");
if (messageButton) {
  messageButton.addEventListener("click", () => {
    modalOpen();
    modalContent.innerHTML = `message sent : ${messageBox.value}`;
    messageBox.value = "";
  });
}
