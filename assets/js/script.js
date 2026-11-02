// NEXORA HOME PAGE — show only four featured products
fetch('./assets/js/data.json')
  .then(response => {
    if (!response.ok) throw new Error('Could not load product data');
    return response.json();
  })
  .then(data => showCards(data.slice(0, 4)))
  .catch(error => {
    console.log(error);
    document.getElementById('products-container').innerHTML =
      '<p class="empty-message">Featured products could not be loaded.</p>';
  });

function showCards(data) {
  let html = '';
  data.forEach(function (item) {
    html += `
      <article class="main-cards">
        <div class="card">
          <div class="card-img">
            <img src="${item.image}" alt="${item.name}" loading="lazy">
          </div>
          <div class="card-content">
            <p>${item.category}</p>
            <h3>${item.name}</h3>
            <p>${item.description}</p>
            <strong class="product-price">${item.price || ''}</strong>
          </div>
        </div>
      </article>`;
  });
  document.getElementById('products-container').innerHTML = html;
}