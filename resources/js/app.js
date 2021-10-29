import axios from 'axios'
import Noty from 'noty'
import {initAdmin} from './admin'

let addToCart = document.querySelectorAll('.add-to-cart')
let cartCounter = document.getElementById('cartCounter')

const updateCart = (fish) => {
    axios.post('/update-cart',fish).then(res => {
        cartCounter.innerText = res.data.totalQty
        new Noty({
            type:'success',
            timeout: 1000,
            text: 'Item added to cart',
            progressBar:false,
        }).show();
    }).catch(err => {
        new Noty({
            type:'error',
            timeout: 1000,
            text: 'Something went wrong',
            progressBar:false,
        }).show();
    })
}

addToCart.forEach((btn) => {
    btn.addEventListener('click',(e) => {
        let fish = JSON.parse(btn.dataset.fish)
        updateCart(fish)
    })
})

const alertMsg = document.querySelector('#success-alert')
if(alertMsg){
    setTimeout(() => {
        alertMsg.remove()
    },2000)
}

initAdmin()