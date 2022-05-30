class Product {
  constructor(id,
              name,
              price,) {
    this.id = id;
    this.name = name;
    this.price = price;
  }
}

class ProductInCart extends Product {
  constructor(id,
              name,
              price) {
    super(id, name, price);

    this.number = 1;
    this.totalPrice = price;
  }

  incProduct() {
    this.number++;
    this.totalPrice = this.number * this.price;
  }
}

class Cart {
  constructor() {
    this.products = {};
    this.totalItems = 0;
    this.totalItemsPrice = 0;
  }

  addProduct(product) {
    !(product.id in this.products)
      ? this.products[product.id] = new ProductInCart(
        product.id,
        product.name,
        product.price)
      : this.products[product.id].incProduct()
    ;

    this.totalItems = Object.values(this.products)
      .reduce((total, item) => total + item.number, 0);
    this.totalItemsPrice = Object.values(this.products)
      .reduce((totalPrice, item) => totalPrice + item.number * item.price, 0);
  }

  makeHtmlForCartPopup() {
    return Object.values(this.products)
      .reduce((html, item) => html + `
        <div class="cart-info__data">
         <span>
            ${item.name}
          </span>
          <span>
            ${item.number}
          </span>
          <span>
            $${item.price.toFixed(2)}
          </span>
          <span>
            $${item.totalPrice.toFixed(2)}
          </span>
        </div>
      `, '');
  }
}

const cart = new Cart();

const featuredItemsEls = document.querySelector('.featuredItems');

document.querySelector('.cartIconWrap')
  .addEventListener('click', () => {
    document.querySelector('.cart-info')
      .classList.toggle('hidden');
  })

featuredItemsEls
  .addEventListener('click', (e) => {
    if (!e.target.classList.contains('add-product-to-cart')) {
      return;
    }
    const id = e.target.dataset.item;
    const productEL = featuredItemsEls
      .querySelector(`.featuredItem[data-item="${id}"]`);

    cart.addProduct(new Product(
      id,
      productEL
        .querySelector('.featuredName').textContent
        .trim(),
      Number.parseInt(productEL
        .querySelector('.featuredPrice').textContent
        .trim()
        .slice(1)
      )
    ));

    document.querySelector('#cartInfoTotalProductsSum')
      .textContent = cart.totalItemsPrice.toFixed(2);

    document.querySelector('#cartInfoProductsData')
      .innerHTML = cart.makeHtmlForCartPopup();

    document.querySelector('.cartIconWrap__counter')
      .textContent = cart.totalItems;
  });
