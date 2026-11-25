class Product {
    constructor(id, name, type, category, brand, price, oldPrice, amount, image, isNew) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.category = category;
        this.brand = brand;
        this.price = price;
        this.oldPrice = oldPrice;
        this.amount = amount;
        this.image = image;
        this.isNew = isNew;
    }
    addToBasket() {
        console.log(`Product with name ${this.name} has been added to the basket`);
    }
}

class TillageTool extends Product {
    constructor(item) {
        super(item.id, item.name, 'tillage', 'Обробка ґрунту', item.brand, item.price, item.oldPrice, item.amount, item.image, item.isNew);
    }
}
class PrunersTool extends Product {
    constructor(item) {
        super(item.id, item.name, 'pruners', 'Обрізка саду', item.brand, item.price, item.oldPrice, item.amount, item.image, item.isNew);
    }
}
class WateringTool extends Product {
    constructor(item) {
        super(item.id, item.name, 'watering', 'Системи поливу', item.brand, item.price, item.oldPrice, item.amount, item.image, item.isNew);
    }
}
class TechTool extends Product {
    constructor(item) {
        super(item.id, item.name, 'tech', 'Садова техніка', item.brand, item.price, item.oldPrice, item.amount, item.image, item.isNew);
    }
}
class CareTool extends Product {
    constructor(item) {
        super(item.id, item.name, 'care', 'Догляд і захист', item.brand, item.price, item.oldPrice, item.amount, item.image, item.isNew);
    }
}
class CleaningTool extends Product {
    constructor(item) {
        super(item.id, item.name, 'cleaning', 'Тачки та прибирання', item.brand, item.price, item.oldPrice, item.amount, item.image, item.isNew);
    }
}

function productFactory(item) {
    if (item.category == 'tillage') {
        return new TillageTool(item);
    } else if (item.category == 'pruners') {
        return new PrunersTool(item);
    } else if (item.category == 'watering') {
        return new WateringTool(item);
    } else if (item.category == 'tech') {
        return new TechTool(item);
    } else if (item.category == 'care') {
        return new CareTool(item);
    } else if (item.category == 'cleaning') {
        return new CleaningTool(item);
    }
}

class Basket {
    products = [];

    add(product) {
        let tm = new Date();
        let timecur = tm.toLocaleTimeString();
        let inBasket = {
            id: product.id,
            name: product.name,
            category: product.category,
            price: product.price,
            image: product.image,
            time: timecur
        };
        this.products.push(inBasket);
        this.showBasket();
    }

    getSum() {
        let sum = 0;
        for (let i = 0; i < this.products.length; i++) {
            sum = sum + this.products[i].price;
        }
        return sum;
    }

    showBasket() {
        let block = document.getElementById('list');

        if (this.products.length == 0) {
            block.innerHTML = '<p class="empty-b">Кошик порожній</p>';
            return;
        }

        block.innerHTML = "";
        for (let i = 0; i < this.products.length; i++) {
            let item = this.products[i];
            block.innerHTML += `
                <div class="basket-row">
                    <img src="${item.image}" alt="${item.name}">
                    <div>
                        <b>${item.name}</b>
                        <p>${item.price} грн</p>
                        <span>Час: ${item.time}</span><br>
                        <a href="#" class="del-link" onclick="store.delProd(${i}); return false;">Видалити</a>
                    </div>
                </div>
            `;
        }

        block.innerHTML += `
            <div class="b-total">Разом: <b>${this.getSum()} грн</b></div>
            <button class="order-btn" onclick="store.order()">Оформити замовлення</button>
        `;
    }
}

class Store {
    products = [];
    curCat = 'all';

    constructor() {
        this.basket = new Basket();
    }

    fillStoreWithProducts(jsonProducts) {
        this.products = [];
        for (let i = 0; i < jsonProducts.length; i++) {
            let prod = productFactory(jsonProducts[i]);
            this.products.push(prod);
        }
        this.showProducts();
    }

    selectCat(c) {
        document.getElementById(this.curCat).className = '';
        this.curCat = c;
        document.getElementById(this.curCat).className = 'cat-act';
        this.showProducts();
    }

    showNew() {
        document.getElementById('newCheck').checked = true;
        document.getElementById('saleCheck').checked = false;
        this.selectCat('all');
    }

    showSale() {
        document.getElementById('newCheck').checked = false;
        document.getElementById('saleCheck').checked = true;
        this.selectCat('all');
    }

