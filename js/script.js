let pokemonData;
let municipisData;
let moviesData;
let earthMeteoritesData;
let pokemonArray = [];
let municipisArray = [];
let moviesArray = [];
let earthMeteoritesArray = [];
let combinedDataArray = [];
let selectedDataType = "pokemon"; // Tipo de datos por defecto: Pokémon

function loadDataByType() {
  switch (selectedDataType) {
    case "pokemon":
      return pokemonArray;
    case "municipis":
      return municipisArray;
    case "movies":
      return moviesArray;
    case "earthMeteorites":
      return earthMeteoritesArray;
    default:
      return [];
  }
}

function reloadPage() {
  location.reload();
}

fetch("js/data/pokemon.json")
  .then((response) => response.json())
  .then((data) => {
    pokemonData = data.pokemon;
    return fetch("js/data/municipis.json");
  })
  .then((response) => response.json())
  .then((data) => {
    municipisData = data.elements || [];
    return fetch("js/data/movies.json");
  })
  .then((response) => response.json())
  .then((data) => {
    moviesData = data.movies || [];
    return fetch("js/data/earthMeteorites.json");
  })
  .then((response) => response.json())
  .then((data) => {
    earthMeteoritesData = data || [];
    pokemonArray = pokemonData.map((pokemon) => [
      pokemon.name,
      pokemon.id,
      pokemon.img,
      parseInt(pokemon.weight, 10),
    ]);
    municipisArray = municipisData.map((municipiInfo) => [
      municipiInfo.municipi_nom || "No disponible",
      municipiInfo.grup_ajuntament.codi_postal || "No disponible",
      municipiInfo.municipi_escut || "No disponible",
      municipiInfo.grup_comarca.comarca_nom || "No disponible"
    ]);
    moviesArray = moviesData.map((movieInfo) => [
      movieInfo.title || "No disponible",
      movieInfo.genres || "No disponible",
      movieInfo.url || "No disponible",
      movieInfo.rating || "No disponible",
    ]);
    earthMeteoritesArray = earthMeteoritesData.map((earthMeteoriteInfo) => [
      earthMeteoriteInfo.name || "No disponible",
      earthMeteoriteInfo.mass || "No disponible",
      null, //no hi ha imatge
      earthMeteoriteInfo.year || "No disponible",
    ]);

    combinedDataArray = [...pokemonArray, ...municipisArray, ...moviesArray, ...earthMeteoritesArray];
    console.table(combinedDataArray);
  })
  .catch((error) => {
    console.error("Error al obtener los archivos JSON:", error);
  });

function orderList(order) {
  if (order !== "asc" && order !== "desc") {
    console.error("Orden no válida. Utiliza 'asc' o 'desc'.");
    return;
  }

  let numcolumna = 0;

  const selectedArray = loadDataByType();
  const orderedArray = [...selectedArray];

  orderedArray.sort((a, b) => {
    const compareValueA = (a[numcolumna] || '').toLowerCase();
    const compareValueB = (b[numcolumna] || '').toLowerCase();
    return order === "asc" ? compareValueA.localeCompare(compareValueB) : compareValueB.localeCompare(compareValueA);
  });

  console.table(orderedArray);
  // Actualiza el array original correspondiente con la nueva ordenación
  switch (selectedDataType) {
    case "pokemon":
      pokemonArray = orderedArray;
     
      break;
    case "municipis":
      municipisArray = orderedArray;
      break;
    case "movies":
      moviesArray = orderedArray;
      break;
    case "earthMeteorites":
      earthMeteoritesArray = orderedArray;
      break;
    default:
      break;
  }

  // Vuelve a imprimir la lista
  printList();
}


//busqueda en temps real
let inputSearch = document.getElementById('searchInput');
inputSearch.addEventListener('input', () => searchList(inputSearch.value));

