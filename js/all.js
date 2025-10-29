function renderProduct() {}

async function getProductData() {
  try {
    const res = await axios.get(`${customerApi}/products`);
    console.log(res);
  } catch (err) {
    console.log(`錯誤訊息:${err}`);
  }
}

getProductData();
