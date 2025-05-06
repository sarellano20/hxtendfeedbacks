document.addEventListener("DOMContentLoaded", mostrarFeedbacks);

function guardarFeedback() {
  const persona = document.getElementById("persona").value.trim();
  const comentario = document.getElementById("comentario").value.trim();

  if (!persona || !comentario) {
    alert("Por favor, completa todos los campos.");
    return;
  }

  const feedback = {
    nombre: persona,
    comentario: comentario,
    fecha: new Date().toLocaleString()
  };

  let feedbacks = JSON.parse(localStorage.getItem("feedbacks")) || [];
  feedbacks.push(feedback);
  localStorage.setItem("feedbacks", JSON.stringify(feedbacks));

  document.getElementById("comentario").value = "";
  mostrarFeedbacks();
}

function mostrarFeedbacks() {
  const contenedor = document.getElementById("listaFeedbacks");
  contenedor.innerHTML = "";

  const feedbacks = JSON.parse(localStorage.getItem("feedbacks")) || [];

  feedbacks.reverse().forEach(fb => {
    const div = document.createElement("div");
    div.innerHTML = `<strong>${fb.nombre}</strong> <em>(${fb.fecha})</em><br/>${fb.comentario}`;
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
    contenido += `#${index + 1}\nNombre: ${fb.nombre}\nFecha: ${fb.fecha}\nComentario: ${fb.comentario}\n\n`;
  });

  const blob = new Blob([contenido], { type: "text/plain" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "feedbacks_hxtend.txt";
  a.click();
  URL.revokeObjectURL(url);
}
