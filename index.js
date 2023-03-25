#!/usr/bin/env node

var fs = require("fs");
var yargs = require("yargs");

const args = yargs.usage("Usage: -c <collection name>").option("c", {
  alias: "collection",
  describe: "collection name",
  type: "string",
  demandOption: true,
}).argv;

async function getCollection() {
  var myHeaders = new Headers();
  myHeaders.append(
    "Cookie",
    "__cf_bm=u.AjNKTJMATUwFkQ5b3aOef.MZCKVlYdPzrG0GQc9XE-1679763775-0-AYzGqc6dhWj9jBCYN5yq1ebF4rV5fIS/oqjiuXwarvBNwtF11zXJYvG3jnoYrC4p9gPmA0k4Z2bbYJiAylJ9rpQ="
  );

  var requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  await fetch(
    `https://api-mainnet.magiceden.dev/v2/collections/${args.collection}/listings?offset=0`,
    requestOptions
  )
    .then((response) => response.text())
    .then((result) => generateMetadata(result))
    .catch((error) => console.log("error", error));
}

async function generateMetadata(response) {
  const data = JSON.parse(response);
  let o = [];

  for (var item of data) {
    console.log("Getting details for Mint: ", item.tokenMint);
    var myHeaders = new Headers();
    myHeaders.append(
      "Cookie",
      "__cf_bm=uWYeB8pDFq4o4G6ga0SySjCkbCwGoOC.IegHFC1WiSI-1679766100-0-AdNZ87fdN85eHRnlnYBr3L9kzqFpo1rkEEuQ/+TUaqOZiLu86QP/FCUhca5R22kv1J7UGCCc9dC3bFcD8nIBLGs="
    );

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    await fetch(
      `https://api-mainnet.magiceden.dev/v2/tokens/${item.tokenMint}?`,
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => {
        // console.log(result);
        const data = JSON.parse(result);
        var res = {
          name: data.name,
          image: data.image,
          attributes: data.attributes,
        };
        o.push(res);
      })
      .catch((error) => console.log("error", error));

    setTimeout(function () {
      return;
    }, 5000);
  }

  fs.writeFileSync("metadata.json", JSON.stringify(o), function (err) {
    if (err) {
      return console.log(err);
    }
    console.log("The file was saved!");
  });
}

getCollection();
//generate metadata.json
