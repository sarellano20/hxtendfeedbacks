document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const doctor = params.get("doctor");
  if (!doctor) {
    alert("No se encontró el nombre del doctor. Use el enlace personalizado.");
    document.body.innerHTML = "<p style='text-align:center'>Acceso no válido.</p>";
    return;
  }
  localStorage.setItem("doctor_activo", doctor); // por seguridad
});

function guardarFeedback() {
  const doctor = localStorage.getItem("doctor_activo");
  const procedimiento = document.getElementById("procedimiento").value.trim();
  const comentario = document.getElementById("comentario").value.trim();

  if (!procedimiento || !comentario) {
    alert("Por favor, complete todos los campos.");
    return;
  }

  const feedback = {
    doctor,
    procedimiento,
    comentario,
    fecha: new Date().toLocaleString()
  };

  let feedbacks = JSON.parse(localStorage.getItem("feedbacks")) || [];
  feedbacks.push(feedback);
  localStorage.setItem("feedbacks", JSON.stringify(feedbacks));

  alert("Feedback enviado correctamente.");
  document.getElementById("procedimiento").value = "";
  document.getElementById("comentario").value = "";
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
