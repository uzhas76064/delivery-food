
const cartButton = document.querySelector("#cart-button");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");

const buttonAuth = document.querySelector('.button-auth'),
      modalAuth = document.querySelector('.modal-auth'),
      closeAuth = document.querySelector('.close-auth'),
      logInForm = document.querySelector('#logInForm'),
      logInInput = document.querySelector('#login'),
      userName = document.querySelector('.user-name'),
      buttonOut = document.querySelector('.button-out'),
      cardsRestaurants = document.querySelector('.cards-restaurants')
      containerPromo = document.querySelector('.container-promo'),
      restaurants = document.querySelector('.restaurants'),
      menu = document.querySelector('.menu'),
      logo = document.querySelector('.logo'),
      cardsMenu = document.querySelector('.cards-menu'),
      modalBody = document.querySelector('.modal-body'),
      modalPrice = document.querySelector('.modal-pricetag'),
      buttonClearCart = document.querySelector('.clear-cart');

let login = localStorage.getItem('user');
const cart = [];

//Получение данных
const getData = async function(url) {
  const response = await fetch(url);

  if(!response.ok) {
    throw new Error(`ошибка по адресу ${url}, статус ошибки ${response.status}`)
  }

  return await response.json();
  
}
 
//Открытие модального окна
const toggleModal = () =>  {
  modal.classList.toggle("is-open");
}

//Открытие окна регистрации
const toggleModalAuth = () => {
  modalAuth.classList.toggle('is-open');
}

const addToCart = (event) => {
  const target = event.target;
  const buttonAddToCart = target.closest('.button-add-cart');

  if(buttonAddToCart) {
    const card = target.closest('.card');
    const title = card.querySelector('.card-title-reg').textContent;
    const cost = card.querySelector('.card-price-bold').textContent;
    const id = buttonAddToCart.id;

    const food = cart.find((item) => item.id === id);

    if(food) {
      food.count += 1;
    }
    else {
      cart.push({
        id,
        title,
        cost,
        count: 1
      });
    }

    console.log(cart);

    //TODO: Добавить карточки в localStorage
    
  }
}

//Пользователь авторизован
const authorized = () => {
  const logOut = () => {
    login = null;

    localStorage.removeItem('user');

    buttonAuth.style.display = '';
    userName.style.display = '';
    buttonOut.style.display = '';
    cartButton.style.display = ''

    buttonOut.removeEventListener('click', logOut);

    checkAuth();
  }

  userName.textContent = login;

  buttonAuth.style.display = 'none';
  userName.style.display = 'inline';
  buttonOut.style.display = 'flex';
  cartButton.style.display = 'flex';

  buttonOut.addEventListener('click', logOut);
}

//Пользователь не авторизован
const notAuthorized = () => {
  const logIn = (event) => {
    event.preventDefault();
    login = logInInput.value;

    localStorage.setItem('user', login);
    toggleModalAuth();

    buttonAuth.removeEventListener('click', toggleModalAuth);
    closeAuth.removeEventListener('click', toggleModalAuth);
    logInForm.removeEventListener('submit', logIn);

    logInForm.reset();

    checkAuth();
  }

  buttonAuth.addEventListener('click', toggleModalAuth);
  closeAuth.addEventListener('click', toggleModalAuth);
  logInForm.addEventListener('submit', logIn);
}

//Проверка пользователя на авторизацию
const checkAuth = () => {
  if (login) {
    authorized();
  } 
  else {
    notAuthorized();
    cardsRestaurants.addEventListener('click', toggleModalAuth);
  }
}

//Рендеринг карточек ресторанов
const createCardRestaurant = ({ image, kitchen, name, price, stars, products, time_of_delivery:timeOfDelivery }) => {

  const card = `
  <a class="card card-restaurant" data-products="${products}">
						<img src="${image}" alt="image" class="card-image"/>
						<div class="card-text">
							<div class="card-heading">
								<h3 class="card-title">${name}</h3>
								<span class="card-tag tag">${timeOfDelivery}</span>
							</div>
							<div class="card-info">
								<div class="rating">
									${stars}
								</div>
								<div class="price">От ${price} ₽</div>
								<div class="category">${kitchen}</div>
							</div>
						</div>
					</a>
  `;

  cardsRestaurants.insertAdjacentHTML("beforeend", card );
}

//Рендеринг карточек товаров
const createCardGood = ({ description, id, image, name, price }) => {
  const card = document.createElement('div');
  card.className = 'card';

  card.insertAdjacentHTML('beforeend', `
						<img src="${image}" alt="image" class="card-image"/>
						<div class="card-text">
							<div class="card-heading">
								<h3 class="card-title card-title-reg">${name}</h3>
							</div>
							<div class="card-info">
								<div class="ingredients">${description}
								</div>
							</div>
							<div class="card-buttons">
								<button class="button button-primary button-add-cart" id="${id}">
									<span class="button-card-text">В корзину</span>
									<span class="button-cart-svg"></span>
								</button>
								<strong class="card-price-bold">${price} ₽</strong>
							</div>
						</div>
  `);

  cardsMenu.insertAdjacentElement('beforeend', card);

}

//Открытие карточки
const openGoods = (event) => {
  const target = event.target;
  const restaurant = target.closest('.card-restaurant');

  //TODO: Исправить отображение названий ресторанов

  if(restaurant) {
    containerPromo.classList.add('hide');
    restaurants.classList.add('hide');
    menu.classList.remove('hide');

    getData(`./db/${restaurant.dataset.products}`).then((data) => {
      data.forEach(createCardGood);      
    });

    cardsMenu.textContent = '';
  }

}

const renderCart = () => {
  modalBody.textContent = '';

  cart.forEach(({ id, title, cost, count }) => {
    const itemCart = `
    <div class="food-row">
					<span class="food-name">${title}</span>
					<strong class="food-price">${cost}</strong>
					<div class="food-counter">
						<button class="counter-button counter-minus" data-id="${id}">-</button>
						<span class="counter">${count}</span>
						<button class="counter-button counter-plus" data-id="${id}">+</button>
					</div>
				</div>
    `;

    modalBody.insertAdjacentHTML('afterbegin', itemCart);
  });

  const totalPrice = cart.reduce((result, item) => result + (parseFloat(item.cost) * item.count), 0);

  modalPrice.textContent = totalPrice + 'P';
}

const changeCount = (event) => {
  const target = event.target;

  if(target.classList.contains('counter-button')) {
    const food = cart.find((item) => item.id === target.dataset.id);

    if(target.classList.contains('counter-minus')) {
      food.count--;
      if(food.count === 0) {
        cart.splice(cart.indexOf(food), 1)
      }
    }
  
    if(target.classList.contains('counter-plus')) {
      food.count++;
    }

    renderCart();
  }
}

//Инициализация всех событий и вызовов функций
const init = () => {
  getData('./db/partners.json').then((data) => {
    data.forEach(createCardRestaurant);
    console.log(data);
  });
  
  cardsMenu.addEventListener('click', addToCart);
  cartButton.addEventListener("click", () => {
    renderCart();
    toggleModal();
  });

  buttonClearCart.addEventListener('click', () => {
    cart.length = 0;
    renderCart();
  });

  modalBody.addEventListener('click', changeCount);

  close.addEventListener("click", toggleModal);
  
  cardsRestaurants.addEventListener('click', openGoods);
  
  logo.addEventListener('click', () => {
      containerPromo.classList.remove('hide');
      restaurants.classList.remove('hide');
      menu.classList.add('hide');
  });
  
  checkAuth();
}

init();
