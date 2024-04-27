const socket = io("/join");
const sessionId = window.location.pathname.split("/").pop();
const form = document.querySelector(".word-form form");
const word1Input = document.getElementById("word1");
const word2Input = document.getElementById("word2");
const strengthInput = document.getElementById("strength");

socket.emit("sessionId", sessionId);

form.addEventListener("submit", (event) => {
	event.preventDefault();
	const word1 = word1Input.value.trim();
	const word2 = word2Input.value.trim();
	const strength = Number.parseInt(strengthInput.value);
	if (word1 && word2 && strength) {
		socket.emit("word", { sessionId, word1, word2, strength });
		word1Input.value = "";
		word2Input.value = "";
		strengthInput.value = "1";
	}
});

// Fetch the data from a server or local file
fetch(`/words/${sessionId}.json`)
	.then((response) => response.json())
	.then((data) => {
		// Get the select elements
		const word1Select = document.getElementById("word1");
		const word2Select = document.getElementById("word2");

		// Populate the select options
		for (const word of data.words) {
			const option1 = document.createElement("option");
			option1.value = word;
			option1.text = word;
			word1Select.add(option1);

			const option2 = document.createElement("option");
			option2.value = word;
			option2.text = word;
			word2Select.add(option2);
		}
	});
