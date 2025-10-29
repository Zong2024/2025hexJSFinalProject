let productData = [];

const productWrap = document.querySelector(".productWrap");
const productSelect = document.querySelector(".productSelect");

// 渲染產品資料
function renderProduct(productData) {
  let str = "";
  const reg = /\B(?=(\d{3})+(?!\d))/g;
  productData.forEach((item) => {
    const originPrice = String(item.origin_price).replace(reg, ",");
    const price = String(item.price).replace(reg, ",");
    str += `            <li class="productCard">
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

getProductData();
