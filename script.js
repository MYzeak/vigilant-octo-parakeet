function mesaj() {
    alert("Site kod ile yapıldı!");
}

console.log("Site çalışıyor!");
let cart = [];
let total = 0;

function addToCart(name, price) {
  cart.push({ name, price });
  total += price;
  updateCart();
}

function updateCart() {
  const cartItems = document.getElementById('cart-items');
  const cartCount = document.getElementById('cart-count');
  const totalEl = document.getElementById('total');

  cartItems.innerHTML = '';
  cart.forEach((item, index) => {
    cartItems.innerHTML += `<li>${item.name} - ${item.price}₺ 
      <button onclick="removeItem(${index})">Sil</button></li>`;
  });

  cartCount.textContent = cart.length;
  totalEl.textContent = total;
}

function removeItem(index) {
  total -= cart[index].price;
  cart.splice(index, 1);
  updateCart();
}
// Butona tıklandığında başka sayfaya git
document.addEventListener('DOMContentLoaded', () => {
    const goBtn = document.getElementById('go-to-link');
    goBtn.addEventListener('click', () => {
        // Buraya gitmesini istediğin linki yaz
        window.location.href = "https://sites.google.com/view/rlunity/ana-sayfa";
    });
});
function addToCart(name, price) {
    cart.push({name, price});
    total += price;
    updateCart();
    document.getElementById('cart-panel').classList.add('show'); // panel aç
}

function updateCart() {
    const cartItems = document.getElementById('cart-items');
    const totalEl = document.getElementById('total');
    cartItems.innerHTML = '';
    cart.forEach((item, index) => {
        cartItems.innerHTML += `<li>${item.name} - ${item.price}₺ 
        <button onclick="removeItem(${index})">Sil</button></li>`;
    });
    totalEl.textContent = total;
}

function removeItem(index) {
    total -= cart[index].price;
    cart.splice(index, 1);
    updateCart();
}

// DOM yüklendiğinde butonları bağla
document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.add-btn');
    const closeBtn = document.getElementById('close-cart');
    const cartPanel = document.getElementById('cart-panel');

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const productDiv = btn.parentElement;
            const name = productDiv.querySelector('h3').innerText;
            const price = parseFloat(productDiv.querySelector('.price').innerText);
            addToCart(name, price);
        });
    });

    closeBtn.addEventListener('click', () => {
        cartPanel.classList.remove('show');
    });
});
document.addEventListener("DOMContentLoaded", () => {
    const cartSidebar = document.querySelector(".cart-sidebar");
    const openCart = document.getElementById("open-cart");
    const closeCart = document.getElementById("close-cart");

    openCart.addEventListener("click", () => {
        cartSidebar.classList.add("open");
    });

    closeCart.addEventListener("click", () => {
        cartSidebar.classList.remove("open");
    });
});
