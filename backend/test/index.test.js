import { assert, expect } from "chai";
import {
  obtenerAnaliticasLinux,
  obtenerAnaliticasMac,
  obtenerPaquete,
  obtenerPaquetes,
} from "../src/services/service.js";

function formatearFecha(fecha) {
  return fecha.split("T")[0];
}

describe("Pruebas unitarias API", function () {
  this.timeout(200000);

  /*
  describe("Obtener todos los paquetes", function () {
    it("Debe recuperar +6k elementos", async function (done) {
      this.timeout(200000);
      const paquetesRetornados = await obtenerPaquetes();
      expect(paquetesRetornados.length).greaterThan(6000);

      done();
    });
    it("Los elementos deben cumplir la estructura de un paquete", async () => {});
  });
  */
  describe("Obtener analíticas Mac", function () {
    it("La analítica de 30 días debe terminar hoy e iniciar 30 días atrás", async function () {
      let fechaInicio = new Date();
      fechaInicio.setDate(fechaInicio.getDate() - 30);
      const fechaFin = new Date();

      const analiticas = await obtenerAnaliticasMac("30d");

      const expected1 = formatearFecha(fechaInicio.toISOString());
      const expected2 = formatearFecha(fechaFin.toISOString());

      expect(analiticas.start_date).to.equal(expected1);
      expect(analiticas.end_date).to.equal(expected2);
    });
    it("La analítica de 40 días debe ser null", async function () {
      const analiticas = await obtenerAnaliticasMac("40d");

      expect(analiticas).to.be.null;
    });
  });
  describe("Obtener analíticas Linux", function () {
    it("La analítica de 30 días debe terminar hoy e iniciar 30 días atrás", async function () {
      let fechaInicio = new Date();
      fechaInicio.setDate(fechaInicio.getDate() - 30);
      const fechaFin = new Date();

      const analiticas = await obtenerAnaliticasLinux("30d");

      const expected1 = formatearFecha(fechaInicio.toISOString());
      const expected2 = formatearFecha(fechaFin.toISOString());

      expect(analiticas.start_date).to.equal(expected1);
      expect(analiticas.end_date).to.equal(expected2);
    });
    it("La analítica de 40 días debe ser null", async function () {
      const analiticas = await obtenerAnaliticasLinux("40d");

      expect(analiticas).to.be.null;
    });
  });
  describe("Obtener paquete", function () {
    it("El paquete no debe ser null", async function () {
      const paquete = await obtenerPaquete("wget");

      const name = "wget";
      const desc = "Internet file retriever";
      const homepage = "https://www.gnu.org/software/wget/";
      const license = "GPL-3.0-or-later";
      const deprecated = false;

      expect(paquete).to.not.be.null;
      expect(paquete.name).to.equal(name);
      expect(paquete.desc).to.equal(desc);
      expect(paquete.homepage).to.equal(homepage);
      expect(paquete.license).to.equal(license);
      expect(paquete.deprecated).to.equal(deprecated);
    });
    it("El paquete debe ser null", async function () {
      const analiticas = await obtenerPaquete("wge");

      expect(analiticas).to.be.null;
    });
  });
});
