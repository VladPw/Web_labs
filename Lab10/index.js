let curCat = "";
async function fetchProducts() {
    try {
        curCat = "";
        setActCat("");
        document.getElementById('catTitle').innerHTML = "Усі товари";
        document.getElementById('catalog').innerHTML = "Завантаження товарів...";
        const res = await fetch('https://dummyjson.com/products');
        const products = await res.json();
        console.log(products);
        showProducts(products.products);
    } catch (error) {
        console.error(error);
    }
}
async function fetchProductById(id) {
    try {
        const res = await fetch('https://dummyjson.com/products/' + id);
        const product = await res.json();
        console.log(product);
        showInfo(product);
    } catch (error) {
        console.error(error);
    }
}
async function fetchCategories() {
    try {
        const res = await fetch('https://dummyjson.com/products/categories');
        const categories = await res.json();
        console.log(categories);
        showCategories(categories);
    } catch (error) {
        console.error(error);
    }
}
async function fetchCat(c) {
    try {
        curCat = c;
        setActCat(c);
        let link = document.getElementById(c);
        if (link) {
            document.getElementById('catTitle').innerHTML = link.innerHTML;
        } else {
            document.getElementById('catTitle').innerHTML = c;
        }
        document.getElementById('catalog').innerHTML = "Завантаження товарів...";
        const res = await fetch('https://dummyjson.com/products/category/' + c);
        const products = await res.json();
        console.log(products);
        showProducts(products.products);
    } catch (error) {
        console.error(error);
    }
}
function showCategories(cats) {
    let block = document.getElementById('catList');
    block.innerHTML = "";
    for (let i = 0; i < cats.length; i++) {
        let cat = cats[i];
        block.innerHTML += `
            <li>
                <a href="#" id="${cat.slug}" onclick="fetchCat('${cat.slug}'); return false;">${cat.name}</a>
            </li>
        `;
    }
}
function setActCat(c) {
    let links = document.getElementById('catList').getElementsByTagName('a');
    for (let i = 0; i < links.length; i++) {
        links[i].className = '';
    }
    if (c != "") {
        let act = document.getElementById(c);
        if (act) {
            act.className = 'cat-act';
        }
    }
}
function showProducts(prods) {
    let out = document.getElementById('catalog');
    out.innerHTML = "";
    for (let i = 0; i < prods.length; i++) {
        let p = prods[i];
        out.innerHTML += `
            <div class="card">
                <img src="${p.thumbnail}" alt="${p.title}" onclick="fetchProductById(${p.id})">
                <h4 onclick="fetchProductById(${p.id})">${p.title}</h4>
                <p class="card-info">Категорія: <b>${p.category}</b></p>
                <p class="card-info">Рейтинг: <b>${p.rating}/5</b></p>
                <p class="card-ost">В наявності: <b>${p.stock} шт.</b></p>
                <div class="card-buy">
                    <div class="card-price"><b>$${p.price}</b></div>
                    <button class="card-btn" onclick="fetchProductById(${p.id})">Детальніше</button>
                </div>
            </div>
        `;
    }
}
function showInfo(p) {
    let brand = "Не вказано";
    if (p.brand) {
        brand = p.brand;
    }
    document.getElementById('catTitle').innerHTML = "Інформація про товар";
    let out = document.getElementById('catalog');
    out.innerHTML = `
        <div class="info-box">
            <button class="back-btn" onclick="goBack()">&larr; Назад</button>
            <div class="info-top">
                <div class="info-img">
                    <img src="${p.thumbnail}" alt="${p.title}">
                </div>
                <div class="info-main">
                    <h3>${p.title}</h3>
                    <p class="info-row">Категорія: <b>${p.category}</b></p>
                    <p class="info-row">Виробник: <b>${brand}</b></p>
                    <p class="info-row">Рейтинг: <b>${p.rating}/5</b></p>
                    <p class="info-row">В наявності: <b>${p.stock} шт.</b></p>
                    <div class="info-price"><b>$${p.price}</b></div>
                </div>
            </div>
            <div class="info-desc">
                <h4>Опис товару</h4>
                <p>${p.description}</p>
            </div>
        </div>
    `;
}
function goBack() {
    if (curCat != "") {
        fetchCat(curCat);
    } else {
        fetchProducts();
    }
}
fetchCategories();
fetchProducts();