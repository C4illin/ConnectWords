const sessionIDelement = document.getElementById("sessionId");
let wordIndex = 1;
let connectionIndex = 1;

sessionIDelement.addEventListener("input", () => {
	if (sessionIDelement.value.length === 6) {
		sessionIDelement.setAttribute("aria-invalid", false);
	} else {
		sessionIDelement.setAttribute("aria-invalid", true);
	}
});

document.getElementById("addWordButton").addEventListener("click", () => {
	const colors = [
		"#029AE8",
		"#D27A01",
		"#779C00",
		"#F45D2C",
		"#A780D4",
		"#47A417",
		"#F06048",
		"#9E9200",
		"#F6547E",
		"#748BF8",
		"#F748B7",
		"#CD68E0",
		"#05A2A2",
		"#00A66E",
		"#9486E1",
	];
	const table = document.getElementById("wordsTable");
	const row = table.insertRow(-1);
	const cell1 = row.insertCell(0);
	const cell2 = row.insertCell(1);
	const cell3 = row.insertCell(2);
	const cell4 = row.insertCell(3);

	cell1.innerHTML = '<input type="text" name="words[]" placeholder="Word">';
	cell2.innerHTML = `<input type="color" name="colors[]" value="${colors[wordIndex]}">`;
	cell3.innerHTML = '<input type="color" name="textColors[]" value="#000000">';
	cell4.innerHTML =
		'<td><button type="button" class="secondary" onclick="removeRow(this)">X</button></td>';
	wordIndex = (wordIndex + 1) % colors.length;
});

function removeRow(button) {
	const row = button.parentElement.parentElement;
	row.remove();
}

document.getElementById("addConnectionButton").addEventListener("click", () => {
	const colors = ["#3C71F7", "#398712", "#F2DF0D", "#FF9500", "#D93526"];
	const table = document.getElementById("connectionsTable");
	const row = table.insertRow(-1);
	const cell1 = row.insertCell(0);
	const cell2 = row.insertCell(1);
	const cell3 = row.insertCell(2);

	cell1.innerHTML =
		'<input type="text" name="connectionNames[]" placeholder="Connection">';
	cell2.innerHTML = `<input type="color" name="connectionColors[]" value="${colors[connectionIndex]}">`;
	cell3.innerHTML =
		'<td><button type="button" class="secondary" onclick="removeRow(this)">X</button></td>';
	connectionIndex = (connectionIndex + 1) % colors.length;
});
