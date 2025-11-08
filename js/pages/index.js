let productData = [];
let cartsData = [];

const productWrap = document.querySelector(".productWrap");
const productSelect = document.querySelector(".productSelect");

const shoppingCartTableHead = document.querySelector(
  ".shoppingCart-table thead"
);
const shoppingCartTableBody = document.querySelector(
  ".shoppingCart-table tbody"
);
const shoppingCartTableFoot = document.querySelector(
  ".shoppingCart-table tfoot"
);

// 渲染產品資料
function renderProduct(productData) {
  let str = "";
  const reg = /\B(?=(\d{3})+(?!\d))/g;
  productData.forEach((item) => {
    const originPrice = String(item.origin_price).replace(reg, ",");
    const price = String(item.price).replace(reg, ",");
    str += `            <li class="productCard" data-id='${item.id}'>
                <h4 class="productType">新品</h4>
                <img src="${item.images}"
                    alt="">
                <a href="#" class="addCardBtn">加入購物車</a>
                <h3>${item.title}</h3>
                <del class="originPrice">NT$${originPrice}</del>
                <p class="nowPrice">NT$${price}</p>
            </li>`;
  });
  productWrap.innerHTML = str;
}

// 篩選產品分類
productSelect.addEventListener("change", (e) => {
  if (e.target.value === "全部") {
    renderProduct(productData);
    return;
  }
  const filterData = productData.filter(
    (item) => e.target.value === item.category
  );
  renderProduct(filterData);
});

// get 產品資料
async function getProductData() {
  try {
    const res = await axios.get(`${customerApi}/products`);
    productData = res.data.products;
    renderProduct(productData);
  } catch (err) {
    console.log(`錯誤訊息:${err}`);
  }
}

// get 購物車資料
async function getCartData() {
  try {
    const res = await axios.get(`${customerApi}/carts`);
    cartsData = res.data.carts;
    renderCarts(cartsData);
  } catch (error) {
    console.log(`錯誤訊息:${error}`);
  }
}
// 加入購物車
function handleAddToCart(e) {
  e.preventDefault();
  const addBtn = e.target.classList.contains("addCardBtn");
  const id = e.target.closest(".productCard").dataset.id;
  if (addBtn) {
    const cart = cartsData.find((item) => {
      return item.product.id === id;
    });
    const quantity = cart ? cart.quantity + 1 : 1;
    const data = {
      data: {
        productId: id,
        quantity,
      },
    };
    postCart(data);
  }
}

// 監聽加入購物車按鈕
productWrap.addEventListener("click", handleAddToCart);

// post 購物車資料
async function postCart(data) {
  try {
    const res = await axios.post(`${customerApi}/carts`, data);
    cartsData = res.data.carts;
    renderCarts(cartsData);
  } catch (error) {
    console.log(`錯誤訊息:${error}`);
  }
}

// 渲染購物車資料
function renderCarts(cartsData) {
  if (cartsData.length === 0) {
    shoppingCartTableHead.innerHTML = "";
    shoppingCartTableBody.innerHTML = "無購物內容";
    shoppingCartTableFoot.innerHTML = "";
    return;
  }
  let str = "";
  let total = 0;
  const reg = /\B(?=(\d{3})+(?!\d))/g;
  cartsData.forEach((item) => {
    const product = item.product;
    total += product.price * item.quantity;
    const originPrice = String(product.origin_price).replace(reg, ",");
    const price = String(product.price * item.quantity).replace(reg, ",");
    str += `<tr  data-id='${item.id}'>
                        <td>
                            <div class="cardItem-title">
                                <img src="${product.images}" alt="">
                                <p>${product.title}</p>
                            </div>
                        </td>
                        <td>NT$${originPrice}</td>
                        <td><button type='button' class="minusBtn">-</button><span>${item.quantity}</span><button type='button' class="plusBtn">+</button></td>
                        <td>NT$${price}</td>
                        <td class="discardBtn">
                            <a href="#" class="material-icons">
                                clear
                            </a>
                        </td>
                    </tr>`;
  });
  shoppingCartTableHead.innerHTML = `                    <tr>
                        <th width="40%">品項</th>
                        <th width="15%">單價</th>
                        <th width="15%">數量</th>
                        <th width="15%">金額</th>
                        <th width="15%"></th>
                    </tr>`;
  shoppingCartTableBody.innerHTML = str;
  shoppingCartTableFoot.innerHTML = `<tr>
                        <td>
                            <a href="#" class="discardAllBtn">刪除所有品項</a>
                        </td>
                        <td></td>
                        <td></td>
                        <td>
                            <p>總金額</p>
                        </td>
                        <td>NT$${String(total).replace(reg, ",")}</td>
                    </tr>`;
}

