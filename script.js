class Synthesys {
  constructor() {}
  open(blandId) {
    // Create modal background
    const modalBackground = document.createElement("div");
    modalBackground.style.position = "fixed";
    modalBackground.style.top = 0;
    modalBackground.style.left = 0;
    modalBackground.style.width = "100%";
    modalBackground.style.height = "100%";
    modalBackground.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    modalBackground.style.display = "flex";
    modalBackground.style.justifyContent = "center";
    modalBackground.style.alignItems = "center";

    // Create modal container
    const modalContainer = document.createElement("div");
    modalContainer.style.backgroundColor = "white";
    modalContainer.style.width = "500px";
    modalContainer.style.height = "500px";
    modalContainer.style.position = "relative";
    modalContainer.style.border = "2px solid blue"; // Light-blue border added
    modalContainer.style.borderRadius = "5px"; // Optional: adds rounded corners

    // Create close button
    const closeBtn = document.createElement("button");
    closeBtn.innerText = "X";
    closeBtn.style.position = "absolute";
    closeBtn.style.top = "10px";
    closeBtn.style.right = "10px";
    closeBtn.style.backgroundColor = "red";
    closeBtn.style.color = "white";
    closeBtn.style.border = "none";
    closeBtn.style.padding = "5px";
    closeBtn.style.cursor = "pointer";

    // Add close event to button
    closeBtn.addEventListener("click", () => {
      document.body.removeChild(modalBackground);
    });

    // Create iframe
    const iframe = document.createElement("iframe");
    iframe.src = "https://synthesysai.netlify.app/ai-calls?clintId=123";
    iframe.style.width = "100%";
    iframe.style.height = "100%";
    iframe.style.border = "none";
    iframe.allow = "microphone";

    // Disable form elements on iframe load
    iframe.onload = function () {};

    // Append iframe and close button to modal container
    modalContainer.appendChild(closeBtn);
    modalContainer.appendChild(iframe);

    // Append modal container to modal background
    modalBackground.appendChild(modalContainer);

    // Append modal background to body
    document.body.appendChild(modalBackground);
  }
}

const synthesys = new Synthesys();
