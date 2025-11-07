const baseURL = "https://livejs-api.hexschool.io";
const api_path = "zong";

const customerApi = `${baseURL}/api/livejs/v1/customer/${api_path}`;

const token = "6JSEiSNJ79be1MaKrijCKtDzoPg1";
const adminApi = `${baseURL}/api/livejs/v1/admin/${api_path}`;
const headers = {
  headers: {
    authorization: token,
  },
};
