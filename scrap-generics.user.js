// ==UserScript==
// @name     Scrap Generics
// @namespace   https://medex.com.bd
// @version  1
// @description  Get generic info
// @match https://medex.com.bd/generics/*/*
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @require   https://cdn.jsdelivr.net/npm/pouchdb@7.3.1/dist/pouchdb.min.js
// ==/UserScript==

(function (window) {
  "use strict";

  function goto(url) {
    window.location.assign(`${url}/brand-names`);
  }

  // get generic info
  let rawUrl = window.location.href;
  let ee = rawUrl.split("/");
  //let dbName = `generics_${new Date().toJSON()}`
  let dbName = `generics_${new Date().toJSON().split('T')[0]}`
	
  function generateRandom(min = 3000, max = 10000) {
    // find diff
    let difference = max - min;
    // generate random number 
    let rand = Math.random();
    // multiply with difference 
    rand = Math.floor( rand * difference);
    // add with min value 
    rand = rand + min;
    return rand;
  }
  
  // check url
  if (ee.length == 6 && ee[3] === "generics") {
    // generic info page
    let doc = {};
    doc._id = ee[4];
    doc.name = $(document.body).find("h1.page-heading-1-l").text();
    doc.link = rawUrl;
    const info = [];
    const p = $(document.body).find(".generic-data-container"); // generic info container
    if (p) {
      let db = new PouchDB(dbName);
      //db.get(doc._id).then(console.log).catch(console.error)
      console.log("ok");
      p.children().each((i, r) => {
        let title = $(r).find("h4.ac-header").text();
        let body = $(r).find("div.ac-body").text();
        if (title.length && body.length) {
          info.push({ title: title, body: body });
        }
      });
      doc.info = info;

      if (doc.name !== undefined || doc.name.length > 0) {
        db.put(doc)
          .then((oo) => {
            console.log(oo);
            setTimeout(function () {
              window.location.assign(`${doc.link}/brand-names`);
            }, generateRandom());
          })
          .catch(er=>{
        	if(er.status === 409)  window.location.assign(`${doc.link}/brand-names`);
          else console.log(er)
        });
      }
    }
  }
})(window);
