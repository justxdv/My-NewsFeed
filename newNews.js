const newNewsBox = document.querySelector('.newNewsBox');
const everyCategory = document.querySelectorAll('.category-btn');
console.log(everyCategory);

// fetch news based on category
const fetchNewsByCategory = async (category) => {
    const url = `https://inshorts.deta.dev/news?category=${category}`;
    try {
        const spinnerContainer = document.querySelector('.spinner-container');
    spinnerContainer.style.display = 'flex';
      const response = await fetch(url);
      const data = await response.json();
  
      // Get the current liked news array from local storage
      const currentLikedNews = JSON.parse(localStorage.getItem('likedNews')) || [];
  
      // Add a 'liked' property to each news item based on the local storage data
      data.data.forEach((newsItem) => {
        const isLiked = currentLikedNews.some((news) => news.content === newsItem.content);
        newsItem.liked = isLiked;
      });
  
      console.log(data);
      return data;
    } catch (error) {
        console.log(error);
        spinnerContainer.style.display = 'none';
        const errorMessage = document.createElement('p');
        errorMessage.textContent = 'Error loading news. Please try again.';
        const refreshButton = document.createElement('button');
        refreshButton.textContent = 'Refresh';
        refreshButton.addEventListener('click', () => {
          window.location.reload();
        });
        newNewsBox.appendChild(errorMessage);
        newNewsBox.appendChild(refreshButton);
      }
    };
  
  

// Render news based on category
const renderNews = (news) => {
    const spinnerContainer = document.querySelector('.spinner-container');
  
    newNewsBox.innerHTML = '';
  
    // Get the current liked news array from local storage
    const currentLikedNews = JSON.parse(localStorage.getItem('likedNews')) || [];
  
    news.data.forEach((newsItem) => {
      const { author, content, readMoreUrl, liked } = newsItem;
  
      // Check if the current news article has already been liked
      const isLiked = currentLikedNews.some((news) => {
        return news.content === content;
      });
  
      const newsCard = `
        <div class='newsCard'>
          <div class='headings'>
            <h5>BY ${author.toUpperCase()}</h5>
            <h5>CATEGORY ${(news.category).toUpperCase()}</h5>
          </div>
          <div class='content'>
            <p>${content}
            <span><a target="_blank" href=${readMoreUrl}>READ MORE.</a></span>
            </p>
            
          </div>
          <button class="likeBtn ${isLiked ? 'liked' : ''}">${isLiked ? 'UNLIKE' : 'LIKE'}</button>
        </div>
      `;
      newNewsBox.innerHTML += newsCard;
      // Hide the loading spinner
  spinnerContainer.style.display = 'none';
    });

  
    // Add event listeners to the like buttons
    const likeBtns = document.querySelectorAll('.likeBtn');
    likeBtns.forEach((likeBtn) => {
      likeBtn.addEventListener('click', (event) => {
        const newsCard = event.target.parentNode;
        const author = newsCard.querySelector('div:first-child h5:first-child').textContent.slice(3);
        const category = newsCard.querySelector('div:first-child h5:last-child').textContent.slice(9);
        const content = newsCard.querySelector('div:nth-of-type(2) p').textContent;
        console.log(content)
        const readMoreUrl = newsCard.querySelector('div:nth-of-type(2) span a').href;
        
  
        // Get the current liked news array from local storage
        const currentLikedNews = JSON.parse(localStorage.getItem('likedNews')) || [];
  
        // Check if the news article is already liked
        const isLiked = currentLikedNews.some((news) => {
          return news.content === content;
        });
  
        // If the news article is already liked, remove it from the liked news array and update the button text and class
        if (isLiked) {
          // Remove the news article from the current liked news array
          const updatedLikedNews = currentLikedNews.filter((news) => news.content !== content);
  
          // Update the button text and class
          likeBtn.textContent = 'LIKE';
          likeBtn.classList.remove('liked');
  
          // Save the updated liked news array to local storage
          localStorage.setItem('likedNews', JSON.stringify(updatedLikedNews));
        }
        // If the news article is not already liked, add it to the liked news array and update the button text and class
        else {
          // Add the new liked news object to the current liked news array
          const likedNewsObj = { author, category, content, readMoreUrl };
          const updatedLikedNews = [...currentLikedNews, likedNewsObj];
  
          // Update the button text and class
          likeBtn.textContent = 'UNLIKE';
          likeBtn.classList.add('liked');
  
          // Save the updated liked news array to local storage
          localStorage.setItem('likedNews', JSON.stringify(updatedLikedNews));
        }
      });
    });
  };
  

// load news on page load
window.addEventListener('load', async () => {
const allNews = await fetchNewsByCategory('all');
renderNews(allNews);

everyCategory.forEach((tag) => {
tag.addEventListener('click', async (event) => {
event.preventDefault();
const categoryTag = event.target.textContent.toLowerCase();
const newsData = await fetchNewsByCategory(categoryTag);
renderNews(newsData);
});
});
});



