var input = document.getElementById("inputfield");

var clickSound = new Audio("sounds/click.mp3");
var errorSound = new Audio("sounds/error.mp3");

function playClick() {
  clickSound.currentTime = 0;
  clickSound.play();
}

function playError() {
  errorSound.currentTime = 0;
  errorSound.play();
}

function getValue(buttonValue) {
  playClick();
  input.value += buttonValue;
}

function clearAll() {
  playClick();
  input.value = "";
}

function delChar() {
  playClick();
  input.value = input.value.slice(0, -1);
}

function equal() {
  if (!input.value) {
    playError();
    input.value = "syntax error";
    return;
  }

  try {
    playClick();
    input.value = eval(
      input.value
        .replace(/sin/g, "Math.sin")
        .replace(/cos/g, "Math.cos")
        .replace(/tan/g, "Math.tan")
        .replace(/log/g, "Math.log10")
        .replace(/√/g, "Math.sqrt")
    );
  } catch {
    playError();
    input.value = "error";
  }
}

document.addEventListener("keydown", function(e) {
  if ("0123456789+-*/().".includes(e.key)) {
    playClick();
    input.value += e.key;
  }

  if (e.key === "Enter") equal();
  if (e.key === "Backspace") {
    playClick();
    delChar();
  }
});

function startVoice() {
  playClick();

  var rec = new webkitSpeechRecognition();
  rec.lang = "en-US";
  rec.start();

  rec.onresult = function(e) {
    let transcript = e.results[0][0].transcript.toLowerCase();

    const wordToNum = {
      "zero": "0", "one": "1", "two": "2", "three": "3",
      "four": "4", "five": "5", "six": "6", "seven": "7",
      "eight": "8", "nine": "9", "ten": "10"
    };

    for (let word in wordToNum) {
      transcript = transcript.replace(new RegExp(`\\b${word}\\b`, "g"), wordToNum[word]);
    }

    transcript = transcript
      .replace(/plus/g, "+")
      .replace(/minus/g, "-")
      .replace(/multiply|into/g, "*")
      .replace(/divide by/g, "/")
      .replace(/\s+/g, ""); 

    input.value += transcript;
  };

  rec.onerror = function () {
    playError();
  };
}