function searchList(searchTerm) {
  const sanitizedSearchTerm = searchTerm.trim().toLowerCase();
  if (sanitizedSearchTerm === "") {
    console.error("Consulta no válida.");
    return;
  }
  const matchingIndices = combinedDataArray.reduce((indices, data, index) => {
    if (data.some((cellData) => (cellData !== null && cellData.toString().toLowerCase().includes(sanitizedSearchTerm)))) {
      indices.push(index);
    }
    return indices;
  }, []);

  if (matchingIndices.length > 0) {
    const tableContainer = document.getElementById("resultat");
    tableContainer.innerHTML = "";
    const table = document.createElement("table");
    table.classList.add("pokemon-table");
    const headerRow = table.createTHead().insertRow();
    for (let i = 1; i <= 4; i++) {
      const th = document.createElement("th");
      th.textContent = i;
      headerRow.appendChild(th);
    }
    const tbody = table.createTBody();

    matchingIndices.forEach((index) => {
      const row = tbody.insertRow();
      combinedDataArray[index].forEach((cellData, cellIndex) => {
        const cell = row.insertCell();
        if (cellIndex === 2 && cellData !== null) {
          const img = document.createElement("img");
          img.src = cellData;
          img.alt = "Imagen";
          img.style.width = "50px";
          cell.appendChild(img);
        } else {
          cell.textContent = cellData !== null ? cellData : "No disponible";
        }
      });
    });

    tableContainer.appendChild(table);
  } else {
    console.log(`No se encontraron resultados para "${sanitizedSearchTerm}".`);
  }
}


function printList() {
  const tableContainer = document.getElementById("resultat");
  const selectedArray = loadDataByType();
  const table = document.createElement("table");
  table.classList.add("pokemon-table");
  const headerRow = table.createTHead().insertRow();
  let columnNames;
  switch (selectedDataType) {
    case "pokemon":
      columnNames = ["Nombre", "ID", "Imagen", "Peso"];
      break;
    case "municipis":
      columnNames = ["Nom", "Codi Postal", "Escut", "Comarca"];
      break;
    case "movies":
      columnNames = ["Nom", "Gènere", "Imagen", "Puntuació"];
      break;
    case "earthMeteorites":
      columnNames = ["Nombre", "Massa", "Imagen", "data"];
      break;
    default:
      columnNames = [];
  }
  columnNames.forEach((headerText) => {
    const th = document.createElement("th");
    th.textContent = headerText;
    headerRow.appendChild(th);
  });
  const tbody = table.createTBody();
  selectedArray.forEach((data) => {
    const row = tbody.insertRow();
    data.forEach((cellData, cellIndex) => {
      const cell = row.insertCell();
      if (cellIndex === 2 && cellData) {
        const img = document.createElement("img");
        img.src = cellData;
        img.alt = "Imagen No disponible";
        img.style.width = "50px";
        cell.appendChild(img);
      } else {
        cell.textContent = cellData;
      }
    });
  });
  tableContainer.innerHTML = "";
  tableContainer.appendChild(table);
}

const dataTypeSelector = document.getElementById("dataTypeSelector");
selectedDataType = dataTypeSelector.value;
printList();


function updateSelectedDataType() {
  const dataTypeInputs = document.getElementsByName("dataType");
  
  for (const input of dataTypeInputs) {
    if (input.checked) {
      selectedDataType = input.value;
      printList();
      break; // Rompemos el bucle ya que solo puede haber un radio seleccionado
    }
  }
}


