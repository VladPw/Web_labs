let products = [];
let basket = [];
let curCat = "all";
let curMode = "all";
function getCatName(type) {
    if (type == "tillage") return "Обробка ґрунту";
    if (type == "pruners") return "Обрізка саду";
    return type;
}
function selectCat(c) {
    $(".cat-list a").removeClass("cat-act");
    curCat = c;
    curMode = "all";
    $("#" + curCat).addClass("cat-act");
    showProducts();
}
function showNew() {
    $(".cat-list a").removeClass("cat-act");
    curCat = "all";
    curMode = "new";
    $("#all").addClass("cat-act");
    showProducts();
}
function showSale() {
    $(".cat-list a").removeClass("cat-act");
    curCat = "all";
    curMode = "sale";
    $("#all").addClass("cat-act");
    showProducts();
}
function clearFilter() {
    $("#search").val("");
    $("#priceFrom").val("");
    $("#priceTo").val("");
    $("#sortSelect").val("default");
    selectCat("all");
}
function showProducts() {
    let search = $("#search").val().toLowerCase();
    let pFrom = $("#priceFrom").val();
    let pTo = $("#priceTo").val();
    let sort = $("#sortSelect").val();
    let title = "Каталог товарів";
    if (curMode == "new") {
        title = "Новинки каталогу";
    } else if (curMode == "sale") {
        title = "Акційні товари";
    } else if (curCat != "all") {
        title = $("#" + curCat).text();
    }
    $("#catTitle").text(title);
    let res = [];
    for (let i = 0; i < products.length; i++) {
        let p = products[i];
        let ok = true;
        if (search != "") {
            let text = (p.name + " " + p.brand).toLowerCase();
            if (text.indexOf(search) == -1) {
                ok = false;
            }
        }
        if (curCat != "all" && p.type != curCat) {
            ok = false;
        }
        if (pFrom != "" && p.price < Number(pFrom)) {
            ok = false;
        }
        if (pTo != "" && p.price > Number(pTo)) {
            ok = false;
        }
        if (curMode == "new" && !p.isNew) {
            ok = false;
        }
        if (curMode == "sale" && p.oldPrice == 0) {
            ok = false;
        }

        if (ok) {
            res.push(p);
        }
    }
    if (sort == "asc") {
        res.sort(function (a, b) { return a.price - b.price; });
    } else if (sort == "desc") {
        res.sort(function (a, b) { return b.price - a.price; });
    }
    let out = $("#catalog");
    out.empty();
    if (res.length == 0) {
        out.append('<div class="no-prod">Товарів за вашим запитом не знайдено.</div>');
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
        out.append(`
            <div class="card">
                ${mark}
                <img src="${p.image}" alt="${p.name}">
                <h4>${p.name}</h4>
                <p class="card-info">Категорія: <b>${p.category}</b></p>
                <p class="card-info">Виробник: <b>${p.brand}</b></p>
                <p class="card-ost">В наявності: <b>${p.amount} шт.</b></p>
                <div class="card-buy">
                    <div class="card-price">${priceText}</div>
                    <button class="card-btn buy-btn" data-id="${p.id}">У кошик</button>
                </div>
            </div>
        `);
    }
    $(".card").mouseenter(function () {
        $(this).css({ "border-color": "#558b2f", "background-color": "#f9fcf6" });
    });
    $(".card").mouseleave(function () {
        $(this).css({ "border-color": "#c5e1a5", "background-color": "#ffffff" });
    });
    $(".buy-btn").click(function () {
        let id = Number($(this).attr("data-id"));
        buyProd(id);
    });
}
function getSum() {
    let sum = 0;
    for (let i = 0; i < basket.length; i++) {
        sum = sum + basket[i].price;
    }
    return sum;
}
function showBasket() {
    let block = $("#list");
    block.empty();
    if (basket.length == 0) {
        block.append('<p class="empty-b">Кошик порожній</p>');
        return;
    }
    for (let i = 0; i < basket.length; i++) {
        let item = basket[i];
        block.append(`
            <div class="basket-row" id="basketRow${i}">
                <img src="${item.image}" alt="${item.name}">
                <div>
                    <b>${item.name}</b>
                    <p>${item.price} грн</p>
                    <span>Час: ${item.time}</span><br>
                    <a href="#" class="del-link" data-index="${i}">Видалити</a>
                </div>
            </div>
        `);
    }
    block.append(`
        <div class="b-total">До сплати: <b>${getSum()} грн</b></div>
        <button class="order-btn">Оформити замовлення</button>
    `);
    $(".del-link").click(function (e) {
        e.preventDefault();
        let idx = Number($(this).attr("data-index"));
        $("#basketRow" + idx).slideUp(200, function () {
            $(this).remove();
            delProd(idx);
        });
    });
    $(".order-btn").click(function () {
        alert("Замовлення оформлено!");
        basket = [];
        showBasket();
    });
}
function buyProd(id) {
    for (let i = 0; i < products.length; i++) {
        if (products[i].id == id) {
            let p = products[i];
            if (p.amount > 0) {
                p.amount = p.amount - 1;
                let tm = new Date();
                basket.push({
                    id: p.id,
                    name: p.name,
                    price: p.price,
                    image: p.image,
                    time: tm.toLocaleTimeString()
                });
                showBasket();
                showProducts();
            } else {
                alert('Товару "' + p.name + '" більше немає в наявності');
            }
            break;
        }
    }
}
function delProd(index) {
    if (!basket[index]) return;
    let item = basket[index];
    for (let i = 0; i < products.length; i++) {
        if (products[i].id == item.id) {
            products[i].amount = products[i].amount + 1;
            break;
        }
    }
    basket.splice(index, 1);
    showBasket();
    showProducts();
}
$(document).ready(function () {
    $.getJSON("products.json", function (data) {
        products = [];
        for (let i = 0; i < data.length; i++) {
            let item = data[i];
            products.push({
                id: item.id,
                name: item.name,
                type: item.category,
                category: getCatName(item.category),
                brand: item.brand,
                price: item.price,
                oldPrice: item.oldPrice,
                amount: item.amount,
                image: item.image,
                isNew: item.isNew
            });
        }
        let hash = window.location.hash.replace("#", "");
        if (hash == "new") {
            showNew();
        } else if (hash == "sale") {
            showSale();
        } else if (hash != "" && $("#" + hash).length > 0) {
            selectCat(hash);
        } else {
            showProducts();
        }
    });
    $("#catMenu").mouseenter(function () {
        $("#subNav").slideDown(200);
    });
    $("#catMenu").mouseleave(function () {
        $("#subNav").slideUp(150);
    });
    $("#navAll").click(function (e) {
        e.preventDefault();
        clearFilter();
    });
    $("#subNav a").click(function (e) {
        e.preventDefault();
        let c = $(this).attr("data-cat");
        selectCat(c);
        $("#subNav").slideUp(150);
    });
    $("#navNew").click(function (e) {
        e.preventDefault();
        showNew();
    });
    $("#navSale").click(function (e) {
        e.preventDefault();
        showSale();
    });
    $(".cat-list a").click(function (e) {
        e.preventDefault();
        let c = $(this).attr("id");
        selectCat(c);
    });
    $("#filterHead").click(function () {
        $("#filterBody").slideToggle(250);
    });
    $("#search, #priceFrom, #priceTo").keyup(function () {
        showProducts();
    });
    $('input[type="text"]').focus(function () {
        $(this).css("background-color", "#f1f8e9");
    });
    $('input[type="text"]').blur(function () {
        $(this).css("background-color", "#ffffff");
    });
    $("#sortSelect").change(function () {
        showProducts();
    });
    $("#clearBtn").click(function () {
        clearFilter();
    });
});