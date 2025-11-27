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
