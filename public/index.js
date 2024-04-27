const sessionIDelement = document.getElementById("sessionId");

sessionIDelement.addEventListener("input", () => {
  if (sessionIDelement.value.length === 4) {
    sessionIDelement.setAttribute("aria-invalid", false);
  } else {
    sessionIDelement.setAttribute("aria-invalid", true);
  }
});