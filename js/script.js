let username = "";
let colorId = null;
let pickedAccount = null;
let pickedPartner = null;
let currentDuet = null;

let userData = {};

const userId = localStorage.getItem("userId");

const windows = {
	gettingStarted: document.querySelector(".getting-started"),
	createAccount: document.querySelector(".create-account"),
	pickColor: document.querySelector(".pick-color"),
	pickAccount: document.querySelector(".pick-account"),
	choosePartner: document.querySelector(".choose-partner"),
	whatsNext: document.querySelector(".whats-next"),
	addFilm: document.querySelector(".add-film"),
	pickFilm: document.querySelector(".pick-film"),
};
if (!userId) {
	toggleWindowVisibility(windows.gettingStarted);
} else {
	async function init() {
		const loader = document.querySelector(".wrapper-loader");
		loader.classList.remove("dn");

		userData = await getUserData();
		loader.classList.add("dn");

		const p = document.querySelector(".header-profile");

		p.classList.remove("dn");

		const profile = document.querySelector(".header-profile .color-item");

		profile.classList.add(`color-item-${userData.color}`);
		document.querySelector(".header-profile__name span").textContent = userData.name;
		profile.textContent = userData.name.charAt(0).toUpperCase();

		document.querySelector(".content").classList.remove("dn");
	}

	init();
}

const buttons = {
	haveAccount: document.getElementById("haveAccountButton"),
	newAccount: document.getElementById("newAccountButton"),
	newAccount2: document.getElementById("newAccountButton2"),
	newAccountNext: document.getElementById("createAccountGoToColors"),
	newAccountReady: document.getElementById("createAccountReady"),
	pickAccount: document.getElementById("pickAccountButton"),
	exit: document.getElementById("exit"),
	start: document.getElementById("start"),
	back: document.getElementById("back"),
	pickPartner: document.getElementById("pickPartner"),
	addFilm: document.getElementById("addFilm"),
	addFilmAdd: document.getElementById("addFilmAdd"),
	addFilmBack: document.getElementById("addFilmBack"),
	pickFilm: document.getElementById("pickFilm"),
	generate: document.getElementById("generate"),
	mainBack: document.getElementById("bbb"),
};

buttons.mainBack.addEventListener("click", () => {
	location.reload();
});

buttons.generate.addEventListener("click", async () => {
	const generateFilm = (duet) => {
		const sortedFilms = duet.items.filter((item) => !duet.watched.includes(item.filmId));
		const length = sortedFilms.length;
		return sortedFilms[Math.floor(Math.random() * length)];
	};

	const result = generateFilm(currentDuet);

	let data = {};

	toggleWindowVisibility(windows.pickFilm);

	document.querySelector(".result").classList.remove("hidden");

	setTimeout(() => {
		document.querySelector(".result__placeholder-1").classList.add("hidden");
	}, 2000);
	setTimeout(() => {
		document.querySelector(".result__placeholder-3").classList.add("hidden");
	}, 3500);
	setTimeout(() => {
		document.querySelector(".result__placeholder-2").classList.add("hidden");
	}, 5000);
	setTimeout(() => {
		document.querySelector(".result__container").classList.remove("hidden");
	}, 6000);
	setTimeout(() => {
		document.querySelector(".result .button").classList.remove("hidden");
	}, 7000);

	await fetch("https://api.jsonbin.io/v3/b/66fdf2c8e41b4d34e43c095e/latest", {
		method: "GET",
		headers: {
			"X-Master-Key": "$2a$10$1iVWN8E.ZFac5sfiE4wAJO6IzfmJeALxM2T2waWuc5d7KVjAkUtbe",
			"X-Access-Key": "$2a$10$a0O7L9oKDQt3S1pvvdZPcO8lIdCTFCODkVy8hcGOh5eTMQaCbEXZ6",
		},
	})
		.then((response) => response.json())
		.then((response) => {
			data = response.record;
		});

	const elem = document.createElement("div");
	const name = document.createElement("div");
	const owner = document.createElement("div");

	elem.classList.add("film");

	owner.classList.add("color-item");
	owner.classList.add(`color-item-${data.users[result.owner].color}`);
	owner.textContent = data.users[result.owner].name.charAt(0).toUpperCase();

	name.classList.add("film__name");
	name.textContent = data.items.find((itemItem) => itemItem.id === result.filmId).name;

	elem.appendChild(name);
	elem.append(owner);

	document.querySelector(".result__container").appendChild(elem);

	const newDuet = {
		...currentDuet,
		watched: [...currentDuet.watched, result.filmId],
	};

	const newDuets = data.duets.map((duet) => (duet.id === newDuet.id ? newDuet : duet));

	await fetch("https://api.jsonbin.io/v3/b/66fdf2c8e41b4d34e43c095e", {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
			"X-Master-Key": "$2a$10$1iVWN8E.ZFac5sfiE4wAJO6IzfmJeALxM2T2waWuc5d7KVjAkUtbe",
			"X-Access-Key": "$2a$10$a0O7L9oKDQt3S1pvvdZPcO8lIdCTFCODkVy8hcGOh5eTMQaCbEXZ6",
		},
		body: JSON.stringify({
			...data,
			duets: newDuets,
		}),
	});

	currentDuet = newDuet;
});

