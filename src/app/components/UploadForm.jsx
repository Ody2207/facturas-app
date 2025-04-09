"use client";

import { useState } from "react";

export default function UploadForm() {
  const [selectedFiles, setSelectedFiles] = useState(null);
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFiles || selectedFiles.length === 0) {
      setStatus("Por favor selecciona al menos un archivo.");
      return;
    }

    const formData = new FormData();
    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append("files", selectedFiles[i]);
    }

    try {
      const res = await fetch("/api/google/invoices", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setStatus(`✅ Archivos subidos correctamente: ${data.ids.join(", ")}`);
      } else {
        setStatus(`❌ Error en la subida: ${data.message}`);
      }
    } catch (error) {
      console.error("Error al subir archivos:", error);
      setStatus("❌ Error inesperado al subir los archivos.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="file"
        name="file"
        accept=".xml"
        multiple
        onChange={(e) => setSelectedFiles(e.target.files)}
      />
      <button type="submit">Subir XMLs</button>
      {status && <p>{status}</p>}
    </form>
  );
}
