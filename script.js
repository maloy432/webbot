const tg = window.Telegram.WebApp;

tg.ready();
tg.expand();

const products = [
  {
    id: 1,
    name: "Аккаунт №1",
    country: "ru",
    countryName: "Россия",
    flag: "🇷🇺",
    price: 50,
  },
  {
    id: 2,
    name: "Аккаунт №2",
    country: "ru",
    countryName: "Россия",
    flag: "🇷🇺",
    price: 75,
  },
  {
    id: 3,
    name: "Аккаунт №3",
    country: "uz",
    countryName: "Узбекистан",
    flag: "🇺🇿",
    price: 100,
  },
  {
    id: 4,
    name: "Аккаунт №4",
    country: "kz",
    countryName: "Казахстан",
    flag: "🇰🇿",
    price: 120,
  },
];

let balance = Number(localStorage.getItem("leosin_balance") || 0);
let purchases = JSON.parse(localStorage.getItem("leosin_purchases") || "[]");

function saveData() {
  localStorage.setItem("leosin_balance", balance);
  localStorage.setItem("leosin_purchases", JSON.stringify(purchases));
}

function updateBalance() {
  document.getElementById("balance").textContent = balance;
  document.getElementById("topBalance").textContent = balance;
  document.getElementById("profileBalance").textContent = balance;
}

function showPage(pageName) {
  document.querySelectorAll(".page").forEach((page) => {
    page.classList.toggle("active", page.id === pageName);
  });

  document.querySelectorAll(".nav-item").forEach((button) => {
    button.classList.toggle("active", button.dataset.page === pageName);
  });

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

document.querySelectorAll(".nav-item").forEach((button) => {
  button.addEventListener("click", () => {
    showPage(button.dataset.page);
  });
});

function renderProducts(country = "all") {
  const container = document.getElementById("products");

  const filtered =
    country === "all"
      ? products
      : products.filter((product) => product.country === country);

  container.innerHTML = filtered
    .map(
      (product) => `
        <article class="product">
            <div class="product-flag">${product.flag}</div>

            <div class="product-name">
                ${product.name}
            </div>

            <div class="product-country">
                ${product.countryName}
            </div>

            <div class="product-bottom">
                <div class="product-price">
                    ⭐ ${product.price}
                </div>

                <button
                    class="buy-button"
                    onclick="buyProduct(${product.id})">
                    Купить
                </button>
            </div>
        </article>
    `,
    )
    .join("");
}

document.querySelectorAll(".country").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".country").forEach((item) => {
      item.classList.remove("active");
    });

    button.classList.add("active");

    renderProducts(button.dataset.country);
  });
});

window.buyProduct = function (id) {
  const product = products.find((item) => item.id === id);

  if (!product) {
    return;
  }

  if (balance < product.price) {
    tg.showAlert(
      `Недостаточно Stars.\n\nНужно: ⭐ ${product.price}\nУ вас: ⭐ ${balance}`,
    );

    showPage("topup");
    return;
  }

  balance -= product.price;

  purchases.unshift({
    id: Date.now(),
    name: product.name,
    country: product.countryName,
    price: product.price,
    date: new Date().toLocaleString("ru-RU"),
  });

  saveData();
  updateBalance();
  renderHistory();

  tg.showAlert(`Покупка "${product.name}" оформлена.`);
};

document.querySelectorAll(".star-pack").forEach((button) => {
  button.addEventListener("click", () => {
    const stars = Number(button.dataset.stars);

    tg.showAlert(
      `Вы выбрали пополнение на ⭐ ${stars}.\n\nРеальную оплату Telegram Stars подключим следующим шагом.`,
    );
  });
});

function renderHistory() {
  const container = document.getElementById("purchaseHistory");

  if (!purchases.length) {
    container.innerHTML = `
            <div class="empty-history">
                У вас пока нет покупок
            </div>
        `;

    return;
  }

  container.innerHTML = purchases
    .map(
      (purchase) => `
        <div class="purchase">
            <div>
                <div class="purchase-name">
                    ${purchase.name}
                </div>

                <div class="purchase-date">
                    ${purchase.country} · ${purchase.date}
                </div>
            </div>

            <div class="purchase-price">
                ⭐ ${purchase.price}
            </div>
        </div>
    `,
    )
    .join("");
}

function loadTelegramProfile() {
  const user = tg.initDataUnsafe?.user;

  if (!user) {
    document.getElementById("profileName").textContent = "Гость";
    document.getElementById("profileUsername").textContent =
      "Откройте приложение в Telegram";
    return;
  }

  const fullName = [user.first_name, user.last_name].filter(Boolean).join(" ");

  document.getElementById("profileName").textContent =
    fullName || "Пользователь";

  document.getElementById("profileUsername").textContent = user.username
    ? `@${user.username}`
    : "Без username";

  document.getElementById("telegramId").textContent = user.id || "—";

  document.getElementById("usernameValue").textContent = user.username
    ? `@${user.username}`
    : "—";

  if (user.photo_url) {
    document.getElementById("avatar").src = user.photo_url;
  }
}

updateBalance();
renderProducts();
renderHistory();
loadTelegramProfile();