buttons.addFilmBack.addEventListener("click", () => {
	toggleWindowVisibility(windows.whatsNext);

	if (currentDuet.items.filter((item) => !currentDuet.watched.includes(item.filmId)).length > 0) {
		document.querySelector(".pick-film-button").classList.remove("dn");
	}
});

buttons.addFilmAdd.addEventListener("click", async () => {
	const input = document.getElementById("filmName");
	const value = input.value;

	input.classList.remove("error");

	if (!value) {
		input.classList.add("error");
	} else {
		let data = {};

		buttons.addFilmAdd.querySelector(".loader").classList.remove("dn");
		windows.addFilm.classList.add("pen");

		await fetch("https://api.jsonbin.io/v3/b/66fdf2c8e41b4d34e43c095e/latest", {
			method: "GET",
			headers: {
				"X-Master-Key": "$2a$10$1iVWN8E.ZFac5sfiE4wAJO6IzfmJeALxM2T2waWuc5d7KVjAkUtbe",
				"X-Access-Key": "$2a$10$a0O7L9oKDQt3S1pvvdZPcO8lIdCTFCODkVy8hcGOh5eTMQaCbEXZ6",
			},
		})
			.then((response) => response.json())
			.then((response) => {
				data = response.record;
			});

		const newItemId = data.items.length > 0 ? data.items[data.items.length - 1].id + 1 : 0;

		const newItem = {
			id: newItemId,
			name: value,
		};

		const newDuet = {
			...currentDuet,
			items: [...currentDuet.items, { filmId: newItemId, owner: userData.id }],
		};

		const newDuets = data.duets.map((duet) => (duet.id === newDuet.id ? newDuet : duet));

		await fetch("https://api.jsonbin.io/v3/b/66fdf2c8e41b4d34e43c095e", {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				"X-Master-Key": "$2a$10$1iVWN8E.ZFac5sfiE4wAJO6IzfmJeALxM2T2waWuc5d7KVjAkUtbe",
				"X-Access-Key": "$2a$10$a0O7L9oKDQt3S1pvvdZPcO8lIdCTFCODkVy8hcGOh5eTMQaCbEXZ6",
			},
			body: JSON.stringify({
				...data,
				items: [...data.items, newItem],
				duets: newDuets,
			}),
		});

		input.value = "";
		currentDuet = newDuet;

		buttons.addFilmAdd.querySelector(".loader").classList.add("dn");
		windows.addFilm.classList.remove("pen");
	}
});

buttons.addFilm.addEventListener("click", () => {
	toggleWindowVisibility(windows.addFilm);
});

buttons.pickFilm.addEventListener("click", async () => {
	toggleWindowVisibility(windows.pickFilm);

	let data = {};

	await fetch("https://api.jsonbin.io/v3/b/66fdf2c8e41b4d34e43c095e/latest", {
		method: "GET",
		headers: {
			"X-Master-Key": "$2a$10$1iVWN8E.ZFac5sfiE4wAJO6IzfmJeALxM2T2waWuc5d7KVjAkUtbe",
			"X-Access-Key": "$2a$10$a0O7L9oKDQt3S1pvvdZPcO8lIdCTFCODkVy8hcGOh5eTMQaCbEXZ6",
		},
	})
		.then((response) => response.json())
		.then((response) => {
			data = response.record;
		});

	document.querySelector(".pick-film .pick-account__loading").classList.add("dn");

	let counter = 1;

	[...currentDuet.items].forEach((item) => {
		const elem = document.createElement("div");
		const name = document.createElement("div");
		const owner = document.createElement("div");

		elem.classList.add("film");

		if (currentDuet.watched.includes(item.filmId)) {
			elem.classList.add("film_watched");
		}

		owner.classList.add("color-item");
		owner.classList.add(`color-item-${data.users[item.owner].color}`);
		owner.textContent = data.users[item.owner].name.charAt(0).toUpperCase();

		name.classList.add("film__name");
		name.textContent = `${counter}. ${data.items.find((itemItem) => itemItem.id === item.filmId).name}`;

		elem.appendChild(name);
		elem.append(owner);

		document.querySelector(".pick-film .modal-content").appendChild(elem);

		counter++;
	});
});

