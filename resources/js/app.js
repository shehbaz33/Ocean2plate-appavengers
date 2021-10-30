import axios from 'axios'
import moment from 'moment'
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



// Change order status
let statuses = document.querySelectorAll('.status_line')
let order  = document.querySelector('#hiddenInput') ? document.querySelector('#hiddenInput').value : null 
order = JSON.parse(order)
let time = document.createElement('small')
console.log(statuses)

function updateStatus(order){
    statuses.forEach((status) => {
        status.classList.remove('step-completed')
        status.classList.remove('current')
    })
    let statusCompleted = true;
    statuses.forEach((status) => {
        let dataProp = status.dataset.status
        console.log(dataProp)
        if(statusCompleted){
            status.classList.add('step-completed')
        }
        if(dataProp === order.status){
            statusCompleted = false
            time.innerText = moment(order.updatedAt).format('hh:mm A')
            status.appendChild(time)
            if(status.nextElementSibling){
                status.nextElementSibling.classList.add('current')
            }
        }
    })
}

updateStatus(order);

// Socket connection
let socket = io()
// Join socket rooms
if(order){
    socket.emit('join',`order_${order._id}`)
}

initAdmin(socket)

let adminAreaPath = window.location.pathname
if(adminAreaPath.includes('admin')){
    socket.emit('join','adminRoom')
}

socket.on('orderUpdated',(data) => {
    const updatedOrder = {...order}
    updatedOrder.updatedAt = moment().format()
    updatedOrder.status = data.status
    updateStatus(updatedOrder)
    new Noty({
        type:'success',
        timeout: 1000,
        text: 'Order updated',
        progressBar:false,
    }).show();
})
