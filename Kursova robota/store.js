function getCatName(type) {
    if (type == 'tillage') return 'Обробка ґрунту';
    if (type == 'pruners') return 'Обрізка саду';
    if (type == 'watering') return 'Системи поливу';
    if (type == 'tech') return 'Садова техніка';
    if (type == 'care') return 'Догляд і захист';
    if (type == 'cleaning') return 'Тачки та прибирання';
    return type;
}
class Product {
    constructor(item) {
        this.id = item.id;
        this.name = item.name;
        this.type = item.category;
        this.category = getCatName(item.category);
        this.brand = item.brand;
        this.price = item.price;
        this.oldPrice = item.oldPrice;
        this.amount = item.amount;
        this.image = item.image;
        this.isNew = item.isNew;
        if (item.desc) {
            this.desc = item.desc;
        } else {
            this.desc = "Опис товару відсутній.";
        }
    }
    addToBasket() {
        console.log(`Product with name ${this.name} has been added to the basket`);
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
            <div class="b-total">До сплати: <b>${this.getSum()} грн</b></div>
            <button class="order-btn" onclick="store.order()">Оформити замовлення</button>
        `;
    }
}
class Store {
    products = [];
    curCat = 'all';
    curProd = 0;
    constructor() {
        this.basket = new Basket();
    }
    fillStoreWithProducts(jsonProducts) {
        this.products = [];
        for (let i = 0; i < jsonProducts.length; i++) {
            let prod = new Product(jsonProducts[i]);
            this.products.push(prod);
        }
        this.showProducts();
    }
    selectCat(c) {
        if (this.curProd != 0) {
            this.closeProd();
        }
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
    showProd(id) {
        for (let i = 0; i < this.products.length; i++) {
            if (this.products[i].id == id) {
                let p = this.products[i];
                this.curProd = id;
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
                document.getElementById('catTitle').innerHTML = "Інформація про товар";
                document.getElementById('catView').style.display = 'none';
                let info = document.getElementById('prodInfo');
                info.style.display = 'block';
                info.innerHTML = `
                    <div class="info-box">
                        <button class="back-btn" onclick="store.closeProd()">← Назад</button>
                        <div class="info-top">
                            <div class="info-img">
                                ${mark}
                                <img src="${p.image}" alt="${p.name}">
                            </div>
                            <div class="info-main">
                                <h3>${p.name}</h3>
                                <p class="info-row">Категорія: <b>${p.category}</b></p>
                                <p class="info-row">Виробник: <b>${p.brand}</b></p>
                                <p class="info-row">В наявності: <b>${p.amount} шт.</b></p>
                                <div class="info-buy">
                                    <div class="info-price">${priceText}</div>
                                    <button class="card-btn" onclick="store.buyProd(${p.id})">У кошик</button>
                                </div>
                            </div>
                        </div>
                        <div class="info-desc">
                            <h4>Опис товару</h4>
                            <p>${p.desc}</p>
                        </div>
                    </div>
                `;
                break;
            }
        }
    }
    closeProd() {
        this.curProd = 0;
        document.getElementById('prodInfo').style.display = 'none';
        document.getElementById('catView').style.display = 'block';
        this.showProducts();
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
                    if (this.curProd != 0) {
                        this.showProd(this.curProd);
                    }
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
        if (this.curProd != 0) {
            this.showProd(this.curProd);
        }
    }
    order() {
        alert(`Замовлення оформлено!`);
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
        if (this.curProd == 0) {
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
        }
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
            res.sort(function (a, b) { return a.price - b.price; });
        } else if (sort == 'desc') {
            res.sort(function (a, b) { return b.price - a.price; });
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
                    <img src="${p.image}" alt="${p.name}" onclick="store.showProd(${p.id})">
                    <h4 onclick="store.showProd(${p.id})">${p.name}</h4>
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