buttons.pickPartner.addEventListener("click", async () => {
	if (!pickedPartner) {
		document.querySelector(".choose-partner .error-message").classList.remove("dn");
	} else {
		toggleWindowVisibility(windows.choosePartner);

		let newDuet = [];

		function getDuet(duets, firstUser, secondUser) {
			return duets.find(
				(duet) =>
					(duet.firstUser === firstUser || duet.firstUser === secondUser) &&
					(duet.secondUser === firstUser || duet.secondUser === secondUser)
			);
		}

		let data = {};

		await fetch("https://api.jsonbin.io/v3/b/66fdf2c8e41b4d34e43c095e/latest", {
			method: "GET",
			headers: {
				"X-Master-Key": "$2a$10$1iVWN8E.ZFac5sfiE4wAJO6IzfmJeALxM2T2waWuc5d7KVjAkUtbe",
				"X-Access-Key": "$2a$10$a0O7L9oKDQt3S1pvvdZPcO8lIdCTFCODkVy8hcGOh5eTMQaCbEXZ6",
			},
		})
			.then((response) => response.json())
			.then((response) => {
				data = response.record;
			});

		const duetId = data.duets.length > 0 ? data.duets[data.duets.length - 1].id + 1 : 0;
		const duet = getDuet(data.duets, userData.id, pickedPartner.id);

		if (!duet) {
			newDuet = {
				id: duetId,
				firstUser: userData.id,
				secondUser: pickedPartner.id,
				items: [],
				watched: [],
			};

			await fetch("https://api.jsonbin.io/v3/b/66fdf2c8e41b4d34e43c095e", {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					"X-Master-Key": "$2a$10$1iVWN8E.ZFac5sfiE4wAJO6IzfmJeALxM2T2waWuc5d7KVjAkUtbe",
					"X-Access-Key": "$2a$10$a0O7L9oKDQt3S1pvvdZPcO8lIdCTFCODkVy8hcGOh5eTMQaCbEXZ6",
				},
				body: JSON.stringify({
					...data,
					duets: [...data.duets, newDuet],
				}),
			});

			currentDuet = newDuet;
		} else {
			currentDuet = duet;
		}

		toggleWindowVisibility(windows.whatsNext);

		if (currentDuet.items.filter((item) => !currentDuet.watched.includes(item.filmId)).length > 0) {
			document.querySelector(".pick-film-button").classList.remove("dn");
		}
	}
});

buttons.exit.addEventListener("click", () => {
	username = "";
	colorId = null;
	pickedAccount = null;
	userData = {};
	localStorage.removeItem("userId");
	location.reload();
});

