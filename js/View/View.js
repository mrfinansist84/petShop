export default class View {
  constructor(control) {
    this.control = control;
  }

  viewComposeSlider(dataBase, model, dictionary) {
    const targetElem = document.querySelector('.slider');
    let parentDiv = document.createElement('div');
    let dataLength = dataBase.length < 4 ? dataBase.length : 4;
    targetElem !== null ? targetElem.innerHTML = '' : 0;
    parentDiv.classList.add('wrapp');
    parentDiv.innerHTML += `
    <button class="btn-slider btn-slider--prev">
    prev
    </button>`
    for (let i = 0; i < dataLength; i++) {
      if (dataBase[model.count]) {
        parentDiv.appendChild(this.viewBuildCard(dataBase[model.count + i], dictionary));
      }
    }
    parentDiv.innerHTML += `
    <button class="btn-slider btn-slider--next">
    next
    </button>`
    parentDiv.addEventListener('click', this.control.handlerCartInCard.bind(this.control));
    if (targetElem) {
      targetElem.addEventListener('click', this.control.leafSliders.bind(this.control));
      targetElem.appendChild(parentDiv);
      document.querySelector('.main__start-page') ?
        document.querySelector('.main__start-page').classList.remove('main__start-page') : 0;

      document.querySelector('.cartIcon').classList.remove('hidden');
      document.querySelector('.language').classList.remove('hidden');
    }
  }

  viewBuildCard(goodsUnit, dictionary) {
    const cardDiv = document.createElement('div');
    cardDiv.classList.add('card');
    cardDiv.innerHTML = `

                <div class="card-wrap">           
                <img src=${goodsUnit.url}>
                <div class="card-section">
                <h4 class="card-animal-name">${dictionary[goodsUnit.name]}</h4>
                <p>${goodsUnit.price}$</p>
                <div class="animalInfo">
                ${this.viewChooseSpecialFeatureCard(goodsUnit, dictionary)}
                </div>
                </div>
                </div>
                <div class="cartInCard">
                <div class="btn-addCart" data-id=${goodsUnit.id}>+</div>
                </div>
                </div>
                `;
    return cardDiv;
  }

  viewChooseSpecialFeatureCard(goodsUnit, dictionary) {
    let res = ``;

    for (let key in goodsUnit) {
      let values = ``;

      if (Array.isArray(goodsUnit[key])) {
        goodsUnit[key].forEach((el) => {
          values += `${dictionary[el]} `
        })
      } else {
        values = Number.isNaN(+[goodsUnit[key]]) ?
          dictionary[goodsUnit[key]] :
          goodsUnit[key];
      }

      if (key !== "name" &&
        key !== "id" &&
        key !== "url" &&
        key !== "type" &&
        key !== "price" &&
        key !== "orderAmount") {

        res += `<p>${dictionary[key]} : ${values}</p>`
      }
    }
    return res;
  }

  viewPopupEnough(el, dictionary) {
    const popup = document.createElement('div');
    let phase = dictionary? dictionary.phase: 'Not enough goods in stock';
    popup.classList.add('showPopup');
    popup.innerText = `${phase}`;
    el.appendChild(popup);

    setTimeout(() => el.querySelector('.showPopup').remove(), 1500);
  }

  viewCreateCart(storage) {
    const popup = document.createElement('div');

    let totalCost = 0,
      name,
      history = storage.dictionary.history ? storage.dictionary.history : "Purchase history",
      buy = storage.dictionary.buy ? storage.dictionary.buy : "BUY",
      totalCostText = storage.dictionary.totalCost ? storage.dictionary.totalCost : "Total cost";

    popup.classList.add('InnerCart');

    if (storage.cartOrderAmount.length === 0) {
      popup.innerHTML = `
      <span class="cart__form-abort">X</span>
      <div class="cart__empty">
      <p class="cart__empty-text">NOTHING ORDERED</p>
      <button class="btn-history">
      Purches History
      </button>
      </div>`

    } else {
      storage.cartOrderAmount.forEach((goodsUnit) => {
        name = storage.dictionary[goodsUnit.name] ? storage.dictionary[goodsUnit.name] : goodsUnit.name;
        totalCost += (goodsUnit.price * goodsUnit.orderAmount);

        popup.innerHTML += `
        <div class="cart-item">
      <div>
      <img src=${goodsUnit.url} class="purches-img">
      </div>
      <div>
      <span class="purches-name">${name}</span>

      <div class="purches-price">
      <span class="purches-price-item">${goodsUnit.price}$</span> 
      <div class="order-control-in-cart purches-price-item">
      <button class="btn-remove-from-cart" data-id=${goodsUnit.id}>-</button>
      <span class="order-amount">${goodsUnit.orderAmount}</span>
      <button class="btn-add-from-cart" data-id=${goodsUnit.id}>+</button>
      </div> 
      <span  class="purches-price-item">${goodsUnit.price * goodsUnit.orderAmount}$</span>  
      <button data-id=${goodsUnit.id} class="trashingGoods purches-price-item">del</button></div>
      </div></div>`
      })

      popup.innerHTML += `
      <div class="totalPrice">
      <span>${totalCostText}: ${totalCost}$</span>
      <button class="purchase">${buy}</button>
      <button class="btn-history">
      ${history}
      </button>
      </div>
      <span class="cart__form-abort">X</span>
      `
    }
    popup.querySelector('.purchase') !== null ?
      popup.querySelector('.purchase')
      .addEventListener('click', this.control.purchaseGoods.bind(this.control)) : 0;

    document.querySelector('.CartCart').innerHTML = '';

    document.querySelector('.CartCart').appendChild(popup);

    document.querySelector('.goodsIntoCart').innerText = storage.cartOrderAmount.length;

    popup.addEventListener('click', this.control.handlerCart.bind(this.control));

    popup.querySelector('.btn-history').addEventListener('click', () => {
      document.querySelector('.main__history-modal').classList.toggle("main__history-modal--show");
    });

    document.querySelector('.cart__form-abort')
      .addEventListener('click', this.control.modalClose.bind(this.control));
  }

  viewModalPurchase(storage) {
    const modalPurchase = document.createElement('div');
    modalPurchase.classList.add('modalPurchase');
    modalPurchase.innerHTML += `
    <span class="modalPurchase__form-abort">X</span>
    <form action="#" class="modalPurchase__form">
      <label for="name">${storage.dictionary.name}</label>
      <input type="text" placeholder="Input your name" id="name" required="required" class="modalPurchase__form-name">
      <label for="surname">${storage.dictionary.surname}</label>
      <input type="text" placeholder="Input your Surname" id="surname" required="required" class="modalPurchase__form-surname">
      <label for="email">${storage.dictionary.email}</label>
      <input type="email" placeholder="Input your email" id="email" required="required" class="modalPurchase__form-email">
      <label for="tel">${storage.dictionary.telephone}</label>
      <input type="tel" placeholder="Input tel number" id="tel" class="modalPurchase__form-tel">
      <input type="submit" value="${storage.dictionary.confirm}" class="confirm-order">
      </form>`
    document.querySelector('.main__wrapper').appendChild(modalPurchase);
    document.querySelector('.confirm-order')
      .addEventListener('click', this.control.confirmOrder.bind(this.control));
    document.querySelector('.modalPurchase__form-abort')
      .addEventListener('click', this.control.modalClose.bind(this.control));
  }

  viewModalClose() {
    document.querySelector('.main__history-modal') ?
      document.querySelector('.main__history-modal').classList.remove('main__history-modal--show') : 0;

    document.querySelector('.modalPurchase') ? document.querySelector('.modalPurchase').remove() : 0;
    document.querySelector('.CartCart').classList.toggle("showCart");
    document.querySelector('.modalPurchaseBack').classList.remove('modalPurchaseBack-show');
  }
  viewModalShow() {
    document.querySelector('.modalPurchaseBack').classList.add('modalPurchaseBack-show');
  }
  setUserDataForModal() {
    const clientData = JSON.parse(localStorage.getItem("clientData"));

    if (clientData) {
      document.querySelector('.modalPurchase__form-name').value = clientData[clientData.length - 1].name;
      document.querySelector('.modalPurchase__form-surname').value = clientData[clientData.length - 1].surname;
      document.querySelector('.modalPurchase__form-email').value = clientData[clientData.length - 1].email;
      document.querySelector('.modalPurchase__form-tel').value = clientData[clientData.length - 1].tel;
    }
  }
  getUserDataFromModal() {
    const clientData = {
      name: document.querySelector('.modalPurchase__form-name').value,
      surname: document.querySelector('.modalPurchase__form-surname').value,
      email: document.querySelector('.modalPurchase__form-email').value,
      tel: document.querySelector('.modalPurchase__form-tel').value,
    };
    return clientData;
  }
  viewPageChoice(storage) {
    const pageChoice = document.createElement('div');

    pageChoice.classList.add('page-choice');
    pageChoice.innerHTML += `
    <aside class="page-choice-aside">
    <div class="categories">
    <input type="radio" name="pets" class="categories-items-input categories-items-input-all" id="radio-all"></input>
    <label class="categories-items categories-items-all" for="radio-all">${storage.dictionary.allanimals}</label>
    
    <input type="radio" name="pets" class="categories-items-input categories-items-input-cats" id="radio-cats"></input>
    <label class="categories-items categories-items-cats" for="radio-cats">${storage.dictionary.cats}</label>
    
    <input type="radio" name="pets" class="categories-items-input categories-items-input-dogs" id="radio-dogs"></input>
    <label class="categories-items categories-items-dogs" for="radio-dogs">${storage.dictionary.dogs}</label>
    
    <input type="radio" name="pets" class="categories-items-input categories-items-input-fishes" id="radio-fishes"></input>
    <label class="categories-items categories-items-fishes" for="radio-fishes">${storage.dictionary.fishes}</label>
    
    <input type="radio" name="pets" class="categories-items-input categories-items-input-birds" id="radio-birds"></input>
    <label class="categories-items categories-items-birds" for="radio-birds">${storage.dictionary.birds}</label>
    </aside>
    
    <div class="main__slider">
    <div class="main__filter">
    <div class="categories__filters">
    <label>${storage.dictionary.breed}
    <input type="text" id="searchBar" class="filters-searchBar">
    </label>
    </div>
    </div>
    <div class='slider'></div>
    </div>
    `
    pageChoice.querySelector('.categories')
      .addEventListener('click', this.control.chooseCategory.bind(this.control));

    pageChoice.querySelector('.filters-searchBar')
      .addEventListener('keyup', this.control.filterSearchBar.bind(this.control));

    document.querySelector('.main__wrapper').innerHTML = '';

    document.querySelector('.main__wrapper').appendChild(pageChoice);
  }

  viewFilterAll(storage) {
    const filters = document.createElement('div');
    filters.classList.add('categories__filters');
    filters.innerHTML += `
    <label>${storage.dictionary.breed}
    <input type="text" id="searchBar" class="filters-searchBar">
    </label>
    `
    filters.querySelector('.filters-searchBar')
      .addEventListener('keyup', this.control.filterSearchBar.bind(this.control));
    document.querySelector('.main__filter').innerHTML = "";
    document.querySelector('.main__filter').appendChild(filters);
  }

  viewFilterCat(storage) {
    const filters = document.createElement('div');
    filters.classList.add('categories__filters');
    filters.innerHTML += `
    <label>${storage.dictionary.breed}
    <input type="text" id="searchBar" class="filters-searchBar">
    </label>
    <div class="filters-checkbox">
    <label for="shortLegged">${storage.dictionary.shortLegged}</label>
    <input type="checkbox" id="shortLegged" class="checkboxItem">
    <label for="pedigree">${storage.dictionary.pedigree}</label>
    <input type="checkbox" id="pedigree" class="checkboxItem">
    <label for="trimming">${storage.dictionary.trimming}</label>
    <input type="checkbox" id="trimming" class="checkboxItem">
    <label for="lopiness">${storage.dictionary.lopiness}</label>
    <input type="checkbox" id="lopiness" class="checkboxItem">
    </div>
    `
    filters.querySelector('.filters-checkbox')
      .addEventListener('click', this.control.filtersCheckbox.bind(this.control));

    filters.querySelector('.filters-searchBar')
      .addEventListener('keyup', this.control.filterSearchBar.bind(this.control));
    document.querySelector('.main__filter').innerHTML = "";
    document.querySelector('.main__filter').appendChild(filters);
  }

  viewFilterDog(storage) {
    const filters = document.createElement('div');
    filters.classList.add('categories__filters');
    filters.innerHTML += `
    <label>${storage.dictionary.breed}
    <input type="text" id="searchBar" class="filters-searchBar">
    </label>
    <div class="filters-checkbox">
    <div>
    <label for="shortLegged">${storage.dictionary.shortLegged}</label>
    <input type="checkbox" id="shortLegged" class="checkboxItem">
    <label for="pedigree">${storage.dictionary.pedigree}</label>
    <input type="checkbox" id="pedigree" class="checkboxItem">
    <label for="trimming">${storage.dictionary.trimming}</label>
    <input type="checkbox" id="trimming" class="checkboxItem">
   </div>
   <div>
   <span class="extraFeature"> ${storage.dictionary.specialization}: </span>
    <label for="domastic">${storage.dictionary.domastic}</label>
    <input type="checkbox" id="domastic" class="checkboxItem">
    <label for="decorate">${storage.dictionary.decorate}</label>
    <input type="checkbox" id="decorate" class="checkboxItem">
    <label for="guard">${storage.dictionary.guard}</label>
    <input type="checkbox" id="guard" class="checkboxItem">
    <label for="hunting">${storage.dictionary.hunting}</label>
    <input type="checkbox" id="hunting" class="checkboxItem">
    </div>
    </div>
    `
    filters.querySelector('.filters-checkbox')
      .addEventListener('click', this.control.filtersCheckbox.bind(this.control));

    filters.querySelector('.filters-searchBar')
      .addEventListener('keyup', this.control.filterSearchBar.bind(this.control));

    document.querySelector('.main__filter').innerHTML = "";

    document.querySelector('.main__filter').appendChild(filters);
  }

  viewFilterFish(storage) {
    const filters = document.createElement('div');
    filters.classList.add('categories__filters');
    filters.innerHTML += `

    <label>${storage.dictionary.breed}
    <input type="text" id="searchBar" class="filters-searchBar">
    </label>
    <div class="filters-checkbox">
    <div>
    <label for="freshwater">${storage.dictionary.freshwater}</label>
    <input type="checkbox" id="freshwater" class="checkboxItem">
    </div>
    <div>
    <span class="extraFeature">${storage.dictionary.zonality}: </span>
    <label for="up">${storage.dictionary.up}</label>
    <input type="checkbox" id="up" class="checkboxItem">
    <label for="down">${storage.dictionary.down}</label>
    <input type="checkbox" id="down" class="checkboxItem">
    <label for="mid">${storage.dictionary.mid}</label>
    <input type="checkbox" id="mid" class="checkboxItem">
    </div>
    <div>
    <span class="extraFeature">${storage.dictionary.color}: </span>
    <label for="yellow">${storage.dictionary.yellow}</label>
    <input type="checkbox" id="yellow" class="checkboxItem">
    <label for="grey">${storage.dictionary.grey}</label>
    <input type="checkbox" id="grey" class="checkboxItem">
    <label for="blue">${storage.dictionary.blue}</label>
    <input type="checkbox" id="blue" class="checkboxItem">
    <label for="red">${storage.dictionary.red}</label>
    <input type="checkbox" id="red" class="checkboxItem">
    </div>
    </div>
    `

    filters.querySelector('.filters-checkbox')
      .addEventListener('click', this.control.filtersCheckbox.bind(this.control));

    filters.querySelector('.filters-searchBar')
      .addEventListener('keyup', this.control.filterSearchBar.bind(this.control));

    document.querySelector('.main__filter').innerHTML = "";

    document.querySelector('.main__filter').appendChild(filters);
  }


  viewFilterBird(storage) {
    const filters = document.createElement('div');
    filters.classList.add('categories__filters');
    filters.innerHTML += `
    <label>${storage.dictionary.breed}
    <input type="text" id="searchBar" class="filters-searchBar">
    </label>
    <div class="filters-checkbox">
    <div>
    <label for="flying">${storage.dictionary.flying}</label>
    <input type="checkbox" id="flying" class="checkboxItem">
    <label for="talking">${storage.dictionary.talking}</label>
    <input type="checkbox" id="talking" class="checkboxItem">
    <label for="singing">${storage.dictionary.singing}</label>
    <input type="checkbox" id="singing" class="checkboxItem">
    </div>
    <div>
    <span class="extraFeature">${storage.dictionary.color}: </span>
    <label for="yellow">${storage.dictionary.yellow}</label>
    <input type="checkbox" id="yellow" class="checkboxItem">
    <label for="grey">${storage.dictionary.grey}</label>
    <input type="checkbox" id="grey" class="checkboxItem">
    <label for="blue">${storage.dictionary.blue}</label>
    <input type="checkbox" id="blue" class="checkboxItem">
    <label for="red">${storage.dictionary.red}</label>
    <input type="checkbox" id="red" class="checkboxItem">
    <label for="white">${storage.dictionary.white}</label>
    <input type="checkbox" id="white" class="checkboxItem">
    </div>
    </div> `
    filters.querySelector('.filters-checkbox')
      .addEventListener('click', this.control.filtersCheckbox.bind(this.control));

    filters.querySelector('.filters-searchBar')
      .addEventListener('keyup', this.control.filterSearchBar.bind(this.control));

    document.querySelector('.main__filter').innerHTML = "";

    document.querySelector('.main__filter').appendChild(filters);
  }

  viewHeaderSection(storage) {
    const header = document.createElement('header');
    header.classList.add('header');
    header.innerHTML += `
    <div class="modalPurchaseBack"></div>
    <div class="header__wrapper">
    <a href='javascript:void(0);'>
    <img src='assets/img/generic/logo.png'>
    </a>
    <div class="container-for-cartLang">
    
    <div class="cartIcon hidden">
    <span><i class="goodsIntoCart"></i> item(s)</span>
    </div>
    <div class="language hidden">
    <button class="btn-lang-au">
      UA
    </button>
    <button class="btn-lang-ru">
      RU
    </button>
    <button class="btn-lang-en">
      EN
    </button>
    </div>
    <button class="main__start-page-block-enterBtn">enter</button>
  </div>
    </div>
    <div class="CartCart"></div>
    `
    document.querySelector('.root').appendChild(header);

    document.querySelector('.language').addEventListener('click', this.control.switchLang.bind(this.control));

    document.querySelector('.goodsIntoCart').innerText = storage.cartOrderAmount.length;

    document.querySelector('.cartIcon').addEventListener('click', this.control.toggleCart.bind(this.control));

    document.querySelector('.header')
      .addEventListener('click', this.control.handlerEnter.bind(this.control));

    document.querySelector('.main__start-page-block-enterBtn')
      .addEventListener('click', (e) => e.target.classList.add("hidden"));
  }

  showHidddenCart() {
    document.querySelector('.modalPurchaseBack').classList.toggle('modalPurchaseBack-show');
    document.querySelector('.CartCart').classList.toggle("showCart");
  }

  viewMainSection() {
    const main = document.createElement('main');
    main.classList.add('main');
    main.classList.add('main__start-page');
    main.innerHTML += `
    <div class="main__wrapper">
    </div>
    `
    document.querySelector('.root').appendChild(main);

  }

  viewFooterSection() {
    const footer = document.createElement('footer');
    footer.classList.add('footer');
    footer.innerHTML += `
    <div class="footer__wrapper">
        <div class="footer__item footer__item--tel">
        <p>098-999-99999</p>
        </div>
        <div class="footer__item footer__item--adress">
        <p>Dnipro city</p>
        </div>
        <div class="footer__item footer__item--email">
        <p>dnipro@codiv.com.ua</p>
        </div>
    </div>
    `

    document.querySelector('.root').appendChild(footer);
  }

  viewStartPageSection() {
    const startPage = document.createElement('div');

    startPage.classList.add('main__start-page');
    document.querySelector('.main__wrapper').appendChild(startPage);
  }

  viewModalHistory(storage = {}) {
    const history = document.createElement('div'),
      purchaseHistory = JSON.parse(localStorage.getItem("clientData"));
    let historyEmpty = storage.dictionary ? storage.dictionary.historyEmpty : "There were no purchases yet",
    date = storage.dictionary ? storage.dictionary.date : "Date",
    name = storage.dictionary ? storage.dictionary.name : "Name",
    surnameHistory = storage.dictionary ? storage.dictionary.surnameHistory : "Surname",
    order = storage.dictionary ? storage.dictionary.order : "Order";

    document.querySelector('.main__history-modal') ?
      document.querySelector('.main__history-modal').remove() : 0;

    history.classList.add('main__history-modal');

    if (purchaseHistory) {
      history.innerHTML += `
        <div class="main__history-modal-item-header">
        <span class="main__history-modal-item-text">${date}</span> 
        <span class="main__history-modal-item-text">${name}</span> 
        <span class="main__history-modal-item-text">${surnameHistory}</span>
        <span>${order}</span>
        <span class="history__form-abort">X</span>
        </div>
        `
      purchaseHistory.forEach((purchase, i) => {
        let order = ``;

        purchase.order.forEach((el) => order += `
       <div class="main__history-modal-order">
       <span>${el.type}</span> 
       <span>${el.name}</span> 
       <span>${el.orderAmount}</span>
       </div>`);

        history.innerHTML += `
    <div class="main__history-modal-item">
    <span class="main__history-modal-item-text">${new Date().toLocaleDateString()}</span> 
    <span class="main__history-modal-item-text">${purchase.name}</span> 
    <span class="main__history-modal-item-text">${purchase.surname}</span>
    <div class="history__order">
    ${order}
    </div>
    </div>
        `
      })
    } else {
      history.innerHTML += `
      <span class="history__form-abort">X</span>
      <div class="history__empty-text">
      ${historyEmpty}
      </div>
      `
    }
    document.querySelector('.header').appendChild(history);

    document.querySelector('.history__form-abort')
      .addEventListener('click', this.control.modalClose.bind(this.control));
  }

  disableBtnSlider(e) {
    if (e.target.value !== '') {
      document.querySelector('.btn-slider--next').classList.add("hidden");
      document.querySelector('.btn-slider--prev').classList.add("hidden");
    }
    if (e.target.className === 'checkboxItem') {
      document.querySelector('.btn-slider--next').classList.add("hidden");
      document.querySelector('.btn-slider--prev').classList.add("hidden");
    }
  }
}