// 新增/刪減購物車商品數量
shoppingCartTableBody.addEventListener("click", (e) => {
  const plusBtn = e.target.closest(".plusBtn");
  const minusBtn = e.target.closest(".minusBtn");
  if (plusBtn || minusBtn) {
    const id = e.target.closest("tr").dataset.id;
    const cart = cartsData.find((item) => item.id === id);
    let quantity = cart.quantity;
    if (plusBtn) {
      quantity += 1;
    } else if (minusBtn) {
      quantity = quantity > 1 ? quantity - 1 : 1;
    }
    const data = { data: { id, quantity } };
    patchQuantity(data);
  }
});

// 編輯商品數量
async function patchQuantity(data) {
  try {
    const res = await axios.patch(`${customerApi}/carts`, data);
    cartsData = res.data.carts;
    renderCarts(cartsData);
  } catch (error) {
    console.log(`錯誤訊息:${error}`);
  }
}

// 刪除購物車單一內容事件
shoppingCartTableBody.addEventListener("click", (e) => {
  e.preventDefault();
  const btn = e.target.closest(".discardBtn");
  if (btn) {
    const tr = btn.closest("tr");
    const id = tr ? tr.dataset.id : null;
    if (id) {
      deleteCarts(id);
    }
  }
});

// 刪除購物車單一內容
async function deleteCarts(id) {
  try {
    const res = await axios.delete(`${customerApi}/carts/${id}`);
    cartsData = res.data.carts;
    renderCarts(cartsData);
  } catch (error) {
    console.log(`錯誤訊息:${error}`);
  }
}

// 刪除購物車所有內容事件
shoppingCartTableFoot.addEventListener("click", (e) => {
  e.preventDefault();
  const btn = e.target.closest(".discardAllBtn");
  if (btn) {
    console.log(cartsData);
    cartsData.forEach((item) => {
      item.quantity = 0;
    });
    deleteAllCarts();
  }
});

// 刪除購物車所有內容
async function deleteAllCarts() {
  try {
    const res = await axios.delete(`${customerApi}/carts`);
    cartsData = res.data.carts;
    renderCarts(cartsData);
  } catch (error) {
    console.log(`錯誤訊息:${error}`);
  }
}

// 取得訂單元素
const customerName = document.querySelector("#customerName");
const customerPhone = document.querySelector("#customerPhone");
const customerEmail = document.querySelector("#customerEmail");
const customerAddress = document.querySelector("#customerAddress");
const tradeWay = document.querySelector("#tradeWay");
const orderInfoBtn = document.querySelector(".orderInfo-btn");
const orderInfoForm = document.querySelector(".orderInfo-form");

// 驗證規則
function checkForm() {
  const constraints = {
    姓名: {
      presence: { message: "姓名為必填欄位" },
      length: {
        minimum: 2,
        message: "姓名至少需兩個字",
      },
    },
    電話: {
      presence: { message: "電話為必填欄位" },
      format: {
        pattern: /^[0-9\-+() ]{8,15}$/,
        message: "請輸入有效的電話格式",
      },
    },
    Email: {
      presence: { message: "Email 為必填欄位" },
      email: { message: "請輸入有效的 Email 格式" },
    },
    寄送地址: {
      presence: { message: "地址為必填欄位" },
    },
  };
  const formData = {
    姓名: customerName.value.trim(),
    電話: customerPhone.value.trim(),
    Email: customerEmail.value.trim(),
    寄送地址: customerAddress.value.trim(),
  };
  const errors = validate(formData, constraints);
  if (errors) {
    let message = "";
    Object.values(errors).forEach((arr) => {
      arr.forEach((msg) => {
        message += msg + "\n";
      });
    });
    alert(message);
    return true;
  }
  return false;
}
function addOrder() {
  if (!cartsData.length) {
    alert("購物車內無任何商品，請先加入商品再進行結帳");
    return;
  }
  if (checkForm()) return;

  const data = {
    data: {
      user: {
        name: customerName.value.trim(),
        tel: customerPhone.value.trim(),
        email: customerEmail.value.trim(),
        address: customerAddress.value.trim(),
        payment: tradeWay.value,
      },
    },
  };
  postOrders(data);
}

orderInfoBtn.addEventListener("click", (e) => {
  e.preventDefault();
  addOrder();
});

async function postOrders(data) {
  try {
    const res = await axios.post(`${customerApi}/orders`, data);
    orderInfoForm.reset();
    window.location.reload();
  } catch (error) {
    console.log("🚀 ~ error:", error);
  }
}

// 初始化
function init() {
  getProductData();
  getCartData();
}

init();
