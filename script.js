const API = "https://lista-presentes-0jfc.onrender.com/gifts";

function renderGifts() {
  const container = document.getElementById("giftList");
  container.innerHTML = "";

  fetch(API)
    .then(res => res.json())
    .then(gifts => {

      gifts.forEach((gift, index) => {
        const div = document.createElement("div");

        const isReserved = gift.count > 0;
        div.className = "gift" + (isReserved ? " reserved" : "");

        div.innerHTML = `
          <h3>${gift.name}<br>${gift.count}x</h3>
          <button class="btn-gift" data-index="${index}">
            ${isReserved ? "Desmarcar" : "Reservar"}
          </button>
        `;

        container.appendChild(div);

        const btn = div.querySelector(".btn-gift");

        btn.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();

          fetch(API + "/" + index, {
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

renderGifts();