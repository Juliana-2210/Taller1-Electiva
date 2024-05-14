const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const dataPath = path.join(__dirname, "empleados.json");

app.set("views", "./views");
app.set("view engine", "ejs");
app.set("PORT", process.env.PORT || 3000);

app.get("/", (req, res) => {
    fs.readFile(dataPath, "utf8", (err, data) => {
        if (err) {
            console.error("Error al leer el archivo empleados.json:", err);
            res.status(500).send("Error interno del servidor");
            return;
        }

        const jsonData = JSON.parse(data);
        const empleados = jsonData.empleados;

        res.render("index", { empleados: empleados, mensajeOperacion: null });
    });
});

app.post("/agregar-empleado", (req, res) => {
    const nuevoEmpleado = {
        code: req.body.codigo,
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        cargo: req.body.cargo,
        salario: parseFloat(req.body.salario),
        fecha_contratacion: req.body.fecha_contratacion
    };

    fs.readFile(dataPath, "utf8", (err, data) => {
        if (err) {
            console.error("Error al leer el archivo empleados.json:", err);
            res.status(500).send("Error interno del servidor");
            return;
        }

        const jsonData = JSON.parse(data);
        jsonData.empleados[nuevoEmpleado.code] = nuevoEmpleado;

        fs.writeFile(dataPath, JSON.stringify(jsonData, null, 2), err => {
            if (err) {
                console.error("Error al escribir en el archivo empleados.json:", err);
                res.status(500).send("Error interno del servidor");
                return;
            }

            res.redirect("/?mensajeOperacion=Empleado agregado correctamente");
        });
    });
});

app.post("/eliminar-empleado", (req, res) => {
    const codigoEmpleado = req.body.codigo;

    fs.readFile(dataPath, "utf8", (err, data) => {
        if (err) {
            console.error("Error al leer el archivo empleados.json:", err);
            res.status(500).send("Error interno del servidor");
            return;
        }

        const jsonData = JSON.parse(data);
        delete jsonData.empleados[codigoEmpleado];

        fs.writeFile(dataPath, JSON.stringify(jsonData, null, 2), err => {
            if (err) {
                console.error("Error al escribir en el archivo empleados.json:", err);
                res.status(500).send("Error interno del servidor");
                return;
            }

            res.redirect("/?mensajeOperacion=Empleado eliminado correctamente");
        });
    });
});

app.post("/modificar-empleado", (req, res) => {
    const codigoEmpleado = req.body.codigo;
    const nombreEmpleado = req.body.nombre;
    const apellidoEmpleado = req.body.apellido;
    const cargoEmpleado = req.body.cargo;
    const salarioEmpleado = parseFloat(req.body.salario);
    const fechaContratacionEmpleado = req.body.fecha_contratacion;

    fs.readFile(dataPath, "utf8", (err, data) => {
        if (err) {
            console.error("Error al leer el archivo empleados.json:", err);
            res.status(500).send("Error interno del servidor");
            return;
        }

        const jsonData = JSON.parse(data);
        jsonData.empleados[codigoEmpleado] = {
            code: codigoEmpleado,
            nombre: nombreEmpleado,
            apellido: apellidoEmpleado,
            cargo: cargoEmpleado,
            salario: salarioEmpleado,
            fecha_contratacion: fechaContratacionEmpleado
        };

        fs.writeFile(dataPath, JSON.stringify(jsonData, null, 2), err => {
            if (err) {
                console.error("Error al escribir en el archivo empleados.json:", err);
                res.status(500).send("Error interno del servidor");
                return;
            }

            res.redirect("/?mensajeOperacion=Empleado modificado correctamente");
        });
    });
});

app.post("/buscar-empleado", (req, res) => {
    const tipoBusqueda = req.body.tipoBusqueda;
    const valorBusqueda = req.body.valorBusqueda;

    fs.readFile(dataPath, "utf8", (err, data) => {
        if (err) {
            console.error("Error al leer el archivo empleados.json:", err);
            res.status(500).send("Error interno del servidor");
            return;
        }

        const jsonData = JSON.parse(data);
        const empleados = jsonData.empleados;
        const resultados = [];

        switch (tipoBusqueda) {
            case "codigo":
                if (empleados.hasOwnProperty(valorBusqueda)) {
                    resultados.push(empleados[valorBusqueda]);
                }
                break;
            case "nombre":
                Object.values(empleados).forEach(empleado => {
                    if (empleado.nombre.toLowerCase().includes(valorBusqueda.toLowerCase())) {
                        resultados.push(empleado);
                    }
                });
                break;
            case "apellido":
                Object.values(empleados).forEach(empleado => {
                    if (empleado.apellido.toLowerCase().includes(valorBusqueda.toLowerCase())) {
                        resultados.push(empleado);
                    }
                });
                break;
            case "cargo":
                Object.values(empleados).forEach(empleado => {
                    if (empleado.cargo.toLowerCase().includes(valorBusqueda.toLowerCase())) {
                        resultados.push(empleado);
                    }
                });
                break;
            case "todos":
                Object.values(empleados).forEach(empleado => {
                    resultados.push(empleado);
                });
                break;
        }

        res.render("index", { empleados: resultados, mensajeOperacion: null });
    });
});

app.listen(app.get("PORT"), () =>
    console.log(`Server listen at Port ${app.get("PORT")}`)
);
