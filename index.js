const fs = require("fs");

fs.readFile("empleados.json", { encoding: "utf8" }, (err, data) => {
    if (!err) {
        console.log(data);
        const univs = JSON.parse(data);
        univs.forEach((element) => {
            console.log(element);
        });
    } else {
        console.log(`Ohh, alga ha salido mal ${err}`);
    }
});


fs.writeFile("empleados.json", JSON.stringify(products), (data, err) => {
    if (!err) {
        console.log("DONE " + data);
    } else {
        console.log(`Ohh, algo ha pasado ${err}`);
    }
});
