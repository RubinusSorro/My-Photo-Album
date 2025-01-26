document.getElementById('upload-btn').addEventListener('click', () => {
  const dropdown = document.getElementById('dropdown-menu');
  // Toggle dropdown visibility and manage click event
  const isDropdownVisible = dropdown.style.display === 'block';
  dropdown.style.display = isDropdownVisible ? 'none' : 'block';
});

// Close dropdown if user clicks outside of it
window.addEventListener('click', (event) => {
  const dropdown = document.getElementById('dropdown-menu');
  const uploadBtn = document.getElementById('upload-btn');
  if (!uploadBtn.contains(event.target) && !dropdown.contains(event.target)) {
    dropdown.style.display = 'none';
  }
});

function uploadImage(category) {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/jpeg, image/png';
  input.onchange = function () {
    const file = input.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const imageUrl = e.target.result;
        const images = JSON.parse(localStorage.getItem('images') || '[]');
        images.push({ url: imageUrl, category });
        localStorage.setItem('images', JSON.stringify(images));
        displayImages(); // Refresh the displayed images after upload
      };
      reader.readAsDataURL(file); // Read the file as data URL
    }
  };
  input.click();
  document.getElementById('dropdown-menu').style.display = 'none'; // Hide dropdown after selecting category
}

// Update displayImages to match category
function displayImages(filter = '') {
  const gallery = document.getElementById('gallery');
  gallery.innerHTML = ''; // Clear the gallery
  const images = JSON.parse(localStorage.getItem('images') || '[]');

  // Filter images based on category (case insensitive)
  images
    .filter(image => image.category.toLowerCase().includes(filter.toLowerCase()))
    .forEach(image => {
      const imgContainer = document.createElement('div');
      imgContainer.style.position = 'relative'; // For positioning delete button

      const img = document.createElement('img');
      img.src = image.url;
      img.alt = image.category;

      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Delete';
      deleteButton.classList.add('delete-button'); // Optional: add CSS class for styling
      // Delete button functionality
      deleteButton.addEventListener('click', () => deleteImage(image.url));

      imgContainer.appendChild(img);
      imgContainer.appendChild(deleteButton);
      gallery.appendChild(imgContainer);
    });
}

// Delete image from localStorage
function deleteImage(imageUrl) {
  const images = JSON.parse(localStorage.getItem('images') || '[]');
  
  // Filter out the image with the specified URL
  const updatedImages = images.filter(image => image.url !== imageUrl);
  
  // Update localStorage with the new array of images
  localStorage.setItem('images', JSON.stringify(updatedImages));

  // Re-render the gallery after deletion
  displayImages();
}

// Add event listeners to secondary buttons
document.querySelectorAll('.secondary-menu button').forEach(button => {
  button.addEventListener('click', () => {
    const category = button.textContent.trim().toLowerCase(); // Ensure consistent formatting
    if (category === 'all photos') {
      displayImages(); // Show all photos
    } else {
      displayImages(category); // Filter by selected category
    }
  });
});

// Initial load of images
displayImages();
