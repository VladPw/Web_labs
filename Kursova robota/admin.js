class Admin {
    products = [];
    editId = 0;
    fillProducts(jsonProducts) {
        this.products = [];
        for (let i = 0; i < jsonProducts.length; i++) {
            let prod = new Product(jsonProducts[i]);
            this.products.push(prod);
        }
        this.showTable();
    }
    showTable() {
        let out = document.getElementById('list');
        out.innerHTML = "";
        for (let i = 0; i < this.products.length; i++) {
            let p = this.products[i];
            let nameText = p.name;
            if (p.isNew) {
                nameText = `${p.name} (новинка)`;
            }
            let priceText = `${p.price} грн`;
            if (p.oldPrice > 0) {
                priceText = `<s>${p.oldPrice}</s> ${p.price} грн`;
            }
            out.innerHTML += `
                <tr>
                    <td>${p.id}</td>
                    <td><img src="${p.image}" alt="${p.name}"></td>
                    <td>${nameText}</td>
                    <td>${p.category}</td>
                    <td>${p.brand}</td>
                    <td>${priceText}</td>
                    <td>${p.amount} шт.</td>
                    <td>
                        <a href="#" class="edit-link" onclick="admin.editProd(${p.id}); return false;">Змінити</a><br>
                        <a href="#" class="del-link" onclick="admin.delProd(${p.id}); return false;">Видалити</a>
                    </td>
                </tr>
            `;
        }
    }
    saveProd() {
        let name = document.getElementById('name').value;
        let cat = document.getElementById('cat').value;
        let brand = document.getElementById('brand').value;
        let price = document.getElementById('price').value;
        let oldPrice = document.getElementById('oldPrice').value;
        let amount = document.getElementById('amount').value;
        let img = document.getElementById('img').value;
        let isNew = document.getElementById('newCheck').checked;
        let desc = document.getElementById('desc').value;
        let numRegex = /^[0-9]+$/;
        if (name == "" || brand == "" || price == "" || amount == "") {
            alert("Заповніть назву, виробника, ціну та кількість");
            return;
        }
        if (!price.match(numRegex) || Number(price) == 0 || !amount.match(numRegex)) {
            alert("Ціна та кількість мають бути цілими числами");
            return;
        }
        if (oldPrice != "" && !oldPrice.match(numRegex)) {
            alert("Стара ціна має бути цілим числом");
            return;
        }
        if (img == "") {
            img = "image/0.jpg";
        }
        let old = 0;
        if (oldPrice != "") {
            old = Number(oldPrice);
        }
        let item = {
            id: 0,
            name: name,
            category: cat,
            brand: brand,
            price: Number(price),
            oldPrice: old,
            amount: Number(amount),
            image: img,
            isNew: isNew,
            desc: desc
        };
        if (this.editId == 0) {
            let maxId = 0;
            for (let i = 0; i < this.products.length; i++) {
                if (this.products[i].id > maxId) {
                    maxId = this.products[i].id;
                }
            }
            item.id = maxId + 1;
            this.products.push(new Product(item));
            alert("Товар додано.");
        } else {
            item.id = this.editId;
            for (let i = 0; i < this.products.length; i++) {
                if (this.products[i].id == this.editId) {
                    this.products[i] = new Product(item);
                    break;
                }
            }
            alert("Товар оновлено.");
        }
        this.clearForm();
        this.showTable();
    }
    editProd(id) {
        for (let i = 0; i < this.products.length; i++) {
            if (this.products[i].id == id) {
                let p = this.products[i];
                this.editId = p.id;
                document.getElementById('name').value = p.name;
                document.getElementById('cat').value = p.type;
                document.getElementById('brand').value = p.brand;
                document.getElementById('price').value = p.price;
                document.getElementById('oldPrice').value = p.oldPrice;
                document.getElementById('amount').value = p.amount;
                document.getElementById('img').value = p.image;
                document.getElementById('newCheck').checked = p.isNew;
                document.getElementById('desc').value = p.desc;
                document.getElementById('admTitle').innerHTML = "Редагування товару";
                document.getElementById('saveBtn').innerHTML = "Зберегти";
                break;
            }
        }
    }
    delProd(id) {
        if (confirm("Видалити цей товар?")) {
            for (let i = 0; i < this.products.length; i++) {
                if (this.products[i].id == id) {
                    this.products.splice(i, 1);
                    break;
                }
            }
            if (this.editId == id) {
                this.clearForm();
            }
            this.showTable();
        }
    }
    clearForm() {
        this.editId = 0;
        document.getElementById('name').value = "";
        document.getElementById('cat').value = "tillage";
        document.getElementById('brand').value = "";
        document.getElementById('price').value = "";
        document.getElementById('oldPrice').value = "0";
        document.getElementById('amount').value = "";
        document.getElementById('img').value = "";
        document.getElementById('desc').value = "";
        document.getElementById('newCheck').checked = false;
        document.getElementById('admTitle').innerHTML = "Додати новий товар";
        document.getElementById('saveBtn').innerHTML = "Додати товар";
    }
}
