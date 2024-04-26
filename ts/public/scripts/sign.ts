const formSignup = document.querySelector('.signup') as HTMLFormElement;

if(formSignup) {

    formSignup.addEventListener('submit', (e: SubmitEvent) => {
        e.preventDefault();
        const [lastname, firstname, email, pswd, confirm, street, zipcode, city] = formSignup;

        const datas = {
            lastname: (lastname as HTMLInputElement).value,
            firstname: (firstname as HTMLInputElement).value,
            email: (email as HTMLInputElement).value,
            password: (pswd as HTMLInputElement).value,
            confirm: (confirm as HTMLInputElement).value,
            street: (street as HTMLInputElement).value,
            zipcode: (zipcode as HTMLInputElement).value,
            city: (city as HTMLInputElement).value,
            role: 0
        }

        fetch('/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datas),
        }).then(response => {
            if(!response.ok) { console.log("données non transmises")}
            return response.json();
        }).then(datas => {
            window.localStorage.setItem('textMessage', datas.message.text);
            window.localStorage.setItem('typeMessage', datas.message.type);
            window.location.href = datas.url;
        })
    })

    const message = {
        type: window.localStorage.getItem('typeMessage') ?? '',
        text: window.localStorage.getItem('textMessage') ?? ''
    }
    
    if(message.text && message.text.trim() !== '') {
        displayMessage(message, formSignup);
    }
}

const formSignin = document.querySelector('.signin') as HTMLFormElement;

if(formSignin) {

    formSignin.addEventListener('submit', (e: SubmitEvent) => {
        e.preventDefault();
        const [email, pswd] = formSignin;

        const datas = {
            email: (email as HTMLInputElement).value,
            password: (pswd as HTMLInputElement).value
        }

        fetch('/signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datas),
        }).then(response => {
            if(!response.ok) { console.log("données non transmises")}
            console.log("datas transmis : ", response);
            return response.json();
        }).then(datas => {
            window.localStorage.setItem('textMessage', datas.message.text);
            window.localStorage.setItem('typeMessage', datas.message.type);
            window.location.href = datas.url
        })
    })

    const message = {
        type: window.localStorage.getItem('typeMessage') ?? '',
        text: window.localStorage.getItem('textMessage') ?? ''
    }
    
    if(message.text && message.text.trim() !== '') {
        displayMessage(message, formSignin);
    }
}
