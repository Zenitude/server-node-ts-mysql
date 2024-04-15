"use strict";
const formCreateUser = document.querySelector('.create-user');
const formUpdateUser = document.querySelector('.update-user');
const formDeleteUser = document.querySelector('.delete-user');
const listUser = document.querySelector('.list-user');
if (listUser) {
    const message = {
        type: window.localStorage.getItem('typeMessage') ?? '',
        text: window.localStorage.getItem('textMessage') ?? ''
    };
    const link = listUser.previousElementSibling;
    if (message.text && message.text.trim() !== '') {
        displayMessage(message, link);
    }
}
if (formCreateUser) {
    formCreateUser.addEventListener('submit', (e) => {
        e.preventDefault();
        const [lastname, firstname, email, pswd, confirm, street, zipcode, city, role] = formCreateUser;
        const datas = {
            lastname: lastname.value,
            firstname: firstname.value,
            email: email.value,
            password: pswd.value,
            confirm: confirm.value,
            street: street.value,
            zipcode: zipcode.value,
            city: city.value,
            role: role.value
        };
        fetch('/users/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datas),
        }).then(response => {
            if (!response.ok) {
                console.log("données non transmises");
            }
            return response.json();
        }).then(datas => {
            window.localStorage.setItem('textMessage', datas.message.text);
            window.localStorage.setItem('typeMessage', datas.message.type);
            window.location.href = datas.url;
        });
    });
    const message = {
        type: window.localStorage.getItem('typeMessage') ?? '',
        text: window.localStorage.getItem('textMessage') ?? ''
    };
    if (message.text && message.text.trim() !== '') {
        displayMessage(message, formCreateUser);
    }
}
if (formUpdateUser) {
    formUpdateUser.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = window.location.pathname.split('/')[2];
        console.log('id formUpdateUser : ', id);
        const [lastname, firstname, email, street, zipcode, city, role] = formUpdateUser;
        const datas = {
            lastname: lastname.value,
            firstname: firstname.value,
            email: email.value,
            street: street.value,
            zipcode: zipcode.value,
            city: city.value,
            role: role.value
        };
        fetch(`/users/${id}/update`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datas),
        }).then(response => {
            if (!response.ok) {
                console.log("données non transmises");
            }
            console.log('id fetch : ', id);
            return response.json();
        }).then(datas => {
            window.localStorage.setItem('textMessage', datas.message.text);
            window.localStorage.setItem('typeMessage', datas.message.type);
            window.location.href = datas.url;
        });
    });
    const message = {
        type: window.localStorage.getItem('typeMessage') ?? '',
        text: window.localStorage.getItem('textMessage') ?? ''
    };
    if (message.text && message.text.trim() !== '') {
        displayMessage(message, formUpdateUser);
    }
}
if (formDeleteUser) {
    formDeleteUser.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = window.location.pathname.split('/')[2];
        fetch(`/users/${id}/delete`, {
            method: 'DELETE'
        }).then(response => {
            if (!response.ok) {
                console.log("error delete user");
            }
            return response.json();
        }).then(datas => {
            window.localStorage.setItem('textMessage', datas.message.text);
            window.localStorage.setItem('typeMessage', datas.message.type);
            window.location.href = datas.url;
        });
    });
}
