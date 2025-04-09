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
                setStatus(
                    `✅ Archivos subidos correctamente: ${data.ids.join(", ")}`
                );
            } else {
                setStatus(`❌ Error en la subida: ${data.message}`);
            }
        } catch (error) {
            console.error("Error al subir archivos:", error);
            setStatus("❌ Error inesperado al subir los archivos.");
        }
    };

    const handleDelete = async () => {
        const confirmDelete = confirm(
            "¿Estás seguro de que deseas eliminar todos los archivos de la carpeta?"
        );
        if (!confirmDelete) return;

        try {
            const res = await fetch("/api/google/invoices", { method: "DELETE" });
          
            const contentType = res.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
              const data = await res.json();
          
              if (res.ok) {
                setStatus(`🗑️ ${data.message}`);
              } else {
                setStatus(`❌ Error al borrar archivos: ${data.message}`);
              }
            } else {
              throw new Error("Respuesta no es JSON");
            }
          
          } catch (error) {
            console.error("Error al borrar archivos:", error);
            setStatus("❌ Error inesperado al borrar los archivos.");
          }
    };

    return (
        <div className="space-y-4">
            <form onSubmit={handleSubmit}>
                <input
                    type="file"
                    name="file"
                    accept=".xml"
                    multiple
                    onChange={(e) => setSelectedFiles(e.target.files)}
                />
                <button type="submit">Subir XMLs</button>
            </form>

            <button
                onClick={handleDelete}
                style={{ marginTop: "1rem", color: "red" }}
            >
                🗑️ Eliminar archivos de la carpeta
            </button>

            {status && <p dangerouslySetInnerHTML={{ __html: status }} />}
        </div>
    );
}
