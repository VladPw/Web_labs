class Product {
    constructor(name, category, amount, image) {
        this.name = name;
        this.category = category;
        this.amount = amount;
        this.image = image;
    }
    addToBasket() {
        console.log(`Product with name ${this.name} has been added to the basket`);
    }
}
class TillageTool extends Product {
    constructor(name, amount, image) {
        super(name, 'Інвентар для ґрунту', amount, image);
    }
}
class PrunersTool extends Product {
    constructor(name, amount, image) {
        super(name, 'Інструменти для обрізки', amount, image);
    }
}
class WateringTool extends Product {
    constructor(name, amount, image) {
        super(name, 'Системи поливу', amount, image);
    }
}
function productFactory(item) {
    if (item.category == 'tillage') {
        return new TillageTool(item.name, item.amount, item.image);
    } else if (item.category == 'pruners') {
        return new PrunersTool(item.name, item.amount, item.image);
    } else if (item.category == 'watering') {
        return new WateringTool(item.name, item.amount, item.image);
    }
}
class Basket {
    products = [];
    add(product) {
        let tm = new Date();
        let timecur = tm.toLocaleTimeString();
        let inBasket = {
            name: product.name,
            category: product.category,
            image: product.image,
            time: timecur
        };
        this.products.push(inBasket);
        this.showBasket();
    }
    showBasket() {
        let block = document.getElementById('list');
        if (this.products.length == 0) {
            block.innerHTML = "<p>Кошик порожній</p>";
            return;
        }
block.innerHTML = "";
for (let i = 0; i < this.products.length; i++) {
    let item = this.products[i];
    block.innerHTML += `
        <div class="basket-row">
            <img src="${item.image}" width="50" height="50">
            <b>${item.name}</b> (${item.category})<p>Додано о: <b>${item.time}</b></p>
        </div>
    `;
}
}
}
class Store {
    products = [];
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
    buyProd(index) {
        let product = this.products[index];
        if (product.amount > 0) {
            product.amount = product.amount - 1;
            product.addToBasket();
            this.basket.add(product);
            this.showProducts();
        } else {
            alert(`Товару "${product.name}" більше немає в наявності`);
        }
    }
    showProducts() {
    let catalogBlock = document.getElementById('catalog-list');
    catalogBlock.innerHTML = "";
    for (let i = 0; i < this.products.length; i++) {
        let p = this.products[i];
        catalogBlock.innerHTML += `
            <div class="product-card">
                <img src="${p.image}" alt="${p.name}">
                <h4>${p.name}</h4>
                <p>Категорія: ${p.category}</p>
                <p>В наявності: <b>${p.amount} шт.</b></p>
                <button onclick="store.buyProd(${i})">Додати в кошик</button>
            </div>
        `;
    }
}
}