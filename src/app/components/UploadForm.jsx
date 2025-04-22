"use client";

import { useState } from "react";
import Button from "./Button";

export default function UploadForm() {
    const [selectedFiles, setSelectedFiles] = useState(null);
    const [status, setStatus] = useState("");

    // 🔧 Función utilitaria para dividir archivos en grupos de 5
    const chunkArray = (array, size) => {
        const result = [];
        for (let i = 0; i < array.length; i += size) {
            result.push(array.slice(i, i + size));
        }
        return result;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedFiles || selectedFiles.length === 0) {
            setStatus("Por favor selecciona al menos un archivo.");
            return;
        }

        const chunks = chunkArray(Array.from(selectedFiles), 5);
        const allIds = [];

        try {
            for (const chunk of chunks) {
                const formData = new FormData();
                chunk.forEach((file) => formData.append("file", file));

                const res = await fetch("/api/google/invoices", {
                    method: "POST",
                    body: formData,
                });

                const data = await res.json();

                if (!res.ok) {
                    setStatus(
                        `❌ Error en la subida de un lote: ${data.message}`
                    );
                    return;
                }

                allIds.push(...data.ids);
            }

            setStatus(
                `✅ Archivos subidos correctamente: ${allIds.join(", ")}`
            );
        } catch (error) {
            console.error("Error al subir archivos:", error);
            setStatus("❌ Error inesperado al subir los archivos.", error);
        }
    };

    const handleDelete = async () => {
        const confirmDelete = confirm(
            "¿Estás seguro de que deseas eliminar todos los archivos de la carpeta?"
        );
        if (!confirmDelete) return;

        try {
            const res = await fetch("/api/google/invoices", {
                method: "DELETE",
            });
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
            consolefig.error("Error al borrar archivos:", error);
            setStatus("❌ Error inesperado al borrar los archivos.");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full h-full flex flex-col ">
            <div className="p-7 flex justify-center items-center flex-1 bg-green-300">
                <input
                    type="file"
                    name="file"
                    accept=".xml"
                    multiple
                    onChange={(e) => setSelectedFiles(e.target.files)}
                />
                <button type="submit">Subir XMLs</button>
            </div>

            <div className="p-7 border-t border-t-[#3A3A3D] mt-auto bg-red-400">
                <button
                    onClick={handleDelete}
                    style={{ marginTop: "1rem", color: "red" }}
                >
                    🗑️ Eliminar archivos de la carpeta
                </button>
                <Button />

                <button
                    onClick={async () => {
                        const res = await fetch("/api/process");
                        const data = await res.json();

                        if (res.ok) {
                            alert("✅ " + data.message);
                            window.open(data.downloadUrl, "_blank");
                        } else {
                            alert("❌ " + data.message);
                        }
                    }}
                >
                    Generar y Descargar Excel
                </button>

                {status && <p dangerouslySetInnerHTML={{ __html: status }} />}
            </div>
        </form>
    );
}
