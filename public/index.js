const sessionIDelement = document.getElementById("sessionId");
let index = 1;

sessionIDelement.addEventListener("input", () => {
	if (sessionIDelement.value.length === 4) {
		sessionIDelement.setAttribute("aria-invalid", false);
	} else {
		sessionIDelement.setAttribute("aria-invalid", true);
	}
});

document.getElementById("addWordButton").addEventListener("click", () => {
	const colors = [
		"#57a9e2",
		"#ffb574",
		"#5fd35f",
		"#e77c7c",
		"#c6aedc",
		"#bc8b81",
		"#f4cce8",
		"#b2b2b2",
		"#e2e362",
		"#5fe0ed",
	];
	const table = document.getElementById("wordsTable");
	const row = table.insertRow(-1);
	const cell1 = row.insertCell(0);
	const cell2 = row.insertCell(1);
	const cell3 = row.insertCell(2);

	cell1.innerHTML = '<input type="text" name="words[]" placeholder="Word">';
	cell2.innerHTML = `<input type="color" name="colors[]" value="${colors[index]}">`;
	cell3.innerHTML = '<input type="color" name="textColors[]" value="#000000">';
  index = (index + 1) % colors.length;
});
