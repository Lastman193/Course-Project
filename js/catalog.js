document.addEventListener('DOMContentLoaded', function() {

  const orderFormPopup = document.getElementById('order-form-popup');
  const orderForm = document.getElementById('order-form');
  const orderSuccessDiv = document.getElementById('order-success');
  const orderNumberSpan = document.getElementById('order-number');
  const orderFormCloseButton = document.querySelector('.order-form-close');
  const sortBySelect = document.getElementById('sort-by');

  // Элементы каталога
  const catalogGrid = document.querySelector('.catalog-page .catalog-grid');
  const categoryLinks = document.querySelectorAll('.left-menu ul li a');
  const catalogTitle = document.querySelector('.catalog-page h1');
  const paginationContainer = document.createElement('div');
  paginationContainer.classList.add('pagination');
  if (catalogGrid && catalogGrid.parentNode) {
    catalogGrid.parentNode.insertBefore(paginationContainer, catalogGrid.nextSibling);
  }

  let allItems = [];
  const itemsPerPage = 15;
  let currentPage = 1;
  let currentCategory = 'televisors'; // По умолчанию

  const getPrice = (item) => {
    const priceText = item.querySelector('price').textContent.trim();
    const numericPrice = priceText.replace(/[^\d.]/g, '');
    return parseFloat(numericPrice);
  };

  function displayItems(items, page, sortBy = 'default') {
    if (!catalogGrid) return;
    const itemsToSort = [...items];

    switch (sortBy) {
      case 'price-asc':
        itemsToSort.sort((a, b) => getPrice(a) - getPrice(b));
        break;
      case 'price-desc':
        itemsToSort.sort((a, b) => getPrice(b) - getPrice(a));
        break;
      case 'default':
        break;
    }

    catalogGrid.innerHTML = '';
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const itemsToDisplay = itemsToSort.slice(startIndex, endIndex);

    itemsToDisplay.forEach(item => {
      const imageSrc = item.querySelector('image').textContent;
      const altText = item.querySelector('alt').textContent;
      const titleText = item.querySelector('title').textContent;
      const priceText = item.querySelector('price').textContent;
      const id = item.querySelector('id')?.textContent || titleText.replace(/\s+/g, '-').toLowerCase();

      const productCard = document.createElement('div');
      productCard.classList.add('product-card');
      productCard.innerHTML = `
        <img src="${imageSrc}" alt="${altText}">
        <h3>${titleText}</h3>
        <p class="price">${priceText}</p>
        <button class="buy-button" data-product-id="${id}" data-product-name="${titleText}">Купить</button>
      `;
      catalogGrid.appendChild(productCard);
    });
    attachBuyButtonListeners();
  }

  function renderPagination(totalItems) {
    if (!paginationContainer) return;
    paginationContainer.innerHTML = '';
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    for (let i = 1; i <= totalPages; i++) {
      const pageButton = document.createElement('button');
      pageButton.textContent = i;
      if (i === currentPage) {
        pageButton.classList.add('active');
      }
      pageButton.addEventListener('click', function() {
        currentPage = i;
        displayItems(allItems, currentPage, sortBySelect ? sortBySelect.value : 'default');
        renderPagination(allItems.length);
      });
      paginationContainer.appendChild(pageButton);
    }
  }

  function loadCatalog(xmlFile, categoryTitle) {
    if (!catalogTitle) return;
    currentCategory = xmlFile.replace('.xml', '');
    catalogTitle.textContent = categoryTitle;
    fetch('xml/' + xmlFile)
      .then(response => response.text())
      .then(xmlString => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlString, 'application/xml');
        allItems = Array.from(xmlDoc.querySelectorAll('item'));
        currentPage = 1;
        displayItems(allItems, currentPage, sortBySelect ? sortBySelect.value : 'default');
        renderPagination(allItems.length);
      })
      .catch(error => {
        console.error('Ошибка загрузки XML:', error);
        if (catalogGrid) catalogGrid.innerHTML = '<p>Ошибка загрузки каталога.</p>';
        if (paginationContainer) paginationContainer.innerHTML = '';
      });
  }

  function attachBuyButtonListeners() {
    const buyButtons = document.querySelectorAll('.buy-button');
    buyButtons.forEach(button => {
      button.addEventListener('click', openOrderForm);
    });
    console.log(`Найдено и обработано ${buyButtons.length} кнопок "Купить".`);
  }

  function openOrderForm(event) {
    if (!orderFormPopup) {
      console.error('Элемент формы заказа (#order-form-popup) не найден.');
      return;
    }

    const productId = event.target.dataset.productId;
    const productName = event.target.dataset.productName;
    console.log(`Открываю форму заказа для товара: ${productName} (ID: ${productId})`);
    orderFormPopup.style.display = 'flex';
    if (orderSuccessDiv) {
      orderSuccessDiv.style.display = 'none';
    }
    if (orderForm) {
      orderForm.reset();
    }
  }

  function closeOrderForm() {
    if (orderFormPopup) {
      orderFormPopup.style.display = 'none';
    }
  }

  function submitOrderForm(event) {
    event.preventDefault();

    if (!orderForm) {
      console.error('Элемент формы (#order-form) не найден.');
      return;
    }

    const formData = new FormData(orderForm);
    const orderDetails = {};
    formData.forEach((value, key) => {
      orderDetails[key] = value;
    });

    orderDetails.type = 'order';

    console.log('Данные заказа для отправки:', orderDetails);

    fetch('http://localhost:3000/submit-application', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderDetails),
    })
    .then(response => {
      if (!response.ok) {
        if (response.status === 409) {
          return response.json().then(errorData => {
            throw new Error(errorData.error || 'Заявка с такими данными уже была отправлена.');
          });
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log('Ответ от сервера:', data);
      if (orderNumberSpan) {
        orderNumberSpan.textContent = data.id;
      }
      if (orderFormPopup) {
        orderFormPopup.style.display = 'none';
      }
      if (orderSuccessDiv) {
        orderSuccessDiv.style.display = 'block';
      }
      orderForm.reset();
      setTimeout(() => {
        if (orderSuccessDiv) {
          orderSuccessDiv.style.display = 'none';
        }
      }, 3000);
    })
    .catch(error => {
      console.error('Ошибка при отправке заказа:', error);
      alert(error.message);
    });
  }

  // Обработчики событий для формы заказа
  if (orderFormCloseButton) {
    orderFormCloseButton.addEventListener('click', closeOrderForm);
  }

  window.addEventListener('click', function(event) {
    if (event.target === orderFormPopup) {
      closeOrderForm();
    }
  });

  if (orderForm) {
    orderForm.addEventListener('submit', submitOrderForm);
  }

  // Обработчик событий для сортировки
  if (sortBySelect) {
    sortBySelect.addEventListener('change', function() {
      const selectedSort = this.value;
      currentPage = 1;
      displayItems(allItems, currentPage, selectedSort);
      renderPagination(allItems.length);
    });
  }

  // Загрузка каталога по умолчанию
  loadCatalog('televisors.xml', 'Телевизоры');

  categoryLinks.forEach((link, index) => {
    let category = '';
    switch (index) {
      case 0: category = 'televisors'; break;
      case 1: category = 'fridges'; break;
      case 2: category = 'stirka'; break;
      case 3: category = 'pilesos'; break;
      case 4: category = 'microwave'; break;
      case 5: category = 'dishwasher'; break;
      case 6: category = 'duhovki'; break;
      case 7: category = 'plates'; break;
      case 8: category = 'dishes'; break;
      case 9: category = 'gadjets'; break;
      default: category = 'televisors'; break;
    }

    link.addEventListener('click', function(event) {
      event.preventDefault();
      let xmlFile = '';
      let title = '';

      switch (category) {
        case 'pilesos': xmlFile = 'pilesos.xml'; title = 'Пылесосы'; break;
        case 'televisors': xmlFile = 'televisors.xml'; title = 'Телевизоры'; break;
        case 'fridges': xmlFile = 'fridges.xml'; title = 'Холодильники'; break;
        case 'stirka': xmlFile = 'stirka.xml'; title = 'Стиральные машины'; break;
        case 'microwave': xmlFile = 'microwaves.xml'; title = 'Микроволновки'; break;
        case 'dishwasher': xmlFile = 'dishwashers.xml'; title = 'Посудомойки'; break;
        case 'duhovki': xmlFile = 'duhovki.xml'; title = 'Духовки'; break;
        case 'plates': xmlFile = 'plates.xml'; title = 'Кухонные плиты'; break;
        case 'dishes': xmlFile = 'dishes.xml'; title = 'Кухонная утварь'; break;
        case 'gadjets': xmlFile = 'gadjets.xml'; title = 'Гаджеты'; break;
        default: xmlFile = 'televisors.xml'; title = 'Телевизоры'; break;
      }
      loadCatalog(xmlFile, title);
    });
  });
});