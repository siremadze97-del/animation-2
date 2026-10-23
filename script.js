let cart = [];

// საწყისი შეფასებების მონაცემები
const ratingsData = {
    1: { sum: 627, count: 128 },
    2: { sum: 456, count: 95 },
    3: { sum: 1050, count: 210 },
    4: { sum: 803, count: 164 },
    5: { sum: 385, count: 82 },
    6: { sum: 539, count: 110 }
};

// შეფასების ფუნქცია (1-დან 5 ვარსკვლავამდე)
function rateFood(foodId, stars) {
    if (!ratingsData[foodId]) return;

    // ვუმატებთ მომხმარებლის შეფასებას
    ratingsData[foodId].sum += stars;
    ratingsData[foodId].count += 1;

    // ახალი საშუალო ქულის გამოთვლა
    const avg = (ratingsData[foodId].sum / ratingsData[foodId].count).toFixed(1);
    
    // ეკრანზე საშუალო ქულის განახლება
    const ratingElement = document.getElementById(`rating-text-${foodId}`);
    if (ratingElement) {
        ratingElement.innerHTML = `⭐ ${avg} <small>(${ratingsData[foodId].count})</small>`;
    }

    // ვარსკვლავების გაფერადება
    const starsContainer = document.getElementById(`stars-${foodId}`);
    if (starsContainer) {
        const starSpans = starsContainer.querySelectorAll('span');
        starSpans.forEach((span, index) => {
            if (index < stars) {
                span.classList.add('active');
            } else {
                span.classList.remove('active');
            }
        });
    }

    alert(`გმადლობთ! თქვენ შეაფასეთ კერძი ${stars} ვარსკვლავით ⭐`);
}

function addToOrder(name, price) {
    const item = cart.find(i => i.name === name);
    if (item) {
        item.count++;
    } else {
        cart.push({ name: name, price: price, count: 1 });
    }
    renderCart();
}

function changeQty(name, delta) {
    const item = cart.find(i => i.name === name);
    if (!item) return;

    item.count += delta;
    if (item.count <= 0) {
        cart = cart.filter(i => i.name !== name);
    }
    renderCart();
}

function deleteItem(name) {
    cart = cart.filter(i => i.name !== name);
    renderCart();
}

function clearAllOrders() {
    cart = [];
    document.getElementById('orderTimeBox').style.display = 'none';
    renderCart();
}

function checkoutOrder() {
    if (cart.length === 0) {
        alert("გთხოვთ, ჯერ დაამატოთ კერძი შეკვეთაში!");
        return;
    }

    const selectedTable = document.getElementById('tableSelect').value;

    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const timeString = `${hours}:${minutes}`;

    document.getElementById('orderTableVal').innerText = `მაგიდა №${selectedTable}`;
    document.getElementById('orderTimeVal').innerText = timeString;
    document.getElementById('orderTimeBox').style.display = 'flex';

    alert(`✅ შეკვეთა გადაიგზავნა სამზარეულოში!\n📍 მაგიდა: №${selectedTable}\n🕒 დრო: ${timeString}`);
}

function renderCart() {
    const orderList = document.getElementById('orderList');
    const subtotalVal = document.getElementById('subtotalVal');
    const grandTotalVal = document.getElementById('grandTotalVal');

    if (cart.length === 0) {
        orderList.innerHTML = '<p class="empty-msg">შეკვეთა ცარიელია</p>';
        subtotalVal.innerText = "0.00 ₾";
        grandTotalVal.innerText = "0.00 ₾";
        return;
    }

    orderList.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.count;
        total += itemTotal;

        const row = document.createElement('div');
        row.className = 'order-item';
        row.innerHTML = `
            <div>
                <div class="item-title">${item.name}</div>
                <div class="item-controls">
                    <button class="qty-btn" onclick="changeQty('${item.name}', -1)">-</button>
                    <span class="qty-count">${item.count}</span>
                    <button class="qty-btn" onclick="changeQty('${item.name}', 1)">+</button>
                    <button class="remove-text-btn" onclick="deleteItem('${item.name}')">წაშლა</button>
                </div>
            </div>
            <div class="item-price">${itemTotal.toFixed(2)} ₾</div>
        `;
        orderList.appendChild(row);
    });

    subtotalVal.innerText = total.toFixed(2) + " ₾";
    grandTotalVal.innerText = total.toFixed(2) + " ₾";
}