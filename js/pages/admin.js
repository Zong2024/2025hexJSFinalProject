let ordersData = [];
const orderPageTableBody = document.querySelector(".orderPage-table tbody");

function renderOrders() {
  let str = "";
  ordersData.forEach((order) => {
    let productsStr = "";
    order.products.forEach((product) => {
      productsStr += `<p>${product.title}</p> x ${product.quantity}`;
    });
    str += `         <tr data-id=${order.id}>
                          <td>${order.id}</td>
                          <td>
                              <p>${order.user.name}</p>
                              <p>${order.user.tel}</p>
                          </td>
                          <td>${order.user.address}</td>
                          <td>${order.user.email}</td>
                          <td>${productsStr}</td>
                          <td>${formatTimestamp(order.createdAt)}</td>
                          <td class="orderStatus">
                              <a href="#" class='paid'>${
                                order.paid
                                  ? "已處理"
                                  : "<span style='color:red'>未處理</span>"
                              }</a>
                          </td>
                          <td>
                              <input type="button" class="delSingleOrder-Btn" value="刪除">
                          </td>
                      </tr>`;
  });
  orderPageTableBody.innerHTML = str;
}

function formatTimestamp(timestamp) {
  const time = new Date(timestamp * 1000);
  const formatTime = time.toLocaleString("zh-TW", {
    hour12: false,
  });
  return formatTime;
}

async function getOrdersData() {
  try {
    const res = await axios.get(`${adminApi}/orders`, headers);
    ordersData = res.data.orders;
    renderOrders();
    calcProductsCategory();
  } catch (error) {
    console.log(`錯誤: ${error}`);
  }
}

orderPageTableBody.addEventListener("click", (e) => {
  e.preventDefault();
  const btn = e.target.classList.contains("delSingleOrder-Btn");
  const State = e.target.classList.contains("paid");
  const id = e.target.closest("tr").dataset.id;
  if (btn) {
    console.log(id);
    deleteOrder(id);
  }
  if (State) {
    const order = ordersData.find((item) => item.id === id);
    const data = {
      data: {
        id,
        paid: !order.paid,
      },
    };
    putOrderState(data);
  }
});

async function deleteOrder(id) {
  try {
    const res = await axios.delete(`${adminApi}/orders/${id}`, headers);
    ordersData = res.data.orders;
    renderOrders();
  } catch (error) {}
}

async function putOrderState(data) {
  try {
    const res = await axios.put(`${adminApi}/orders`, data, headers);
    ordersData = res.data.orders;
    renderOrders();
  } catch (error) {
    console.log(error);
  }
}

function calcProductsCategory() {
  let result = {};
  ordersData.forEach((item) => {
    item.products.forEach((product) => {
      let total = product.price * product.quantity;
      result[product.category] = result[product.category] + total || total;
    });
  });
  renderChart(Object.entries(result));
}

function init() {
  getOrdersData();
}

init();

// C3.js
function renderChart(data) {
  let chart = c3.generate({
    bindto: "#chart",
    data: {
      type: "pie",
      columns: data,
    },
    color: {
      pattern: ["#DACBFF", "#9D7FEA", "#5434A7", "#301E5F"],
    },
  });
}
