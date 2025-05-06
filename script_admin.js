// ===============================
// LOGIN
// ===============================
function validarLogin() {
  const usuario = document.getElementById("usuario").value.trim();
  const clave = document.getElementById("clave").value.trim();

  if (usuario === "admin" && clave === "hxtend25") {
    document.getElementById("login-section").style.display = "none";
    document.getElementById("admin-panel").style.display = "block";
    cargarDoctores();
    mostrarFeedbacks();
    mostrarListaDoctores();
  } else {
    alert("Usuario o contraseña incorrectos.");
  }
}

// ===============================
// DOCTORES
// ===============================
function registrarDoctor() {
  const nuevoDoctor = document.getElementById("nuevo-doctor").value.trim();
  if (!nuevoDoctor) return alert("Ingrese un nombre válido.");

  let doctores = JSON.parse(localStorage.getItem("doctores")) || [];
  if (doctores.includes(nuevoDoctor)) {
    alert("Este doctor ya está registrado.");
    return;
  }

  doctores.push(nuevoDoctor);
  localStorage.setItem("doctores", JSON.stringify(doctores));
  document.getElementById("nuevo-doctor").value = "";
  cargarDoctores();
  mostrarListaDoctores();
  mostrarAlerta("✅ Doctor registrado correctamente.");
}

function cargarDoctores() {
  const select = document.getElementById("filtro-doctor");
  if (!select) return;

  select.innerHTML = `<option value="">-- Todos --</option>`;
  const doctores = JSON.parse(localStorage.getItem("doctores")) || [];
  doctores.forEach(doc => {
    const option = document.createElement("option");
    option.value = doc;
    option.textContent = doc;
    select.appendChild(option);
  });
}

function mostrarListaDoctores() {
  const contenedor = document.getElementById("listaDoctores");
  if (!contenedor) return;

  const doctores = JSON.parse(localStorage.getItem("doctores")) || [];
  contenedor.innerHTML = "";

  doctores.forEach(doc => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span>${doc}</span>
      <button onclick="abrirDoctor('${encodeURIComponent(doc)}')">Ver panel</button>
    `;
    contenedor.appendChild(li);
  });
}

function abrirDoctor(nombreCodificado) {
  const url = `index.html?doctor=${nombreCodificado}`;
  window.open(url, "_blank");
}

// ===============================
// FEEDBACKS
// ===============================
function mostrarFeedbacks() {
  const contenedor = document.getElementById("listaFeedbacks");
  contenedor.innerHTML = "";

  const feedbacks = JSON.parse(localStorage.getItem("feedbacks")) || [];
  const filtro = document.getElementById("filtro-doctor")?.value;

  const filtrados = filtro ? feedbacks.filter(fb => fb.doctor === filtro) : feedbacks;

  if (filtrados.length === 0) {
    contenedor.innerHTML = "<p>No hay feedbacks disponibles.</p>";
    return;
  }

  filtrados.reverse().forEach(fb => {
    const div = document.createElement("div");
    div.innerHTML = `<strong>${fb.fecha}</strong><br>
      <u>Doctor:</u> ${fb.doctor}<br>
      <u>Procedimiento:</u> ${fb.procedimiento}<br>
      <u>Feedback:</u> ${fb.comentario}`;
    contenedor.appendChild(div);
  });
}

function descargarFeedbacks() {
  descargar(false);
}

function descargarFiltrados() {
  descargar(true);
}

function descargar(filtrado) {
  const feedbacks = JSON.parse(localStorage.getItem("feedbacks")) || [];
  const filtro = document.getElementById("filtro-doctor").value;
  const filtrados = filtrado && filtro ? feedbacks.filter(fb => fb.doctor === filtro) : feedbacks;

  if (filtrados.length === 0) {
    alert("No hay feedbacks disponibles.");
    return;
  }

  let contenido = `FEEDBACKS HXTEND ${filtrado && filtro ? `- ${filtro}` : ''}\n--------------------\n`;
  filtrados.forEach((fb, i) => {
    contenido += `#${i + 1}\nFecha: ${fb.fecha}\nDoctor: ${fb.doctor}\nProcedimiento: ${fb.procedimiento}\nFeedback: ${fb.comentario}\n\n`;
  });

  const blob = new Blob([contenido], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  const nombre = filtrado && filtro ? `feedbacks_${filtro.replace(/\s+/g, "_")}.txt` : "feedbacks_hxtend.txt";
  a.download = nombre;
  a.click();
  URL.revokeObjectURL(url);

  mostrarAlerta("✅ Archivo TXT descargado.");
}

// ===============================
// ALERTAS ANIMADAS
// ===============================
function mostrarAlerta(mensaje) {
  const alerta = document.createElement("div");
  alerta.className = "alerta";
  alerta.textContent = mensaje;
  document.body.appendChild(alerta);
  setTimeout(() => {
    alerta.remove();
  }, 3000);
}
