const c = (elem) => document.querySelector(elem);
const cs = (elem) => document.querySelectorAll(elem);
let modalQtd = 1;
let cart = [];
let modalKey = 0;

//listagem das pizzas
pizzaJson.map((item, index) => {
  let pizzaItem = c(".models .pizza-item").cloneNode(true);
  //seta um data-key com o index para cada elemento
  pizzaItem.setAttribute("data-key", index);
  //preencher as informações em pizza item
  pizzaItem.querySelector(".pizza-item--img img").src = item.img;
  //innerHTML substitui o valor
  pizzaItem.querySelector(
    ".pizza-item--price",
  ).innerHTML = `R$ ${item.price.toFixed(2)}`;
  pizzaItem.querySelector(".pizza-item--name").innerHTML = item.name;
  pizzaItem.querySelector(".pizza-item--desc").innerHTML = item.description;

  //Abrindo o modal
  pizzaItem.querySelector("a").addEventListener("click", (e) => {
    e.preventDefault();
    //a partir do A ele procura o elemento mais próximo com e pegar o atibuto data-key
    let key = e.target.closest(".pizza-item").getAttribute("data-key");
    modalQtd = 1;
    modalKey = key;

    c(".pizzaInfo--qt").innerHTML = modalQtd;

    c(".pizzaBig img").src = pizzaJson[key].img;
    c(".pizzaInfo h1").innerHTML = pizzaJson[key].name;
    c(".pizzaInfo--desc").innerHTML = pizzaJson[key].description;
    c(".pizzaInfo--actualPrice").innerHTML = `R$ ${pizzaJson[key].price.toFixed(
      2,
    )}`;
    c(".pizzaInfo--size.selected").classList.remove("selected");

    cs(".pizzaInfo--size").forEach((size, sizeIndex) => {
      if (sizeIndex == 2) {
        size.classList.add("selected");
      }
      size.querySelector("span").innerHTML = pizzaJson[key].sizes[sizeIndex];
    });

    c(".pizzaWindowArea").style.opacity = 0;
    //colca o display flex para mostrar na tela
    c(".pizzaWindowArea").style.display = "flex";
    //espera para colocar a opacidade como 1
    setTimeout(() => {
      c(".pizzaWindowArea").style.opacity = 1;
    }, 200);
  });

  c(".pizza-area").append(pizzaItem);
});

//eventos do modal

const closeModal = () => {
  c(".pizzaWindowArea").style.opacity = 0;
  //espera para closeModal o modal para dar efeito
  setTimeout(() => {
    c(".pizzaWindowArea").style.display = "none";
  }, 200);
};
//Botão cancelar e voltar com a ação de click para fechar
cs(".pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton").forEach(
  (botao) => {
    botao.addEventListener("click", closeModal);
  },
);

//açao de botao mais ou menos
c(".pizzaInfo--qtmais").addEventListener("click", () => {
  modalQtd++;

  c(".pizzaInfo--qt").innerHTML = modalQtd;
});

c(".pizzaInfo--qtmenos").addEventListener("click", () => {
  modalQtd--;
  if (modalQtd >= 1) {
    c(".pizzaInfo--qt").innerHTML = modalQtd;
  } else modalQtd = 1;
});

//ação de tamanho seleção das pizzas quando o modal está aberto
cs(".pizzaInfo--size").forEach((size, sizeIndex) => {
  size.addEventListener("click", (e) => {
    c(".pizzaInfo--size.selected").classList.remove("selected");
    size.classList.add("selected");
  });
});

//ação do carrinho - Adicionar ao carrinho
c(".pizzaInfo--addButton").addEventListener("click", () => {
  //saber qual a pizza, qual o tamanho, quantas pizza serão adiconadas
  let size = c(".pizzaInfo--size.selected").getAttribute("data-key");

  let identifier = pizzaJson[modalKey].id + "@" + size;

  let key = cart.findIndex((item) => item.identifier == identifier);

  if (key > -1) {
    cart[key].qtd += modalQtd;
  } else {
    cart.push({
      identifier,
      id: pizzaJson[modalKey].id,
      size: parseInt(size),
      qtd: modalQtd,
    });
  }

  closeModal();
  updateCart();
});
c(".menu-closer").addEventListener("click", () => {
  c("aside").style.left = "100vw";
});
c(".menu-openner").addEventListener("click", () => {
  if (cart.length > 0) {
    c("aside").style.left = 0;
  }
});

function updateCart() {
  c(".menu-openner span").innerHTML = cart.length;

  if (cart.length > 0) {
    c("aside").classList.add("show");
    c(".cart").innerHTML = "";
    let subTotal = 0;
    let desconto = 0;
    let total = 0;

    for (let i in cart) {
      let pizzaItem = pizzaJson.find((item) => item.id == cart[i].id);
      let cartItem = c(".cart--item").cloneNode(true);
      subTotal += pizzaItem.price * cart[i].qtd;

      let pizzaSizeName;
      switch (cart[i].size) {
        case 0:
          pizzaSizeName = "P";
          break;
        case 1:
          pizzaSizeName = "M";
          break;
        case 2:
          pizzaSizeName = "G";
          break;
      }

      let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;

      cartItem.querySelector("img").src = pizzaItem.img;
      cartItem.querySelector(".cart--item-nome").innerHTML = pizzaName;
      cartItem.querySelector(".cart--item--qt").innerHTML = cart[i].qtd;
      c(".cart").append(cartItem);
      cartItem
        .querySelector(".cart--item-qtmenos")
        .addEventListener("click", () => {
          if (cart[i].qtd > 1) {
            cart[i].qtd--;
          } else {
            cart.splice(i, 1);
          }
          updateCart();
        });
      cartItem
        .querySelector(".cart--item-qtmais")
        .addEventListener("click", () => {
          cart[i].qtd++;
          updateCart();
        });
    }

    desconto = subTotal * 0.1;
    total = subTotal - desconto;

    c(".subtotal span:last-child").innerHTML = subTotal.toFixed(2);
    c(".desconto span:last-child").innerHTML = desconto.toFixed(2);
    c(".total span:last-child").innerHTML = total.toFixed(2);
  } else {
    c("aside").classList.remove("show");
    c("aside").style.left = "100vw";
  }
}
