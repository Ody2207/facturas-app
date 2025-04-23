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
                className={`p-7 flex justify-center items-center flex-1 flex-col  transition-all rounded-xl ${
                    dragActive
                        ? "bg-default-100"
                        : "bg-content1"
                }`}
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
                
                <svg xmlns="http://www.w3.org/2000/svg" width={48} height={48} viewBox="0 0 24 24"><g fill="none" stroke="#A1A1AA" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}><path strokeDasharray={20} strokeDashoffset={20} d="M8 19h-1c-2.5 0 -4 -2 -4 -4c0 -2 1.5 -4 4 -4c1 0 1.5 0.5 1.5 0.5M16 19h1c2.5 0 4 -2 4 -4c0 -2 -1.5 -4 -4 -4c-1 0 -1.5 0.5 -1.5 0.5"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.4s" values="20;0"></animate></path><path strokeDasharray={20} strokeDashoffset={20} d="M7 11v-1c0 -2.5 2 -5 5 -5M17 11v-1c0 -2.5 -2 -5 -5 -5"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.4s" dur="0.3s" values="20;0"></animate></path><path strokeDasharray={8} strokeDashoffset={8} d="M12 20v-6"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.8s" dur="0.2s" values="8;0"></animate></path><path strokeDasharray={4} strokeDashoffset={4} d="M12 13l2 2M12 13l-2 2"><animate fill="freeze" attributeName="stroke-dashoffset" begin="1s" dur="0.2s" values="4;0"></animate></path></g></svg>

                <p className="text-center text-sm text-gray-300 my-7">
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
                <Button
                    type="button"
                    onClick={handleBrowseClick}
                    variant="ghost"
                >
                    Explorar archivos
                </Button>
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
