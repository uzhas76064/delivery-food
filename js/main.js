
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
      cardsMenu = document.querySelector('.cards-menu');

let login = localStorage.getItem('user');

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

//Пользователь авторизован
const authorized = () => {
  const logOut = () => {
    login = null;

    localStorage.removeItem('user');

    buttonAuth.style.display = '';
    userName.style.display = '';
    buttonOut.style.display = '';

    buttonOut.removeEventListener('click', logOut);

    checkAuth();
  }

  userName.textContent = login;

  buttonAuth.style.display = 'none';
  userName.style.display = 'inline';
  buttonOut.style.display = 'block';

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
								<button class="button button-primary button-add-cart">
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

//Инициализация всех событий и вызовов функций
const init = () => {
  getData('./db/partners.json').then((data) => {
    data.forEach(createCardRestaurant);
    console.log(data);
  });
  
  cartButton.addEventListener("click", toggleModal);
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
