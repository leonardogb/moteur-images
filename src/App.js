import React, { useState, useEffect } from "react";
import Formulario from "./components/Formulario";
import ListaImagenes from "./components/ListaImagenes";

function App() {
  const [busqueda, guardarBusqueda] = useState("");
  const [imagenes, guardarImagenes] = useState([]);
  const [paginaActual, guardarPaginaActual] = useState(1);
  const [totalPaginas, guardarTotalPaginas] = useState(1);

  useEffect(() => {
    if (busqueda === "") return;
    const consultaAPI = async () => {
      const imagenesPorPagina = 30;
      const url =
        "https://pixabay.com/api/?key=" +
        process.env.REACT_APP_API_KEY +
        `&q=${busqueda}&per_page=${imagenesPorPagina}&page=${paginaActual}`;

      const respuesta = await fetch(url);
      const resultado = await respuesta.json();

      guardarImagenes(resultado.hits);

      // Calcular el total de páginas
      const calcularTotalPaginas = Math.ceil(
        resultado.totalHits / imagenesPorPagina
      );

      guardarTotalPaginas(calcularTotalPaginas);

      // Mover la página hacia arriba
      const jumbotron = document.querySelector(".jumbotron");
      jumbotron.scrollIntoView({ behavior: "smooth" });
    };
    consultaAPI();
  }, [busqueda, paginaActual]);

  // Definir la página anterior
  const paginaAnterior = () => {
    const nuevaPaginaActual = paginaActual > 1 ? paginaActual - 1 : 1;

    guardarPaginaActual(nuevaPaginaActual);
  };
  // Definir la página siguiente
  const paginaSiguiente = () => {
    const nuevaPaginaActual =
      paginaActual < totalPaginas ? paginaActual + 1 : totalPaginas;

    guardarPaginaActual(nuevaPaginaActual);
  };

  return (
    <div className="container">
      <div className="jumbotron">
        <p className="lead text-center">Moteur de recherche d'images</p>
        <Formulario guardarBusqueda={guardarBusqueda} />
      </div>
      <div className="row justify-content-center">
        <ListaImagenes imagenes={imagenes} />

        {paginaActual === 1 ? null : (
          <button
            type="button"
            className="bbtn btn-info mr-1  mb-3"
            onClick={paginaAnterior}
          >
            &laquo; Avant
          </button>
        )}

        {paginaActual === totalPaginas || totalPaginas === 0 ? null : (
          <button
            type="button"
            className="bbtn btn-info mb-3"
            onClick={paginaSiguiente}
          >
            Suivant &raquo;
          </button>
        )}
      </div>
    </div>
  );
}

export default App;