buttons.haveAccount.addEventListener("click", () => {
	toggleWindowVisibility(windows.pickAccount);

	async function getData() {
		const loader = document.querySelector(".pick-account__loading");

		let users = [];

		await fetch("https://api.jsonbin.io/v3/b/66fdf2c8e41b4d34e43c095e/latest", {
			method: "GET",
			headers: {
				"X-Master-Key": "$2a$10$1iVWN8E.ZFac5sfiE4wAJO6IzfmJeALxM2T2waWuc5d7KVjAkUtbe",
				"X-Access-Key": "$2a$10$a0O7L9oKDQt3S1pvvdZPcO8lIdCTFCODkVy8hcGOh5eTMQaCbEXZ6",
			},
		})
			.then((response) => response.json())
			.then((response) => {
				users = response.record.users;
			});

		if (users.length === 0) {
			document.querySelector(".pick-account h1.new").classList.remove("dn");
			document.querySelector(".pick-account .modal-content.new").classList.remove("nm");
			document.querySelector(".pick-account .modal-content.new").classList.remove("dn");
		} else {
			document.querySelector(".pick-account h1.pick").classList.remove("dn");
			document.querySelector(".pick-account .modal-content.pick").classList.remove("nm");
			document.querySelector(".pick-account .modal-content.pick").classList.remove("dn");
			document.querySelector(".pick-account #pickAccountButton").classList.remove("dn");

			users.forEach((user) => {
				const elem = document.createElement("div");
				const img = document.createElement("div");
				const name = document.createElement("div");

				elem.classList.add("user");

				img.classList.add("color-item");
				img.classList.add(`color-item-${user.color}`);
				img.textContent = user.name.charAt(0).toUpperCase();

				name.classList.add("user__name");
				name.textContent = user.name;

				elem.appendChild(img);
				elem.appendChild(name);

				elem.addEventListener("click", () => {
					if (document.querySelector(".user.picked")) document.querySelector(".user.picked").classList.remove("picked");

					elem.classList.add("picked");
					pickedAccount = user;
				});

				document.querySelector(".pick-account .modal-content.pick").appendChild(elem);
			});
		}

		loader.classList.add("dn");
	}

	getData();
});

const inputs = {
	username: document.getElementById("usernameInput"),
};

buttons.back.addEventListener("click", () => {
	location.reload();
});

buttons.start.addEventListener("click", () => {
	document.querySelector(".content").classList.add("hidden");
	toggleWindowVisibility(windows.choosePartner);

	async function getUsers() {
		let users = [];

		await fetch("https://api.jsonbin.io/v3/b/66fdf2c8e41b4d34e43c095e/latest", {
			method: "GET",
			headers: {
				"X-Master-Key": "$2a$10$1iVWN8E.ZFac5sfiE4wAJO6IzfmJeALxM2T2waWuc5d7KVjAkUtbe",
				"X-Access-Key": "$2a$10$a0O7L9oKDQt3S1pvvdZPcO8lIdCTFCODkVy8hcGOh5eTMQaCbEXZ6",
			},
		})
			.then((response) => response.json())
			.then((response) => {
				users = response.record.users;
			});

		if (users.length < 2) {
			document.querySelector(".choose-partner h1.havent").classList.remove("dn");
			document.querySelector(".choose-partner > button.havent").classList.remove("dn");
		} else {
			document.querySelector(".choose-partner h1.have").classList.remove("dn");
			document.querySelector(".choose-partner .modal-content.have").classList.remove("dn");
			document.querySelector(".choose-partner > button.have").classList.remove("dn");

			users
				.filter((user) => user.id !== userData.id)
				.forEach((user) => {
					const elem = document.createElement("div");
					const img = document.createElement("div");
					const name = document.createElement("div");

					elem.classList.add("user");

					img.classList.add("color-item");
					img.classList.add(`color-item-${user.color}`);
					img.textContent = user.name.charAt(0).toUpperCase();

					name.classList.add("user__name");
					name.textContent = user.name;

					elem.appendChild(img);
					elem.appendChild(name);

					elem.addEventListener("click", () => {
						if (document.querySelector(".user.picked")) document.querySelector(".user.picked").classList.remove("picked");

						elem.classList.add("picked");
						pickedPartner = user;
					});

					document.querySelector(".choose-partner .modal-content.have").appendChild(elem);
				});
		}

		document.querySelector(".choose-partner .pick-account__loading").classList.add("dn");
	}

	getUsers();
});

const colorItems = document.querySelectorAll(".color-item");
const colorContainer = document.querySelector(".pick-color .modal-content");

buttons.pickAccount.addEventListener("click", () => {
	if (!pickedAccount) {
		document.querySelector(".pick-account .error-message").classList.remove("dn");
	} else {
		toggleWindowVisibility(windows.pickAccount);

		const profile = document.querySelector(".header-profile .color-item");
		const p = document.querySelector(".header-profile");
		p.classList.remove("dn");
		document.querySelector(".header-profile__name span").textContent = pickedAccount.name;
		profile.classList.add(`color-item-${pickedAccount.color}`);
		profile.textContent = pickedAccount.name.charAt(0).toUpperCase();
		localStorage.setItem("userId", pickedAccount.id);
		document.querySelector(".content").classList.remove("dn");
		userData = pickedAccount;
	}
});

