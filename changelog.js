// JavaScript for modal
// Get the paragraph element
var versionParagraph = document.getElementById("version");

// Get the modal
var modal = document.getElementById("modal");

// When the user clicks on the paragraph, open the modal
versionParagraph.onclick = function() {
  modal.style.display = "block";
}

// When the user clicks anywhere outside of the modal, close it
function closeModalHandler(event) {
  if (event.target == modal || event.target == document.getElementById('closeModal')) {
    modal.style.display = "none";
  }
}

// Assign the function to window.onclick
window.onclick = closeModalHandler;

// Run the same function when clicking the element with id "closeModal"
document.getElementById('closeModal').onclick = closeModalHandler;
