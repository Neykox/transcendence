// let name = "batmman"
const text = document.querySelector("#text");
const button1 = document.querySelector("#button1");

button1.onclick = fruit;

function fruit() {
	console.log("cliked");
	if (button1.innerText === "banana")
	{
		console.log("changed to apple")
		button1.innerText = "apple";
	}
	else
	{
		console.log("changed to banana")
		button1.innerText = "banana";
	}
}

// text.innerText = name;