    clearFilter() {
        document.getElementById('search').value = '';
        document.getElementById('priceFrom').value = '';
        document.getElementById('priceTo').value = '';
        document.getElementById('newCheck').checked = false;
        document.getElementById('saleCheck').checked = false;
        document.getElementById('sortDef').checked = true;
        this.selectCat('all');
    }

    buyProd(id) {
        for (let i = 0; i < this.products.length; i++) {
            if (this.products[i].id == id) {
                let prod = this.products[i];
                if (prod.amount > 0) {
                    prod.amount = prod.amount - 1;
                    prod.addToBasket();
                    this.basket.add(prod);
                    this.showProducts();
                } else {
                    alert(`Товару "${prod.name}" більше немає в наявності`);
                }
                break;
            }
        }
    }

    delProd(index) {
        let item = this.basket.products[index];
        for (let i = 0; i < this.products.length; i++) {
            if (this.products[i].id == item.id) {
                this.products[i].amount = this.products[i].amount + 1;
                break;
            }
        }
        this.basket.products.splice(index, 1);
        this.basket.showBasket();
        this.showProducts();
    }

    order() {
        alert(`Замовлення оформлено.`);
        this.basket.products = [];
        this.basket.showBasket();
    }

    showProducts() {
        let search = document.getElementById('search').value.toLowerCase();
        let pFrom = document.getElementById('priceFrom').value;
        let pTo = document.getElementById('priceTo').value;
        let isNew = document.getElementById('newCheck').checked;
        let isSale = document.getElementById('saleCheck').checked;

        let sort = 'default';
        let radios = document.getElementsByName('sort');
        for (let i = 0; i < radios.length; i++) {
            if (radios[i].checked) {
                sort = radios[i].value;
            }
        }

        let title = "Каталог товарів";
        if (this.curCat == 'all') {
            if (isNew && !isSale) {
                title = "Новинки каталогу";
            } else if (isSale && !isNew) {
                title = "Акційні товари";
            }
        } else {
            title = document.getElementById(this.curCat).innerHTML;
        }
        document.getElementById('catTitle').innerHTML = title;

        let res = [];
        for (let i = 0; i < this.products.length; i++) {
            let p = this.products[i];
            let ok = true;

            if (search != "") {
                let text = (p.name + " " + p.brand).toLowerCase();
                if (text.indexOf(search) == -1) {
                    ok = false;
                }
            }
            if (this.curCat != 'all' && p.type != this.curCat) {
                ok = false;
            }
            if (pFrom != "" && p.price < Number(pFrom)) {
                ok = false;
            }
            if (pTo != "" && p.price > Number(pTo)) {
                ok = false;
            }
            if (isNew && !p.isNew) {
                ok = false;
            }
            if (isSale && p.oldPrice == 0) {
                ok = false;
            }

            if (ok) {
                res.push(p);
            }
        }

        if (sort == 'asc') {
            res.sort(function(a, b) { return a.price - b.price; });
        } else if (sort == 'desc') {
            res.sort(function(a, b) { return b.price - a.price; });
        }

        let out = document.getElementById('catalog');
        out.innerHTML = "";

        if (res.length == 0) {
            out.innerHTML = '<div class="no-prod">Товарів за вашим запитом не знайдено.</div>';
            return;
        }

        for (let i = 0; i < res.length; i++) {
            let p = res[i];

            let mark = "";
            if (p.oldPrice > 0) {
                mark = '<span class="card-mark mark-sale">Акція</span>';
            } else if (p.isNew) {
                mark = '<span class="card-mark mark-new">Новинка</span>';
            }

            let priceText = `<b>${p.price} грн</b>`;
            if (p.oldPrice > 0) {
                priceText = `<s>${p.oldPrice} грн</s><b>${p.price} грн</b>`;
            }

            out.innerHTML += `
                <div class="card">
                    ${mark}
                    <img src="${p.image}" alt="${p.name}">
                    <h4>${p.name}</h4>
                    <p class="card-info">Категорія: <b>${p.category}</b></p>
                    <p class="card-info">Виробник: <b>${p.brand}</b></p>
                    <p class="card-ost">В наявності: <b>${p.amount} шт.</b></p>
                    <div class="card-buy">
                        <div class="card-price">${priceText}</div>
                        <button class="card-btn" onclick="store.buyProd(${p.id})">У кошик</button>
                    </div>
                </div>
            `;
        }
    }
}