colorContainer.addEventListener("click", (event) => {
	if (event.target.closest(".color-item")) {
		const item = event.target.closest(".color-item");

		if (document.querySelector(".color-item.picked")) document.querySelector(".color-item.picked").classList.remove("picked");

		item.classList.add("picked");
		colorId = +item.getAttribute("id").match(/\d/gm)[0];
	}
});

buttons.newAccountReady.addEventListener("click", async () => {
	if (!colorId) {
		document.querySelector(".pick-color .error-message").classList.remove("dn");
	} else {
		buttons.newAccountReady.querySelector(".loader").classList.remove("dn");

		let newUsers = [];
		let data = {};

		await fetch("https://api.jsonbin.io/v3/b/66fdf2c8e41b4d34e43c095e/latest", {
			method: "GET",
			headers: {
				"X-Master-Key": "$2a$10$1iVWN8E.ZFac5sfiE4wAJO6IzfmJeALxM2T2waWuc5d7KVjAkUtbe",
				"X-Access-Key": "$2a$10$a0O7L9oKDQt3S1pvvdZPcO8lIdCTFCODkVy8hcGOh5eTMQaCbEXZ6",
			},
		})
			.then((response) => response.json())
			.then((response) => {
				data = response.record;
			});

		const users = data.users.sort((a, b) => a.id - b.id);
		const newUserId = users.length > 0 ? users[users.length - 1].id + 1 : 0;
		const newUser = {
			id: newUserId,
			name: username,
			color: colorId,
		};

		newUsers = [...users, newUser];

		await fetch("https://api.jsonbin.io/v3/b/66fdf2c8e41b4d34e43c095e", {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				"X-Master-Key": "$2a$10$1iVWN8E.ZFac5sfiE4wAJO6IzfmJeALxM2T2waWuc5d7KVjAkUtbe",
				"X-Access-Key": "$2a$10$a0O7L9oKDQt3S1pvvdZPcO8lIdCTFCODkVy8hcGOh5eTMQaCbEXZ6",
			},
			body: JSON.stringify({
				...data,
				users: newUsers,
			}),
		});

		toggleWindowVisibility(windows.pickColor);

		const p = document.querySelector(".header-profile");

		p.classList.remove("dn");

		const profile = document.querySelector(".header-profile .color-item");

		profile.classList.add(`color-item-${newUser.color}`);
		profile.textContent = newUser.name.charAt(0).toUpperCase();
		document.querySelector(".header-profile__name span").textContent = newUser.name;
		localStorage.setItem("userId", newUserId);
		document.querySelector(".content").classList.remove("dn");
		userData = newUser;
	}
});

document.querySelector(".header-profile").addEventListener("click", () => {
	document.querySelector(".header-profile").classList.toggle("active");
	document.querySelector(".header-profile__name span").classList.toggle("hidden");
});

buttons.newAccount.addEventListener("click", createAccount);
buttons.newAccount2.addEventListener("click", createAccount);

function createAccount() {
	toggleWindowVisibility(windows.createAccount);
}

buttons.newAccountNext.addEventListener("click", () => {
	inputs.username.classList.remove("error");

	const value = inputs.username.value;

	if (!value) {
		inputs.username.classList.add("error");
	} else {
		username = value;
		toggleWindowVisibility(windows.pickColor);
		[...colorItems].forEach((item) => {
			const isOneChar = username.split(" ").length === 1;

			item.textContent = isOneChar ? username.charAt(0).toUpperCase() : username.split(" ").slice(0, 1).join("").charAt(0);
		});
	}
});

async function getUserData() {
	let user = {};

	await fetch("https://api.jsonbin.io/v3/b/66fdf2c8e41b4d34e43c095e/latest", {
		method: "GET",
		headers: {
			"X-Master-Key": "$2a$10$1iVWN8E.ZFac5sfiE4wAJO6IzfmJeALxM2T2waWuc5d7KVjAkUtbe",
			"X-Access-Key": "$2a$10$a0O7L9oKDQt3S1pvvdZPcO8lIdCTFCODkVy8hcGOh5eTMQaCbEXZ6",
		},
	})
		.then((response) => response.json())
		.then((response) => {
			user = response.record.users.find((user) => user.id === +userId);
		});

	return user;
}

function toggleWindowVisibility(window) {
	Object.values(windows).forEach((item) => item !== window && item.classList.add("hidden"));

	window.classList.toggle("hidden");
}
