async function renderGifts() {
  const container = document.getElementById("giftList");

  try {
    container.innerHTML = "<p>Carregando presentes...</p>";

    const response = await fetch("gifts.json");

    if (!response.ok) {
      throw new Error("Erro ao carregar gifts.json");
    }

    const gifts = await response.json();

    container.innerHTML = "";

    if (gifts.length === 0) {
      container.innerHTML = "<p>Nenhum presente encontrado.</p>";
      return;
    }

    gifts.forEach(gift => {
      const div = document.createElement("div");
      div.className = "gift";

      div.innerHTML = `
        <h3>${gift.name}</h3>
      `;

      container.appendChild(div);
    });

  } catch (error) {
    console.error(error);
    container.innerHTML = "<p>Erro ao carregar os presentes.</p>";
  }
}

document.addEventListener("DOMContentLoaded", renderGifts);