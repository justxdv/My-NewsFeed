// Get the saved news from local storage and parse it to JSON format
const savedNews = JSON.parse(localStorage.getItem('likedNews')) || [];

// Render the saved news
const renderSavedNews = () => {
  // Get the saved news box container
  const savedNewsBox = document.querySelector('.savedNewsBox');

  // Clear the saved news box container
  savedNewsBox.innerHTML = '';

  // Loop through the saved news array and create a news card for each saved news
  savedNews.forEach((newsItem) => {
    const { category, author, content, readMoreUrl } = newsItem;

    // Create a news card
    const newsCard = `
      <div class='newsCard'>
        <div class='headings'>
          <h5>BY ${author.toUpperCase()}</h5>
          <h5>CATEGORY ${(category).toUpperCase()}</h5>
        </div>
        <div class='content'>
          <p>${content}
          <span><a target="_blank" href=${readMoreUrl}>READ MORE.</a></span>
          </p>
          
        </div>
        <i class="fa-solid fa-heart likeBtn" style="color: #ff0000; font-size: 30px; margin-left:5px; margin-bottom:5px;"></i>
      </div>
    `;

    // Append the news card to the saved news box container
    savedNewsBox.innerHTML += newsCard;
  });

  // Add event listeners to the unlike buttons
  const unlikeBtns = document.querySelectorAll('.likeBtn');
  unlikeBtns.forEach((unlikeBtn) => {
    unlikeBtn.addEventListener('click', (event) => {
      const newsCard = event.target.parentNode;
      const content = newsCard.querySelector('div:nth-of-type(2) p').textContent;

      // Find the news item in the savedNews array that matches the content of the news item being unliked
      const index = savedNews.findIndex((newsItem) => newsItem.content === content);

      // Remove the news item from the savedNews array
      savedNews.splice(index, 1);

      // Update the localStorage with the updated savedNews array
      localStorage.setItem('likedNews', JSON.stringify(savedNews));

      // Remove the news card from the DOM
      newsCard.remove();
    });
  });
};

// Call the renderSavedNews function when the saved news page is loaded
window.addEventListener('load', renderSavedNews);
