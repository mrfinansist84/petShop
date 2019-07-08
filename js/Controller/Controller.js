import View from '../View/View.js';
import Model from '../Model/Model.js';

export default class Controller {
  constructor() {
    this.lang = "En";
    this.view = new View(this);
    this.model = new Model(this);
  }

  init() {
    this.model.getDataFromServer();
  }

  controllermakeStartPage() {
    this.view.viewHeaderSection(this.model);
    this.view.viewMainSection();
    this.view.viewFooterSection();
    this.view.viewStartPageSection();
    this.view.viewCreateCart(this.model);
    this.view.viewModalHistory();
  }

  handlerEnter(e) {
    if (e.target.classList.value.includes('enterBtn')) {
      this.model.getDictionaryFromServer(this.lang);
    }
  }

  controllerMakeSliderPage() {
    this.model.getDataBaseWithoutFilters();
    this.view.viewPageChoice(this.model);
    this.view.viewCreateCart(this.model);
    this.view.viewModalHistory(this.model);
    this.view.viewComposeSlider(this.model.filteredBase, this.model, this.model.dictionary);
  }

  leafSliders(e) {
    switch (e.target.innerText) {
      case 'next': {
        this.model.changeDataBaseForLeafSliderNext()
        this.view.viewComposeSlider(this.model.filteredBase, this.model, this.model.dictionary);
        break;
      };
    case 'prev': {
      this.model.changeDataBaseForLeafSliderPrev()
      this.view.viewComposeSlider(this.model.filteredBase, this.model, this.model.dictionary);
      break;
    };
    }
  }

  switchLang(e) {
    const lang = e.target.innerText,
      supportedLang = [{
          lang: 'Ru',
          name: 'RU'
        },
        {
          lang: 'En',
          name: 'EN'
        },
        {
          lang: 'Ua',
          name: 'UA'
        }
      ];
    supportedLang.forEach((el) => {
      el.name === lang ?
        this.model.getDictionaryFromServer(el.lang) : 0;
    })
  }

  addPopUpEmotyStop(el, dictionary) {
    this.view.viewPopupEnough(el, dictionary)
  }
  handlerCart(e) {
    if (e.target.innerText == '-') {
      this.model.delOnePointOfUnitFromCart(e);
    }

    if (e.target.innerText == '+') {
      this.model.cartOrderAmount.find((el) => el.id == e.target.dataset.id) ?
        this.model.updateUnitInCart(e) :
        this.model.addUnitInCart(e);

    }
    if (e.target.innerText == 'del') {
      this.model.delUnitFromCart(e);
    }
    this.model.setToLocalStorage("cartOrderAmount", this.model.cartOrderAmount);
    this.model.setToLocalStorage("dataBase", this.model.dataBase);
    this.view.viewCreateCart(this.model);
  }

  toggleCart(){
  this.view.showHidddenCart();
}

  handlerCartInCard(e) {
    if (e.target.innerText == '+') {
      this.model.cartOrderAmount.find((el) => el.id == e.target.dataset.id) ?
        this.model.updateUnitInCart(e) :
        this.model.addUnitInCart(e);
    }
    this.model.setToLocalStorage("cartOrderAmount", this.model.cartOrderAmount);
    this.model.setToLocalStorage("dataBase", this.model.dataBase);
    this.view.viewCreateCart(this.model);
  }


  purchaseGoods() {
    this.view.viewModalPurchase(this.model);
    this.view.viewModalShow();
    this.view.setUserDataForModal()
  }

  confirmOrder(e) {
    e.preventDefault();
    this.model.setToLocalStorage("clientData", this.model.addToPurchaseHistory(this.view.getUserDataFromModal()));
    this.model.updateQuantityGoodsInShop();
    this.model.cleaningCart();
    this.model.setToLocalStorage("cartOrderAmount", this.model.cartOrderAmount);
    this.model.setToLocalStorage("dataBase", this.model.dataBase);
    this.view.viewCreateCart(this.model);
    this.view.viewComposeSlider(this.model.filteredBase, this.model, this.model.dictionary);
    this.view.viewModalHistory(this.model);
    this.view.viewModalClose();
  }

  chooseCategory(e) {
    switch (true) {
      case (e.target.classList.value.includes('all')): {
        this.model.getDataBaseWithoutFilters();
        this.model.setToZeroCount();
        this.view.viewFilterAll(this.model);
        this.view.viewComposeSlider(this.model.filteredBase, this.model, this.model.dictionary);
        break;
      }
      case (e.target.classList.value.includes('cats')): {
        this.chooseCategoryWorker('cat');
        this.view.viewFilterCat(this.model);
        break;
      }
      case (e.target.classList.value.includes('dogs')): {
        this.chooseCategoryWorker('dog');
        this.view.viewFilterDog(this.model);
        break;
      }
      case (e.target.classList.value.includes('fishes')): {
        this.chooseCategoryWorker('fish');
        this.view.viewFilterFish(this.model);
        break;
      }
      case (e.target.classList.value.includes('birds')): {
        this.chooseCategoryWorker('bird');
        this.view.viewFilterBird(this.model);
        break;
      }
    }
  }

  chooseCategoryWorker(type) {
    this.model.setFiltersOnDataBaseByType(type);
    this.model.setToZeroCount();
    this.view.viewComposeSlider(this.model.filteredBase, this.model, this.model.dictionary);
  }

  filtersCheckbox(e) {
    this.model.collectFiltresParams(e)
    this.model.setSubfilteredBaseByFeatures()
    this.model.setToZeroCount();
    this.view.viewComposeSlider(this.model.subfilteredBase, this.model, this.model.dictionary);
    this.view.disableBtnSlider(e);
  }

  filterSearchBar(e) {
    this.model.setSubfilteredBaseByName(e);
    this.model.setToZeroCount();
    this.view.viewComposeSlider(this.model.subfilteredBase, this.model, this.model.dictionary);
    this.view.disableBtnSlider(e);
  }

  modalClose() {
    this.view.viewModalClose();
  }
}