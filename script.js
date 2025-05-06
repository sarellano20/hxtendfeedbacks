document.addEventListener("DOMContentLoaded", mostrarFeedbacks);

function guardarFeedback() {
  const doctor = document.getElementById("doctor").value.trim();
  const procedimiento = document.getElementById("procedimiento").value.trim();
  const comentario = document.getElementById("comentario").value.trim();

  if (!doctor || !procedimiento || !comentario) {
    alert("Por favor, completa todos los campos.");
    return;
  }

  const feedback = {
    doctor: doctor,
    procedimiento: procedimiento,
    comentario: comentario,
    fecha: new Date().toLocaleString()
  };

  let feedbacks = JSON.parse(localStorage.getItem("feedbacks")) || [];
  feedbacks.push(feedback);
  localStorage.setItem("feedbacks", JSON.stringify(feedbacks));

  document.getElementById("doctor").value = "";
  document.getElementById("procedimiento").value = "";
  document.getElementById("comentario").value = "";
  mostrarFeedbacks();
}

function mostrarFeedbacks() {
  const contenedor = document.getElementById("listaFeedbacks");
  contenedor.innerHTML = "";

  const feedbacks = JSON.parse(localStorage.getItem("feedbacks")) || [];

  const filtroDoctor = document.getElementById("filtro-doctor");
  const doctorFiltrado = filtroDoctor ? filtroDoctor.value : "";

  // Actualizar select de filtro (solo si existe)
  if (filtroDoctor && filtroDoctor.options.length === 0) {
    const doctores = [...new Set(feedbacks.map(fb => fb.doctor))];
    filtroDoctor.innerHTML = `<option value="">-- Todos --</option>`;
    doctores.forEach(doc => {
      const option = document.createElement("option");
      option.value = doc;
      option.textContent = doc;
      filtroDoctor.appendChild(option);
    });
  }

  const filtrados = doctorFiltrado
    ? feedbacks.filter(fb => fb.doctor === doctorFiltrado)
    : feedbacks;

  if (filtrados.length === 0) {
    contenedor.innerHTML = `<p>No hay feedbacks disponibles para este doctor.</p>`;
    return;
  }

  filtrados.reverse().forEach(fb => {
    const div = document.createElement("div");
    div.className = "feedback-item";
    div.innerHTML = `<strong>${fb.fecha}</strong><br/>
    <u>Doctor:</u> ${fb.doctor}<br/>
    <u>Procedimiento:</u> ${fb.procedimiento}<br/>
    <u>Feedback:</u> ${fb.comentario}`;
    contenedor.appendChild(div);
  });
}

function descargarFeedbacks() {
  const feedbacks = JSON.parse(localStorage.getItem("feedbacks")) || [];

  if (feedbacks.length === 0) {
    alert("No hay feedbacks guardados.");
    return;
  }

  let contenido = "FEEDBACKS HXTEND\n--------------------\n";
  feedbacks.forEach((fb, index) => {
    contenido += `#${index + 1}\nFecha: ${fb.fecha}\nDoctor: ${fb.doctor}\nProcedimiento: ${fb.procedimiento}\nFeedback: ${fb.comentario}\n\n`;
  });

  const blob = new Blob([contenido], { type: "text/plain" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "feedbacks_hxtend.txt";
  a.click();
  URL.revokeObjectURL(url);
}

function descargarFiltrados() {
  const feedbacks = JSON.parse(localStorage.getItem("feedbacks")) || [];

  const filtroDoctor = document.getElementById("filtro-doctor");
  const doctorFiltrado = filtroDoctor ? filtroDoctor.value : "";

  const filtrados = doctorFiltrado
    ? feedbacks.filter(fb => fb.doctor === doctorFiltrado)
    : feedbacks;

  if (filtrados.length === 0) {
    alert("No hay feedbacks disponibles para este filtro.");
    return;
  }

  let contenido = `FEEDBACKS HXTEND ${doctorFiltrado ? `- ${doctorFiltrado}` : ''}\n--------------------\n`;
  filtrados.forEach((fb, index) => {
    contenido += `#${index + 1}\nFecha: ${fb.fecha}\nDoctor: ${fb.doctor}\nProcedimiento: ${fb.procedimiento}\nFeedback: ${fb.comentario}\n\n`;
  });

  const blob = new Blob([contenido], { type: "text/plain" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  const nombreArchivo = doctorFiltrado
    ? `feedbacks_${doctorFiltrado.replace(/\s+/g, "_")}.txt`
    : "feedbacks_hxtend.txt";
  a.download = nombreArchivo;
  a.click();
  URL.revokeObjectURL(url);
}

