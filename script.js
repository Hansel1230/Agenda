//#region Login

// GLOBALS
let userArray = [];
let currentUser = "";
let btnSingIn = document.querySelector('.sign-in-btn');
let btnSingUp = document.querySelector('.sign-up-btn');
let singUp = document.querySelector('.sign-up');
let singIn = document.querySelector('.sign-in');


// CREATIONAL FUNCTIONS
function User(userName, userEmail, userPassword) 
{
    this.id = 'id' + (new Date()).getTime();
    this.userName = userName;
    this.userEmail = userEmail;
    this.userPassword = userPassword;
    this.contacts = [];

    return this;
}

function Contact(contactName, contactLastName, contactPhoneNumber, contactEmail) 
{
    this.id = 'id' + (new Date()).getTime();
    this.contactName = contactName;
    this.contactLastName = contactLastName;
    this.contactPhoneNumber = contactPhoneNumber;
    this.contactEmail = contactEmail;

    return this;
}

function getCurrentUser()
{
    userArray = JSON.parse(sessionStorage.getItem('data'));
    currentUser = JSON.parse(sessionStorage.getItem('actualUser'));
    let user = userArray.filter(user => user.userEmail === currentUser)[0];
    
    return user;
}

function saveInfo(key, value)
{
    sessionStorage.setItem(key,JSON.stringify(value))
}

// SING IN AND SING UP EVENT LISTENER
document.addEventListener('click', e=>
{
    if(e.target=== btnSingIn || e.target=== btnSingUp)
    {
        singIn.classList.toggle('active');
        singUp.classList.toggle('active')    
    }
});

//Login Sing-Up
function login_Sing_Up()
{
    let userName = document.getElementById("name_Sing_Up").value;
    let userEmail = document.getElementById("email_Sing_Up").value;
    let userPassword = document.getElementById("password_Sing_Up").value;
    
    if (userArray.some(user => user.userEmail == userEmail)) {
        alert('email registrado')
    }
    else {
        const user = new User(userName,userEmail,userPassword)

        userArray = JSON.parse(sessionStorage.getItem('data')) || []
        userArray.push(user);
        saveInfo('data', userArray)
        btnSingIn.click();
    }

}

//Validacion Login Sing-In/
function login_Sing_In()
{
    userArray = JSON.parse(sessionStorage.getItem('data')) || []

    let userEmail = document.getElementById("email_Sing_In").value;
    let userPassword = document.getElementById("password_Sing_In").value;

    let getUser = userArray.filter(user => user.userEmail === userEmail)[0];

    if (getUser) {
        let isValidPassWord = getUser.userPassword == userPassword;
        if (isValidPassWord) {
            saveInfo('actualUser', userEmail)
            window.location= "CRUD.html";
            // const actualUser =  document.getElementById('actualUser')
            // actualUser.value = userEmail
        }else {
            alert('Contraseña invalida')
        }

    }
    else {
        alert('Credenciales invalidas')
    }
}
//#endregion

//#region CRUD
let editando = false;
let contactId = "";

const formulario = document.querySelector('#formulario');
const nombreImput = document.querySelector('#nombre');
const apellidoImput = document.querySelector('#apellido');
const emailImput = document.querySelector('#email');
const numeroImput = document.querySelector('#numero');
const btnAgregar = document.querySelector('#btnAgregar');

formulario.addEventListener('submit', formValidation);

function formValidation(e)
{
    e.preventDefault();

    if(nombreImput.value === '' || apellidoImput.value === ''|| emailImput.value === '' || numeroImput.value === '')
    {
        alert('Todos los campos son obligatorios.');
        return;
    }
    if(editando)
    {
        editarContacto();
        editando=false;
    }else 
    {
        const contact = new Contact(nombreImput.value,apellidoImput.value,numeroImput.value,emailImput.value);
       
        let user = getCurrentUser()
        user.contacts.push(contact);

        saveInfo('data', userArray)

        showContacts();
        formulario.reset();

    }
}

function showContacts()
{
    clearHtml();

    let user = getCurrentUser()

    const divContactos = document.querySelector('.div-contactos');

    user.contacts.forEach(contact => {

        let {id, contactName, contactLastName, contactEmail, contactPhoneNumber} = contact

        const parrafo=document.createElement('p');
        parrafo.textContent=`${contactName}-${contactLastName}-${contactEmail}-${contactPhoneNumber}-`
        parrafo.dataset.id=id;

        const editarBoton=document.createElement('button');
        editarBoton.onclick=()=>cargarContacto(contact);
        editarBoton.textContent='Editar';
        editarBoton.classList.add('btn','btn-editar');
        parrafo.append(editarBoton);

        const eliminarBoton=document.createElement('button');
        eliminarBoton.onclick=()=>eliminarContacto(id);
        eliminarBoton.textContent='Eliminar';
        eliminarBoton.classList.add('btn','btn-eliminar');
        parrafo.append(eliminarBoton);
        const hr=document.createElement('hr');

        const emailBoton=document.createElement('button');
        emailBoton.onclick=()=>window.location= "email-handler.html";
        emailBoton.classList.add('btn','btn-email');
        emailBoton.textContent='Email';
        parrafo.append(emailBoton);

        divContactos.appendChild(parrafo);
        divContactos.appendChild(hr);


    })

}

function eliminarContacto(id) 
{
    let user = getCurrentUser()

    user.contacts = user.contacts.filter(contact => {
        return contact.id != id
    })

    saveInfo('data', userArray)
    showContacts();
}

function cargarContacto(contact)
{
    
    const {contactName, contactLastName, contactEmail, contactPhoneNumber} = contact;

    nombreImput.value = contactName;
    apellidoImput.value = contactLastName;
    emailImput.value = contactEmail;
    numeroImput.value = contactPhoneNumber;

    formulario.querySelector('button[type= "submit"]').textContent = 'Actualizar';
    editando= true;
    contactId = contact.id

}


function editarContacto()
{
    let user = getCurrentUser()
    
    user.contacts = user.contacts.map(contact => {
        if (contact.id == contactId){
            contact.id = contact.id;
            contact.contactName = nombreImput.value;
            contact.contactLastName = apellidoImput.value;
            contact.contactEmail = emailImput.value
            contact.contactPhoneNumber = numeroImput.value 
        }

        return contact
    })
    
    saveInfo('data', userArray)
    clearHtml()
    formulario.querySelector('button[type= "submit"]').textContent = 'Agregar';
    
    showContacts();
    formulario.reset();
}


function clearHtml()
{
    const divContactos = document.querySelector('.div-contactos')
    while(divContactos.firstChild)
    {
        divContactos.removeChild(divContactos.firstChild);
    }

}

function logout()
{
    saveInfo('actualUser', '');
    window.location= "index.html";

}
//#endregion



// Region email-handler
const emailForm = document.querySelector('#emailForm');

emailForm.addEventListener('submit', emailform);

function emailform(e)
{
    e.preventDefault();
    window.location= "CRUD.html";
}

//endRegion