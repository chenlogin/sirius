var fn = function () {
  console.info("The file is started on the Express service ");

  axios.get("http://localhost:3000/home?a=1&b=2").then(function (response) {
    console.log(response.data);
  });
  axios
    .post("http://localhost:3000/about", { a: 1, b: 3, c: 3 })
    .then(function (response) {
      console.log(response.data);
    });

  //存在跨域：http://localhost:3000/static/images/express.png
  axios
    .request({ url: "../../server/express-server/assets/images/express.png" })
    .then((res) => {
      console.log(res);
    });
};
