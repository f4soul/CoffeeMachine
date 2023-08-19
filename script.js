let money = document.getElementById("money");
let displayInfo = document.getElementById("displayInfo");
let bills = document.querySelectorAll("img[src$='rub.jpg']");
let test = document.getElementById("test");
let bill_acc = document.querySelector("img[src$='_acc.png']");
let balance = document.getElementById("balance");
let changeBox = document.getElementById("changeBox");
let changeButton = document.getElementById("changeButton");

for (let bill of bills) {
	bill.onmousedown = function (e) {
		let bill = e.currentTarget;
		bill.style.position = "absolute";
		bill.style.transform = "rotate(90deg)";
		bill.ondragstart = function () {
			return false;
		};

		document.addEventListener("mousemove", moveElement);
		/* Функции купюр и купюроприемника при взаимодействии */
		bill.onmouseup = function () {
			document.removeEventListener("mousemove", moveElement);
			let bill_top = bill.getBoundingClientRect().top;
			let bill_left = bill.getBoundingClientRect().left;
			let bill_right = bill.getBoundingClientRect().right;

			let bill_acc_top = bill_acc.getBoundingClientRect().top;
			let bill_acc_left = bill_acc.getBoundingClientRect().left;
			let bill_acc_right = bill_acc.getBoundingClientRect().right;
			let bill_acc_bottom =
				bill_acc.getBoundingClientRect().bottom -
				(bill_acc.getBoundingClientRect().height / 3) * 2;
			/* Проверка условий для вычисления координат позиционирования купюры в купюроприемнике */
			if (
				bill_top > bill_acc_top &&
				bill_left > bill_acc_left &&
				bill_right < bill_acc_right &&
				bill_top < bill_acc_bottom
			) {
				/*  Добавление анимации */
				bill.classList.add("animated");
				/* Добавление таймера к анимации */
				setTimeout(function () {
					bill.hidden = true;
				}, 380);
				money.value = +money.value + +bill.dataset.billValue;
				balance.innerHTML = `<i class="fas fa-piggy-bank"></i> Баланс: ${money.value} руб.`;
			}
		};
		/* Возможность перетаскивать купюры */
		function moveElement(event) {
			let x = event.clientX - 148;
			let y = event.clientY - 60;
			bill.style.top = y + "px";
			bill.style.left = x + "px";
		}
	};
}
/* Запуск прогрессбара */
function startProgressBar(coffeeName) {
	let i = 0;
	let progressBar = document.querySelector(".progress-bar");
	progressBar.parentElement.hidden = false;
	displayInfo.innerHTML = `<i class="fa-solid fa-hourglass fa-spin fa-xl"></i> Ваш ${coffeeName} готовится`;

	function progress() {
		i++;
		progressBar.style.width = i + "%";
		if (i == 100) {
			clearInterval(timerId);
			progressBar.parentElement.hidden = true;
			displayInfo.innerHTML = `<i class="fa-solid fa-face-smile-beam fa-xl"></i> Ваш ${coffeeName} готов!`;
		} else if (i == 60) {
			displayInfo.innerHTML = `<i class="fa-solid fa-hourglass-end fa-spin fa-xl"></i> Ваш ${coffeeName} почти готов!`;
		}
	}
	let timerId = setInterval(progress, 100);
}

function getCoffee(price, name) {
	if (money.value >= price) {
		money.value -= price;
		balance.innerHTML = `<i class="fas fa-piggy-bank"></i> Баланс: ${money.value} руб.`;
		startProgressBar(name);
	} else {
		displayInfo.innerHTML =
			"<i class='fa-solid fa-face-sad-tear fa-xl'></i> Не хватает средств на " +
			name;
	}
}

function getChange(num) {
	let coins = [10, 5, 2, 1];
	for (let i = 0; i < coins.length; i++) {
		const coin = coins[i];
		while (num >= coin) {
			console.log(coin);
			let top = getRandom(
				0,
				changeBox.getBoundingClientRect().height - 65
			);
			let left = getRandom(
				0,
				changeBox.getBoundingClientRect().width - 65
			);

			let coinImage = document.createElement("img");
			coinImage.src = `./img/${coin}rub.png`;
			coinImage.style.top = `${top}px`;
			coinImage.style.left = `${left}px`;
			coinImage.classList.add("coin");
			/* Обработчик события клика на монету */
			coinImage.addEventListener("click", function () {
				this.style.display = "none";
			});
			changeBox.appendChild(coinImage);
			num -= coin;
		}
	}
	/* Обнуление баланса */
	money.value = 0;
	balance.innerHTML = `<i class="fas fa-piggy-bank"></i> Баланс: ${money.value} руб.`;
	/* Блокировка кнопки выдачи сдачи */
	let changeButton = document.getElementById("changeButton");
	if (money.value === 0) {
		changeButton.disabled = true;
	} else {
		changeButton.disabled = false;
	}
}

function getRandom(min, max) {
	return Math.random() * (max - min) + min;
}