function calcMitjana() {
  // Obtener el valor del botón de radio seleccionado
  const selectedDataType = document.querySelector('input[name="dataType"]:checked').value;

  let data;
  let dataTypeLabel;

  switch (selectedDataType) {
    case "pokemon":
      data = pokemonArray.map((pokemonData) => parseFloat(pokemonData[3]));
      dataTypeLabel = "La media de los pesos de los Pokémon";
      break;

    case "municipis":
      data = municipisData.map((municipiData) => {
        return parseFloat(municipiData.altitud);
      });
      dataTypeLabel = "La media de los datos de Municipis";
      break;

    case "movies":
      data = moviesData.map((movie) => {
        const movieData = parseFloat(movie.rating); // Selecciona el campo correspondiente para movies (por ejemplo, rating en este caso)
        return isNaN(movieData) ? 0 : movieData; // Manejar casos donde el rating no sea un número
      });
      dataTypeLabel = "La media de las valoraciones de las Películas";
      break;

      case "earthMeteorites":
        data = earthMeteoritesData.map((earth) => {
          const earthMass = parseFloat(earth.mass); 
          return isNaN(earthMass) ? 0 : earthMass; 
        });
        dataTypeLabel = "La media de las masas de los Meteoritos";
        break;

    default:
      console.error("Tipo de datos no reconocido:", selectedDataType);
      return;
  }

  if (data.length === 0) {
    alert(`No hay datos disponibles para calcular la media en ${dataTypeLabel}.`);
    return;
  }

  const mitjana = data.reduce((sum, value) => sum + value, 0) / data.length;
  alert(` ${dataTypeLabel} es: ${mitjana.toFixed(2)}`);
  return mitjana;
}




function showChart() {
  // Destruir el gráfico existente si hay uno
  const existingChart = Chart.getChart("myChart");
  if (existingChart) {
    existingChart.destroy();
  }

  // Eliminar la tabla existente si está presente
  const tableContainer = document.getElementById("resultat");
  tableContainer.innerHTML = "";

  // Valor del botón de radio seleccionado
  const selectedDataType = document.querySelector('input[name="dataType"]:checked').value;

  const arrayLabels = [];
  const arrayDadesGraf = [];

  // LÓGICA PARA EXTRAER LA INFORMACIÓN DEL GRÁFICO
  switch (selectedDataType) {
    case "pokemon":
      pokemonData.forEach(pokemon => {
        const types = pokemon.type;

        types.forEach(type => {
          const index = arrayLabels.indexOf(type);

          if (index === -1) {
            arrayLabels.push(type);
            arrayDadesGraf.push(1);
          } else {
            arrayDadesGraf[index]++;
          }
        });
      });
      break;

    case "movies":
      moviesData.forEach(movie => {
        const types = movie.genres;

        types.forEach(type => {
          const index = arrayLabels.indexOf(type);

          if (index === -1) {
            arrayLabels.push(type);
            arrayDadesGraf.push(1);
          } else {
            arrayDadesGraf[index]++;
          }
        });
      });
      break;

    case "municipis":
      municipisData.forEach(municipi => {
        const type = municipi.grup_comarca.comarca_nom;
        const index = arrayLabels.indexOf(type);

        if (index === -1) {
          arrayLabels.push(type);
          arrayDadesGraf.push(1);
        } else {
          arrayDadesGraf[index]++;
        }
      });
      break;

    case "earthMeteorites":
      earthMeteoritesData.forEach(earth => {
        const type = earth.nametype;
        const index = arrayLabels.indexOf(type);

        if (index === -1) {
          arrayLabels.push(type);
          arrayDadesGraf.push(1);
        } else {
          arrayDadesGraf[index]++;
        }
      });
      break;

    default:
      console.error("Tipo de datos no reconocido:", selectedDataType);
  }

  const borderColorArray = Array.from({ length: arrayLabels.length }, () =>
    getBorderColor()
  );
  const backgroundColorArray = borderColorArray;
  const ctx = document.getElementById("myChart");
  new Chart(ctx, {
    type: "polarArea",
    data: {
      // nombre del campo
      labels: arrayLabels,
      datasets: [
        {
          label: "",
          // número de tipos
          data: arrayDadesGraf,
          borderWidth: 2,
          borderColor: borderColorArray,
          backgroundColor: backgroundColorArray,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}

function getBackgroundColor() {
  const r = getRandomNumber(0, 255);
  const g = getRandomNumber(0, 255);
  const b = getRandomNumber(0, 255);
  const opacity = 0.2;
  return `rgba(${r},${g},${b},${opacity})`;
}

function getBorderColor() {
  const color = getBackgroundColor();
  const opacity = 1;
  return `${color},${opacity})`;
}

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
