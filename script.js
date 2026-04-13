const APIpresent = "https://lista-presentes-0jfc.onrender.com/gifts";
const APIpeople = "http://localhost:3000/peoples";

// =========================
// 🎁 GIFTS
// =========================
function renderGifts() {
  const container = document.getElementById("giftList");
  container.innerHTML = "Carregando...";

  fetch(APIpresent)
    .then(res => res.json())
    .then(gifts => {
      container.innerHTML = "";

      gifts.forEach((gift, index) => {
        const div = document.createElement("div");

        const isReserved = gift.count > 0;
        div.className = "gift" + (isReserved ? " reserved" : "");

        div.innerHTML = `
          <h3>${gift.name}<br>${gift.count}x</h3>
          <button>
            ${isReserved ? "Desmarcar" : "Reservar"}
          </button>
        `;

        container.appendChild(div);

        const btn = div.querySelector("button");

        btn.addEventListener("click", () => {
          btn.innerText = "Carregando...";
          btn.disabled = true;

          fetch(APIpresent + "/" + index, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              action: isReserved ? "decrease" : "increase"
            })
          })
          .then(() => renderGifts());
        });
      });
    });
}

// =========================
// 👥 PEOPLES
// =========================
let peoplesData = [];

function confirmPresence(filter = "") {
  const container = document.getElementById("peopleList");
  container.innerHTML = "Carregando...";

  fetch(APIpeople)
    .then(res => res.json())
    .then(peoples => {
      peoplesData = peoples;
      renderPeopleList(filter);
    });
}

function renderPeopleList(filter = "") {
  const container = document.getElementById("peopleList");
  container.innerHTML = "";

  const filtered = peoplesData.filter(p =>
    p.name.toLowerCase().includes(filter.toLowerCase())
  );

  if (filtered.length === 0) {
    container.innerHTML = "<p>Nenhuma pessoa encontrada 😢</p>";
    return;
  }

  filtered.forEach((people, index) => {
    const realIndex = peoplesData.indexOf(people);

    const div = document.createElement("div");
    const isSelected = people.bool === true;

    div.className = "gift" + (isSelected ? " reserved" : "");

    div.innerHTML = `
      <div class="gift-info">
        <h3>${people.name}</h3>
        ${isSelected ? '<span class="status">Confirmado ✅</span>' : ''}
      </div>

      <button>
        ${isSelected ? "Remover presença" : "Confirmar presença"}
      </button>
    `;

    container.appendChild(div);

    const btn = div.querySelector("button");

    btn.addEventListener("click", () => {
      btn.innerText = "Carregando...";
      btn.disabled = true;

      fetch(APIpeople + "/" + realIndex, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          action: isSelected ? "unselect" : "select"
        })
      })
      .then(() => confirmPresence(filter));
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("searchInput");
  const btn = document.getElementById("searchBtn");

  btn.addEventListener("click", () => {
    confirmPresence(input.value);
  });

  input.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
      confirmPresence(input.value);
    }
  });
});