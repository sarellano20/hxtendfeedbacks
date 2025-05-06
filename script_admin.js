const SHEET_ID = "AKfycbwXbmYpSTIThQ0W1mubqKCSsD08NblLwa-pWyudYTkEPpUpPbl7TUVXlqTT92C3nXg98g";
const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json`;

let todosFeedbacks = [];
let doctores = [];

document.addEventListener("DOMContentLoaded", async () => {
  const res = await fetch(SHEET_URL);
  const text = await res.text();
  const json = JSON.parse(text.substring(47).slice(0, -2));
  const rows = json.table.rows;

  todosFeedbacks = rows.map(row => ({
    fecha: row.c[0]?.f || "",
    doctor: row.c[1]?.v || "",
    procedimiento: row.c[2]?.v || "",
    comentario: row.c[3]?.v || ""
  }));

  doctores = [...new Set(todosFeedbacks.map(fb => fb.doctor))];

  cargarDoctores();
  mostrarFeedbacks(todosFeedbacks);
  mostrarListaDoctores();
});

function validarLogin() {
  const usuario = document.getElementById("usuario").value.trim();
  const clave = document.getElementById("clave").value.trim();

  if (usuario === "admin" && clave === "hxtend25") {
    document.getElementById("login-section").style.display = "none";
    document.getElementById("admin-panel").style.display = "block";
  } else {
    alert("Usuario o contraseña incorrectos.");
  }
}

function cargarDoctores() {
  const select = document.getElementById("filtro-doctor");
  select.innerHTML = '<option value="">-- Todos --</option>';
  doctores.forEach(doc => {
    const option = document.createElement("option");
    option.value = doc;
    option.textContent = doc;
    select.appendChild(option);
  });
}

function mostrarFeedbacks(lista) {
  const contenedor = document.getElementById("listaFeedbacks");
  contenedor.innerHTML = "";

  if (lista.length === 0) {
    contenedor.innerHTML = "<p>No hay feedbacks disponibles.</p>";
    return;
  }

  lista.forEach(fb => {
    const div = document.createElement("div");
    div.className = "feedback-item";
    div.innerHTML = `<strong>${fb.fecha}</strong><br>
      <u>Doctor:</u> ${fb.doctor}<br>
      <u>Procedimiento:</u> ${fb.procedimiento}<br>
      <u>Feedback:</u> ${fb.comentario}`;
    contenedor.appendChild(div);
  });
}

function filtrarFeedbacks() {
  const filtro = document.getElementById("filtro-doctor").value;
  const filtrados = filtro ? todosFeedbacks.filter(fb => fb.doctor === filtro) : todosFeedbacks;
  mostrarFeedbacks(filtrados);
}

function descargarFeedbacks() {
  const filtro = document.getElementById("filtro-doctor").value;
  const lista = filtro ? todosFeedbacks.filter(fb => fb.doctor === filtro) : todosFeedbacks;

  if (lista.length === 0) {
    alert("No hay feedbacks para descargar.");
    return;
  }

  let contenido = `FEEDBACKS HXTEND ${filtro ? `- ${filtro}` : ''}\n------------------------------\n`;
  lista.forEach((fb, i) => {
    contenido += `#${i + 1}\nFecha: ${fb.fecha}\nDoctor: ${fb.doctor}\nProcedimiento: ${fb.procedimiento}\nFeedback: ${fb.comentario}\n\n`;
  });

  const blob = new Blob([contenido], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `feedbacks_${filtro || 'todos'}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

function mostrarListaDoctores() {
  const contenedor = document.getElementById("listaDoctores");
  if (!contenedor) return;
  contenedor.innerHTML = "";

  doctores.forEach(doc => {
    const li = document.createElement("li");
    const encoded = encodeURIComponent(doc);
    li.innerHTML = `
      <span>${doc}</span>
      <div>
        <button onclick="window.open('index.html?doctor=${encoded}', '_blank')">Ver panel</button>
        <button onclick="copiarLink('${encoded}')">Copiar enlace</button>
      </div>
    `;
    contenedor.appendChild(li);
  });
}

function copiarLink(encoded) {
  const enlace = `${window.location.origin}/index.html?doctor=${encoded}`;
  navigator.clipboard.writeText(enlace).then(() => {
    mostrarAlerta("✅ Enlace copiado al portapapeles.");
  });
}

function mostrarAlerta(mensaje) {
  const alerta = document.createElement("div");
  alerta.className = "alerta";
  alerta.textContent = mensaje;
  document.body.appendChild(alerta);
  setTimeout(() => {
    alerta.remove();
  }, 3000);
}
