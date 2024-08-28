let docBlob; // Variable to store the docx blob
const btn_convert = document.getElementById("btn_convert");
const btn_download = document.getElementById("btn_download");
const fileInput = document.getElementById("srtFile");

// copyrightYear function to set the current year in the #thisYear element
window.addEventListener("load", copyright, true);
function copyright() {
  const thisYear = new Date().getFullYear();
  document.getElementById("thisYear").innerHTML = thisYear;
}

// Enable the convert button once a file is selected
fileInput.addEventListener("change", function () {
  if (fileInput.files.length > 0) {
    btn_convert.disabled = false;
    const resultDiv = document.getElementById("result_div");
    resultDiv.innerHTML = ""; // Clear any previous content
  } else {
    btn_convert.disabled = true;
  }
});

// Start conversion process when the button is clicked
btn_convert.addEventListener("click", convertSrtToDocx);

// Converts an uploaded SRT file to DOCX format
function convertSrtToDocx() {
  const file = fileInput.files[0];
  if (!file) {
    alert("Please upload a .srt file first.");
    return;
  }

  const reader = new FileReader();
  reader.onload = function (event) {
    const srtText = event.target.result;
    const result = parseSrt(srtText);
    displayResult(result);
  };
  reader.readAsText(file);

  btn_convert.disabled = true;
  btn_download.disabled = false;
}

// Parses the SRT text into an array of sentences and counts the dialogues
function parseSrt(srtContent) {
  // Split the SRT content by lines
  const lines = srtContent.split("\n");

  // Initialize an empty array to store the trimmed dialogue
  const trimmedDialogue = [];

  // Initialize a variable to hold the current dialogue
  let currentDialogue = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Skip the line number and timestamp lines
    if (
      line === "" ||
      /^\d+$/.test(line) ||
      /^(\d{2}):(\d{2}):(\d{2}),(\d{3}) --> (\d{2}):(\d{2}):(\d{2}),(\d{3})$/.test(
        line
      )
    ) {
      // If we have accumulated dialogue, push it to the trimmedDialogue array
      if (currentDialogue.length > 0) {
        trimmedDialogue.push(currentDialogue.join("\n"));
        currentDialogue = []; // Reset currentDialogue for the next dialogue
      }
      continue; // Skip to the next iteration
    }

    // If the line is part of the dialogue, add it to the currentDialogue
    currentDialogue.push(line);
  }

  // After the loop, check if there's any remaining dialogue to push
  if (currentDialogue.length > 0) {
    trimmedDialogue.push(currentDialogue.join("\n"));
  }

  // Join all dialogues with an empty line between each
  const parsedSentences = trimmedDialogue.join("\n\n\n");
  const dialogueCount = trimmedDialogue.length;

  return { parsedSentences, dialogueCount };
}

// Displays the parsed sentences in the result div
function displayResult(result) {
  const resultDiv = document.getElementById("result_div");
  resultDiv.innerHTML = ""; // Clear previous results

  // Display the count of dialogues
  const countParagraph = document.createElement("p");
  countParagraph.textContent = `*** Total Dialogues: ${result.dialogueCount} ***`;
  resultDiv.appendChild(countParagraph);

  // Add a space line
  const spaceLine = document.createElement("p");
  spaceLine.innerHTML = "<br>";
  resultDiv.appendChild(spaceLine);

  // Ensure parsedSentences is a string
  if (typeof result.parsedSentences === "string") {
    result.parsedSentences.split("\n\n").forEach((sentence) => {
      const p = document.createElement("p");
      // Replace newline characters with <br> tags
      p.innerHTML = sentence.replace(/\n/g, "<br>");
      // If the sentence is empty, add a <br> tag
      if (sentence === "") {
        p.innerHTML = "<br>";
      }
      resultDiv.appendChild(p);
    });
  } else {
    console.error("Expected a string but got:", result.parsedSentences);
  }

  generateDocxFile(); // Prepare the docx file for download
}


// Generates a DOCX file from the parsed sentences
function generateDocxFile() {
  const resultDiv = document.getElementById("result_div");
  const paragraphs = resultDiv.querySelectorAll("p");

  // Split each paragraph by <br> and create separate Paragraph objects
  const children = Array.from(paragraphs).flatMap((p) => {
    return p.innerHTML
      .split(/<br\s*\/?>/gi)
      .map((line) => new docx.Paragraph(line.trim()));
  });

  const doc = new docx.Document({
    creator: "SRT to DOCX Converter",
    title: "Subtitle Document",
    sections: [
      {
        children: children,
      },
    ],
  });

  docx.Packer.toBlob(doc).then((blob) => {
    docBlob = blob; // Store the blob for later download
  });
}

// Downloads the generated DOCX file
function downloadDocx() {
  if (!docBlob) {
    alert("Please convert a file before downloading.");
    return;
  }

  const fileName = fileInput.files[0].name.replace(".srt", "");
  const url = URL.createObjectURL(docBlob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${fileName}.docx`;
  link.click();

  // Reset after download
  fileInput.value = "";
  const resultDiv = document.getElementById("result_div");
  resultDiv.innerHTML = "";
  btn_convert.disabled = true;
  btn_download.disabled = true;
  docBlob = null;
}
