"use strict";
const formSignup = document.querySelector('.signup');
if (formSignup) {
    formSignup.addEventListener('submit', (e) => {
        e.preventDefault();
        const [lastname, firstname, email, pswd, confirm, street, zipcode, city] = formSignup;
        const datas = {
            lastname: lastname.value,
            firstname: firstname.value,
            email: email.value,
            password: pswd.value,
            confirm: confirm.value,
            street: street.value,
            zipcode: zipcode.value,
            city: city.value,
            role: 0
        };
        fetch('/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
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
}
const formSignin = document.querySelector('.signin');
if (formSignin) {
    formSignin.addEventListener('submit', (e) => {
        e.preventDefault();
        const [email, pswd] = formSignin;
        const datas = {
            email: email.value,
            password: pswd.value
        };
        fetch('/signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datas),
        }).then(response => {
            if (!response.ok) {
                console.log("données non transmises");
            }
            console.log("datas transmis : ", response);
            return response.json();
        }).then(datas => {
            window.localStorage.setItem('textMessage', datas.message.text);
            window.localStorage.setItem('typeMessage', datas.message.type);
            window.location.href = datas.url;
        });
    });
}
