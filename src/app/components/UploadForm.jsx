"use client";

import { useState, useRef } from "react";
import Button from "./Button";

export default function UploadForm() {
    const [selectedFiles, setSelectedFiles] = useState(null);
    const [status, setStatus] = useState("");
    const [dragActive, setDragActive] = useState(false);
    const inputRef = useRef(null);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    }
    
    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
    
        const files = Array.from(e.dataTransfer.files);
        const xmlFiles = files.filter((file) => file.type === "text/xml" || file.name.endsWith(".xml"));
    
        if (xmlFiles.length === 0) {
            alert("❌ Solo se permiten archivos .xml");
            return;
        }
    
        setSelectedFiles(xmlFiles);
    };

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        const xmlFiles = files.filter((file) => file.type === "text/xml" || file.name.endsWith(".xml"));
    
        if (xmlFiles.length === 0) {
            alert("❌ Solo se permiten archivos .xml");
            return;
        }
    
        setSelectedFiles(xmlFiles);
    };

    const handleBrowseClick = () => {
        inputRef.current.click();
    }

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
        <form
            onSubmit={handleSubmit}
            className="w-full h-full flex flex-col bg-content1 rounded-b-2xl"
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
        >
            <div
                className={`p-7 flex justify-center items-center flex-1 flex-col  transition-all rounded-xl cursor-pointer ${
                    dragActive
                        ? "bg-default-100"
                        : "bg-content1"
                }`}
                onClick={handleBrowseClick}
            >
                <input
                    ref={inputRef}
                    type="file"
                    name="file"
                    accept=".xml"
                    multiple
                    onChange={handleFileSelect}
                    className="hidden"
                />
                <svg
                    className="w-10 h-10 text-gray-400 mb-2"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 16v-8m0 0l-3 3m3-3l3 3m-3-3v8m6 4H6a2 2 0 01-2-2V6a2 2 0 012-2h6.586a2 2 0 011.414.586l4.414 4.414A2 2 0 0120 10.414V20a2 2 0 01-2 2z"
                    />
                </svg>
                <p className="text-center text-sm text-gray-300">
                    Seleccione un archivo o arrástrelo y suéltelo aquí.
                    <br />
                    <span className="text-xs text-gray-500">Formato .XML</span>
                </p>
                {selectedFiles && selectedFiles.length > 0 && (
                    <p className="text-sm text-gray-400 mt-2">
                        ✅ {selectedFiles.length} archivo
                        {selectedFiles.length > 1 ? "s" : ""} seleccionado
                        {selectedFiles.length > 1 ? "s" : ""}
                    </p>
                )}
                <button
                    type="button"
                    className="mt-4 px-3 py-1 border rounded text-sm text-white border-white"
                    onClick={handleBrowseClick}
                >
                    Explorar archivos
                </button>
            </div>

            <div className="p-7 border-t border-t-[#3A3A3D] mt-auto flex justify-between gap-3">
                <Button type="submit" width="w-1/4">
                    Subir XMLs
                </Button>

                <Button
                    width="w-1/4"
                    onClick={handleDelete}
                    style={{ marginTop: "1rem", color: "red" }}
                >
                    Limpiar
                </Button>

                <Button
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
                    color="green"
                    width="w-1/2"
                >
                    Descargar
                </Button>

                {status && <p dangerouslySetInnerHTML={{ __html: status }} />}
            </div>
        </form>
    );
}
