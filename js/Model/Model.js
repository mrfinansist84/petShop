export default class Model {
    constructor(control) {
        this.control = control;
        this.dataBase = [];
        this.filteredBase = [];
        this.subFilteredBase = [];
        this.filterParams = [];
        this.dictionary = {};
        this.count = 0;
        this.cartOrderAmount = (JSON.parse(localStorage.getItem("cartOrderAmount"))) ?
            JSON.parse(localStorage.getItem("cartOrderAmount")) : [];
    }

    setToLocalStorage(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }
    getDataBaseWithoutFilters() {
        this.filteredBase = this.dataBase;
    }
    setFiltersOnDataBaseByType(type) {
        this.filteredBase = this.dataBase
            .filter((el) => el.type == type);
    }
    setSubfilteredBaseByName(e) {
        this.subfilteredBase = this.filteredBase
            .filter((el) => el.name.toLowerCase().includes(e.target.value.toLowerCase()));
    }
    setSubfilteredBaseByFeatures() {
        this.subfilteredBase = this.filteredBase.filter((el) => this.filtersCheckboxWorker(el));
    }
    filtersCheckboxWorker(el) {
        let res = 0;
        this.filterParams.forEach((param) => {
            el[param] ? res++ : 0;
            if (typeof el[param] !== "boolean") {
                Object.values(el).join('').includes(param) ? res++ : 0
            };
        })
        return res === this.filterParams.length;
    }
    collectFiltresParams(e) {
        if (e.target.checked) {
            this.filterParams.push(e.target.id);
        } else {
            this.filterParams = this.filterParams
                .filter((el) => el != e.target.id);
        }
    }
    setToZeroCount() {
        this.count = 0;
    }

    changeDataBaseForLeafSliderNext() {
            this.count < this.filteredBase.length - 4 ? this.count++ : this.count = 0;
    }
    changeDataBaseForLeafSliderPrev() {
            this.count > 0 ? this.count-- : this.count = this.filteredBase.length - 4;
    }

    delOnePointOfUnitFromCart(e) {
        this.cartOrderAmount.forEach((el, i) => {
            if (el.id == e.target.dataset.id) {
                el.orderAmount--;
                this.dataBase[el.id - 1].orderAmount = el.orderAmount;
                el.orderAmount === 0 ? this.cartOrderAmount.splice(i, 1) : 0;
            }
        })
    }
    delUnitFromCart(e) {
        this.cartOrderAmount.forEach((el, i) => {
            if (el.id == e.target.dataset.id) {
                this.dataBase[el.id - 1].orderAmount = 0;
                this.cartOrderAmount.splice(i, 1);
            }
        })
    }
    updateUnitInCart(e) {
        this.cartOrderAmount.forEach((el) => {
            if (el.id == e.target.dataset.id) {
                if (el.orderAmount == el.quantity) {
                   
                    this.control.addPopUpEmotyStop(e.path[2], this.dictionary);
                } else if (el.quantity <= 0) {
                  
                    this.control.addPopUpEmotyStop(e.path[2], this.dictionary);
                } else {
                    el.orderAmount++;
                }
                this.dataBase.find((el) => el.id == e.target.dataset.id)
                    .orderAmount = el.orderAmount;
            }
        })
    }
    addUnitInCart(e) {
        this.dataBase.forEach((el) => {
            if (el.id == e.target.dataset.id) {
                if (el.orderAmount == el.quantity) {
                  
                    this.control.addPopUpEmotyStop(e.path[2], this.dictionary);
                } else if (this.dataBase.quantity === 0) {
                   
                    this.control.addPopUpEmotyStop(e.path[2], this.dictionary);
                } else {
                    el.orderAmount++;
                    this.cartOrderAmount.push(el);
                }
            }
        })
    }
    getDataFromServer() {
        if (JSON.parse(localStorage.getItem("dataBase"))) {
            this.dataBase = JSON.parse(localStorage.getItem("dataBase"))
            this.control.controllermakeStartPage();
        } else {
            fetch('./js/Data/dataBase.json')
                .then(response => {
                    return response.json()
                })
                .then(data => {
                    this.makeDataBase(data);
                    this.control.controllermakeStartPage();
                });
        }
    }
    getDictionaryFromServer(lang = "En") {
        fetch(`./js/Dictionary/dictionary${lang}.json`)
            .then(response => {
                return response.json()
            })
            .then(dictionary => {
                this.dictionary = dictionary;
                this.control.controllerMakeSliderPage(this.dictionary);
            })
    }
    addToPurchaseHistory(clientData) {
        let purchaseHistory = [];

        if (JSON.parse(localStorage.getItem("clientData"))) {
            purchaseHistory = JSON.parse(localStorage.getItem("clientData"));
        };

        clientData.order = this.cartOrderAmount;

        purchaseHistory.push(clientData);

        return purchaseHistory;
    }
    updateQuantityGoodsInShop() {
        this.cartOrderAmount.forEach((order) => {
            this.dataBase.forEach((data) => {
                if (data.id === order.id) {
                    data.quantity = data.quantity - order.orderAmount;
                    data.orderAmount = 0;
                }
            })
        })
    }

    cleaningCart() {
        this.cartOrderAmount = [];
    }
    makeDataBase(dataBase) {
        const res = [];
        dataBase.forEach(element => {
            switch (element.type) {
                case 'cat':
                    res.push(new Cat(element));
                    break;
                case 'dog':
                    res.push(new Dog(element));
                    break;
                case 'fish':
                    res.push(new Fish(element));
                    break;
                case 'bird':
                    res.push(new Bird(element));
                    break;
            }
        });
        this.dataBase = res;
        localStorage.setItem("dataBase", JSON.stringify(this.dataBase));
    }
}

class Animal {
    constructor(dataBase) {
        this.id = dataBase.id;
        this.type = dataBase.type;
        this.name = dataBase.name;
        this.price = dataBase.price;
        this.orderAmount = 0;
        this.url = dataBase.url;
        this.quantity = dataBase.quantity;
        this.ageMonth = dataBase.ageMonth;
        this.weightKg = dataBase.weightKg;
        this.color = dataBase.color;
        this.gender = dataBase.gender;
        this.lifetimeYears = dataBase.lifetimeYears;
        this.rapacity = dataBase.rapacity
    }
}

class CatDog extends Animal {
    constructor(dataBase) {
        super(dataBase);
        this.fur = dataBase.fur;
        this.shortLegged = dataBase.shortLegged;
        this.pedigree = dataBase.pedigree;
        this.trimming = dataBase.trimming;
    }
}

class Cat extends CatDog {
    constructor(dataBase) {
        super(dataBase);
        this.lopiness = dataBase.lopiness;
    }
}

class Dog extends CatDog {
    constructor(dataBase) {
        super(dataBase);
        this.specialization = dataBase.specialization;
    }
}

class Fish extends Animal {
    constructor(dataBase) {
        super(dataBase);
        this.freshwater = dataBase.zonality;
        this.zonality = dataBase.zonality;
    }
}

class Bird extends Animal {
    constructor(dataBase) {
        super(dataBase);
        this.flying = dataBase.flying;
        this.talking = dataBase.talking;
        this.singing = dataBase.singing;
    }
}