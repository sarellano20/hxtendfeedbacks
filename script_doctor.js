const SHEET_FEEDBACK_URL = "https://script.google.com/macros/s/AKfycbwXbmYpSTIThQ0W1mubqKCSsD08NblLwa-pWyudYTkEPpUpPbl7TUVXlqTT92C3nXg98g/exec";

let doctorActivo = "";

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const doctor = params.get("doctor");

  if (!doctor) {
    document.body.innerHTML = "<p style='color:white;text-align:center;margin-top:20px;'>Acceso no válido. Parámetro 'doctor' requerido.</p>";
    return;
  }

  doctorActivo = decodeURIComponent(doctor);
  localStorage.setItem("doctor_activo", doctorActivo);
});

function guardarFeedback() {
  const procedimiento = document.getElementById("procedimiento").value.trim();
  const comentario = document.getElementById("comentario").value.trim();

  if (!procedimiento || !comentario) {
    alert("Por favor, complete todos los campos.");
    return;
  }

  const data = {
    doctor: doctorActivo,
    procedimiento: procedimiento,
    comentario: comentario
  };

  fetch(SHEET_FEEDBACK_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
  .then(() => {
    mostrarAlerta("✅ Feedback enviado exitosamente.");
    document.getElementById("procedimiento").value = "";
    document.getElementById("comentario").value = "";
  })
  .catch(() => {
    alert("❌ Error al enviar el feedback. Verifique su conexión o intente más tarde.");
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
