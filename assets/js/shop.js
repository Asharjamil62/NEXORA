// NEXORA SHOP
let allProducts = [];
let selectedCategories = [];

fetch('./assets/js/data.json')
  .then(response => {
    if (!response.ok) throw new Error('Could not load product data');
    return response.json();
  })
  .then(data => {
    allProducts = data;
    const params = new URLSearchParams(window.location.search);
    const category = params.get('category');
    if (category) {
      selectedCategories = [category];
      document.querySelectorAll('.filter-btn').forEach(function (btn) {
        btn.checked = btn.value === category;
      });
    }
    showCards(getFilteredProducts());
  })
  .catch(error => {
    console.log(error);
    document.getElementById('products-container').innerHTML =
      '<p class="empty-message">Products could not be loaded. Please refresh the page.</p>';
  });

function getFilteredProducts() {
  if (selectedCategories.length === 0) return allProducts;
  return allProducts.filter(function (item) {
    return selectedCategories.includes(item.category);
  });
}

function showCards(data) {
  let html = '';
  if (data.length === 0) {
    html = '<p class="empty-message">No products found in this category.</p>';
  } else {
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
          <button class="detail-btn" data-product="${item.name}">VIEW DETAILS</button>
        </article>`;
    });
  }
  document.getElementById('products-container').innerHTML = html;
}

document.querySelectorAll('.filter-btn').forEach(function (btn) {
  btn.addEventListener('change', function () {
    if (btn.checked) selectedCategories.push(btn.value);
    else selectedCategories = selectedCategories.filter(function (category) { return category !== btn.value; });
    showCards(getFilteredProducts());
  });
});

document.getElementById('products-container').addEventListener('click', function (event) {
  const button = event.target.closest('.detail-btn');
  if (!button) return;
  const product = allProducts.find(function (item) { return item.name === button.dataset.product; });
  if (!product) return;
  let details = '';
  Object.keys(product).forEach(function (key) {
    if (['name', 'image', 'category', 'description', 'price'].includes(key)) return;
    details += `<p><strong>${key.replace(/([A-Z])/g, ' $1')}:</strong> ${product[key]}</p>`;
  });
  document.getElementById('detail-modal-content').innerHTML = `
    <button class="modal-close" aria-label="Close details">&times;</button>
    <p class="modal-category">${product.category}</p><h2>${product.name}</h2>
    <img src="${product.image}" alt="${product.name}"><p>${product.description}</p>
    <h3>${product.price || ''}</h3>${details}
    <p class="demo-note">Concept product — specifications and prices are illustrative.</p>`;
  document.getElementById('detail-modal').hidden = false;
});

document.getElementById('detail-modal').addEventListener('click', function (event) {
  if (event.target.id === 'detail-modal' || event.target.closest('.modal-close')) this.hidden = true;
});