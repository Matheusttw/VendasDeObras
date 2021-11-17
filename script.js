let cart = [];
let modalQt = 1;
let modalKey = 0;

const c = (el)=>document.querySelector(el);
const cs = (el)=>document.querySelectorAll(el);

// Listagem das pizzas
obrasJson.map((item, index)=>{
    let obraItem = c('.models .obra-item').cloneNode(true);//
    
    obraItem.setAttribute('data-key', index);
    obraItem.querySelector('.obra-item--img img').src = item.img;
    obraItem.querySelector('.obra-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;
    obraItem.querySelector('.obra-item--name').innerHTML = item.name;
    obraItem.querySelector('.obra-item--desc').innerHTML = item.description;
    
    obraItem.querySelector('a').addEventListener('click', (e)=>{
        e.preventDefault();
        let key = e.target.closest('.obra-item').getAttribute('data-key');
        modalQt = 1;
        modalKey = key;

        c('.obraBig img').src = obrasJson[key].img;
        c('.obraInfo h1').innerHTML = obrasJson[key].name;
        c('.obraInfo--desc').innerHTML = obrasJson[key].description;
        c('.obraInfo--actualPrice').innerHTML = `R$ ${obrasJson[key].price.toFixed(2)}`;
        c('.obraInfo--size.selected').classList.remove('selected');
        cs('.obraInfo--size').forEach((size, sizeIndex)=>{
            if(sizeIndex == 2) {
                size.classList.add('selected');
            }
           // size.querySelector('span').innerHTML = obrasJson[key].sizes[sizeIndex];
        });

        c('.obraInfo--qt').innerHTML = modalQt;

        c('.obraWindowArea').style.opacity = 0;
        c('.obraWindowArea').style.display = 'flex';
        setTimeout(()=>{
            c('.obraWindowArea').style.opacity = 1;
        }, 200);
    });

    c('.obra-area').append( obraItem );
});

// Eventos do MODAL
function closeModal() {
    c('.obraWindowArea').style.opacity = 0;
    setTimeout(()=>{
        c('.obraWindowArea').style.display = 'none';
    }, 500);
}
cs('.obraInfo--cancelButton, .obraInfo--cancelMobileButton').forEach((item)=>{
    item.addEventListener('click', closeModal);
});
c('.obraInfo--qtmenos').addEventListener('click', ()=>{
    if(modalQt > 1) {
        modalQt--;
        c('.obraInfo--qt').innerHTML = modalQt;
    }
});
c('.obraInfo--qtmais').addEventListener('click', ()=>{
    modalQt++;
    c('.obraInfo--qt').innerHTML = modalQt;
});
cs('.obraInfo--size').forEach((size, sizeIndex)=>{
    size.addEventListener('click', (e)=>{
        c('.obraInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');
    });
});
c('.obraInfo--addButton').addEventListener('click', ()=>{
    let size = parseInt(c('.obraInfo--size.selected').getAttribute('data-key'));
    let identifier = obrasJson[modalKey].id+'@'+size;
    let key = cart.findIndex((item)=>item.identifier == identifier);
    if(key > -1) {
        cart[key].qt += modalQt;
    } else {
        cart.push({
            identifier,
            id:obrasJson[modalKey].id,
            size,
            qt:modalQt
        });
    }
    updateCart();
    closeModal();
});

c('.menu-openner').addEventListener('click', () => {
    if(cart.length > 0) {
        c('aside').style.left = '0';
    }
});
c('.menu-closer').addEventListener('click', ()=>{
    c('aside').style.left = '100vw';
});

function updateCart() {
    c('.menu-openner span').innerHTML = cart.length;

    if(cart.length > 0) {
        c('aside').classList.add('show');
        c('.cart').innerHTML = '';

        let subtotal = 0;
        let desconto = 0;
        let total = 0;

        for(let i in cart) {
            let obraItem = obrasJson.find((item)=>item.id == cart[i].id);
            subtotal += obraItem.price * cart[i].qt;

            let cartItem = c('.models .cart--item').cloneNode(true);

            let obraSizeName;
            switch(cart[i].size) {
                case 0:
                    obraSizeName = 'P';
                    break;
                case 1:
                    obraSizeName = 'M';
                    break;
                case 2:
                    obraSizeName = 'G';
                    break;
            }
            let obraName = `${obraItem.name} (${obraSizeName})`;

            cartItem.querySelector('img').src = obraItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = obraName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', ()=>{
                if(cart[i].qt > 1) {
                    cart[i].qt--;
                } else {
                    cart.splice(i, 1);
                }
                updateCart();
            });
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', ()=>{
                cart[i].qt++;
                updateCart();
            });

            c('.cart').append(cartItem);
        }

        desconto = subtotal * 0.1;
        total = subtotal - desconto;

        c('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
        c('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
        c('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;

    } else {
        c('aside').classList.remove('show');
        c('aside').style.left = '100vw';
    }
}