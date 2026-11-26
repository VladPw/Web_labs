let emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/;
let phoneRegex = /^\+?[0-9]{10,12}$/;
function showTab(n) {
    if (n == 1) {
        document.getElementById('blockL').style.display = 'block';
        document.getElementById('blockR').style.display = 'none';
        document.getElementById('btnL').className = 'tab tab-act';
        document.getElementById('btnR').className = 'tab';
    } else {
        document.getElementById('blockL').style.display = 'none';
        document.getElementById('blockR').style.display = 'block';
        document.getElementById('btnL').className = 'tab';
        document.getElementById('btnR').className = 'tab tab-act';
    }
}
function validateL() {
    document.getElementById('logemailf').innerHTML = '';
    document.getElementById('logpassf').innerHTML = '';
    let email = document.getElementById("loginEmail").value;
    let password = document.getElementById("loginPassword").value;
    let isV = true;
    if (email == "") {
        document.getElementById('logemailf').innerHTML = "* Поле Email не може бути порожнім";
        isV = false;
    } else if (!email.match(emailRegex)) {
        document.getElementById('logemailf').innerHTML = "* Введіть коректний Email";
        isV = false;
    }
    if (password == "") {
        document.getElementById('logpassf').innerHTML = "* Поле Пароль не може бути порожнім";
        isV = false;
    }
    if (isV) {
        if (email == "admin@mail.ua" && password == "admin123") {
            alert("Вхід виконано як адміністратор.");
            window.location.href = "admin.html";
        } else {
            alert("Авторизація пройшла успішно.");
            window.location.href = "catalog.html";
        }
    }
    return false;
}
function validateR() {
    document.getElementById('namef').innerHTML = '';
    document.getElementById('emailf').innerHTML = '';
    document.getElementById('phonef').innerHTML = '';
    document.getElementById('passf').innerHTML = '';
    document.getElementById('pass2f').innerHTML = '';

    let fullname = document.getElementById("regName").value;
    let email = document.getElementById("regEmail").value;
    let phone = document.getElementById("regPhone").value;
    let password = document.getElementById("regPassword").value;
    let password2 = document.getElementById("regPassword2").value;
    let isV = true;
    if (fullname == "") {
        document.getElementById('namef').innerHTML = "* Поле ПІБ обов'язкове";
        isV = false;
    }
    if (email == "") {
        document.getElementById('emailf').innerHTML = "* Поле Email не може бути порожнім";
        isV = false;
    } else if (!email.match(emailRegex)) {
        document.getElementById('emailf').innerHTML = "* Введіть коректний Email";
        isV = false;
    }
    if (phone == "") {
        document.getElementById('phonef').innerHTML = "* Поле Телефон не може бути порожнім";
        isV = false;
    } else if (!phone.match(phoneRegex)) {
        document.getElementById('phonef').innerHTML = "* Введіть коректний номер";
        isV = false;
    }
    if (password == "") {
        document.getElementById('passf').innerHTML = "* Поле Пароль не може бути порожнім";
        isV = false;
    } else if (password.length < 6) {
        document.getElementById('passf').innerHTML = "* Мінімум 6 символів";
        isV = false;
    }
    if (password2 == "") {
        document.getElementById('pass2f').innerHTML = "* Підтвердіть пароль";
        isV = false;
    } else if (password != password2) {
        document.getElementById('pass2f').innerHTML = "* Паролі не співпадають";
        isV = false;
    }
    if (isV) {
        alert("Дані введено коректно. Акаунт успішно створено.");
        window.location.href = "catalog.html";
    }
    return false;
}
