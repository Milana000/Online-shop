//variables
const search = document.getElementById('search');
const searchInpt = document.getElementById('search-device')
const titles = document.querySelectorAll('.card h1');
const menu = document.getElementById('devices-menu');
const shop = document.getElementById('online-shop');
const devices = document.querySelectorAll('.devices');
const tbody = document.querySelector('#cart-content tbody');
const devicesNum = document.getElementById('devices-number');
const shoppingCart = document.getElementById('shopping-cart');
const clearCartBtn = document.getElementById('clear-cart');
const btn = document.getElementsByClassName('btn');
const hiddenMenu = document.getElementById('menu');
const mobBtn = document.querySelector('.mob-btn');
const form = document.getElementById('form');




// listeners
search.addEventListener('submit', searchHandler);
menu.addEventListener('click', menuHandler);
window.addEventListener('scroll', scrollHandler);
shop.addEventListener('click', addDeviceToCart);
shoppingCart.addEventListener('click', removeItemFromUI);
clearCartBtn.addEventListener('click', clearCart)
mobBtn.addEventListener('click', mobBtnClickhandler)
hiddenMenu.addEventListener('click', removeActive)
form.addEventListener('submit', submitHandler)


//FUNCTIONS CB

//1 - MOBILNI UREDJAJI - na klik u dropdown meniju da prebaci na element i digne meni
function mobBtnClickhandler(ev) {
    ev.preventDefault()
    if(mobBtn.classList.contains('active')) {
        mobBtn.classList.remove('active');
        hiddenMenu.classList.remove('active')
    } else{
        mobBtn.classList.add('active')
        hiddenMenu.classList.add('active')
    }
}
function removeActive() {
    mobBtn.classList.remove('active');
        hiddenMenu.classList.remove('active')
}

//2 - minimalno 3 karaktera za sortiranje kartica
function searchHandler(ev) {
    ev.preventDefault();
    let inptValue = searchInpt.value;
    if (inptValue.length > 2) {
        titles.forEach(item => {
            if (item.textContent.toLowerCase().includes(inptValue.toLowerCase())) {
                item.parentElement.parentElement.style.display = 'block'
            } else {
                item.parentElement.parentElement.style.display = 'none'
            }
            searchInpt.value = ''
        })
    } else {
        alert('You have to put at least three characters')
    }
}

//3 - gugmici za filtriranje uredjaja: all, speakers, phones..

function menuHandler(ev) {
    ev.preventDefault();
    if (ev.target.tagName.toLowerCase() !== 'a') {
        return
    }
    let target = ev.target.dataset.target;
    devices.forEach(item => {
        if (item.classList.contains(target)) {
            item.style.display = 'block'
        } else {
            item.style.display = 'none'
        }
    })
}


//4 - da nam izbaci kartice na 70% skrola

function scrollHandler() {
    let viewportHeight = window.innerHeight;
    devices.forEach(item => {
        if (item.getBoundingClientRect().top <= viewportHeight * 0.7) {
            item.style.opacity = 1;
        } else {
            item.style.opacity = 0;
        }
    })
}

//5 - listener na online-shopu koji drzi sve kartice a uredjajima, da ih mozemo ubaciti u korpu

function addDeviceToCart(ev) {
    ev.preventDefault();
    if (ev.target.classList.contains('add')) {
        let devices = getFromStorage('devices');
        let device = {
            id: ev.target.dataset.id,
            src: ev.target.parentElement.parentElement.querySelector('img').src,
            title: ev.target.parentElement.parentElement.querySelector('h1').textContent,
            price: ev.target.parentElement.parentElement.querySelector('.price').textContent
        }
        let check = devices.filter(item => {
            return item.id === device.id
        });
        if (check.length !== 0) {
            alert('You have already selected this device')
            return
        } else {
            devices.push(device)
            setToStorage(device)
            addDevice(devices)
        }
    } else {
        return
    }
}

//6 - button X koji smo dodali pomocu JS, da se ukloni uredjaj iz korpe

function removeItemFromUI(ev) {
    ev.preventDefault();
    if (ev.target.classList.contains('remove')) {
        ev.target.parentElement.parentElement.remove();
        removeItem(ev.target.dataset.id)

        const devices = getFromStorage('devices');
        const numText = cartText(devices);
        devicesNum.textContent = numText;
    } else {
        return
    }
}

//7 - Da uklonimo sve iz korpe
function clearCart(ev) {
    ev.preventDefault();
    // pocisti ui
    removeAllFromCart(tbody.children)
    removeFromStorage('devices')

    let devices = getFromStorage('devices');
    const numText = cartText(devices);
    devicesNum.textContent = numText;
}



// FUNCTIONS

//1 - da se u korpi formira novi red sa ovim podacima, kada korisnik doda uredjaj u korpu

function cartUI(device) {
    const tr = document.createElement('tr');
    tr.innerHTML = `
    <td><img src="${device.src}" alt="${device.title}" width="100"></td>
    <td>${device.title}</td>
    <td>${device.price}</td>
    <td><button class="remove" data-id="${device.id}">X</button></td>
    `
    tbody.appendChild(tr);
}

//2 - da pristupimo svakoj stavci devices i da nam se se formira novi red
// i da nam zavisno od duzine ispise text ispod korpe

function addDevice(devices) {
    //da pocistimo sve da ne bi duplalo
    removeAllFromCart(tbody.children)
    devices.forEach(item => {
        cartUI(item)
    });

    const numText = cartText(devices)
    devicesNum.textContent = numText;
}


// 3 STORAGE
function getFromStorage(devices) {
    let storage;
    if (localStorage.getItem(devices) === null) {
        storage = []
    } else {
        storage = JSON.parse(localStorage.getItem(devices))
    }
    return storage
}

function setToStorage(device) {
    let devices = getFromStorage('devices');
    devices.push(device);
    localStorage.setItem('devices', JSON.stringify(devices))
}

// 4 - uklanjanje iz niza
function removeItem(id) {
    const devices = getFromStorage('devices');
    const filteredDevices = devices.filter(item => {
        return item.id !== id
    })
    localStorage.setItem('devices', JSON.stringify(filteredDevices))
}


// 5 - da ispod korpe prikaze broj uredjaja koje smo dodali
function cartText(devices) {
    let numText;
    if (devices.length === 0) {
        numText = 'No devices';
    } else if (devices.length === 1) {
        numText = '1 device'
    } else {
        numText = `${devices.length} devices`
    }
    return numText
}

//6 da uklonimo sve iz korpe

function removeAllFromCart(childs) {
    Array.from(childs).forEach(item => {
        item.remove()
    })
}

//7 dauklonimo ve iz storage
function removeFromStorage(storage) {
    localStorage.removeItem(storage)
}

//8 form

function submitHandler(e) {
    e.preventDefault();
    const formData = new FormData();
    formData.append('email',document.getElementById('email').value)
    console.log([...formData])
}