"use client";

import { useState, useRef } from "react";
import Button from "./Button";

export default function UploadForm() {
    const inputRef = useRef(null);
    const [xmlFiles, setXmlFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const [status, setStatus] = useState("");

    // Leer archivos XML
    const handleFilesRead = (files) => {
        const fileList = Array.from(files).filter(
            (file) => file.type === "text/xml" || file.name.endsWith(".xml")
        );

        if (fileList.length === 0) {
            alert("❌ Solo se permiten archivos .xml");
            return;
        }

        const newResults = [];

        fileList.forEach((file) => {
            const reader = new FileReader();

            reader.onload = (e) => {
                const textContent = e.target.result;
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(
                    textContent,
                    "application/xml"
                );

                const rootName = xmlDoc.documentElement.nodeName;

                newResults.push({
                    name: file.name,
                    content: textContent,
                    root: rootName,
                });

                if (newResults.length === fileList.length) {
                    setXmlFiles(newResults);
                }
            };

            reader.readAsText(file);
        });
    };

    // Drag & Drop
    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(e.type === "dragenter" || e.type === "dragover");
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        handleFilesRead(e.dataTransfer.files);
    };

    const handleFileSelect = (e) => {
        handleFilesRead(e.target.files);
    };

    const handleBrowseClick = () => {
        inputRef.current.click();
    };


    const handleDownloadClick = async () => {
        if (xmlFiles.length === 0) {
            alert("❌ No hay archivos XML cargados.");
            return;
        }
    
        setLoading(true);
        setStatus("Generando Excel...");
    
        try {
            const xmlArray = xmlFiles.map(file => file.content);
    
            const response = await fetch("/api/generar-excel", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ xmlArray }),
            });
    
            if (!response.ok) {
                throw new Error("Error generando el archivo Excel.");
            }
    
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
    
            const link = document.createElement('a');
            link.href = url;
            link.download = 'facturas.xlsx';
            document.body.appendChild(link);
            link.click();
            link.remove();
    
            window.URL.revokeObjectURL(url);
            setStatus("✅ Excel descargado exitosamente.");
        } catch (error) {
            console.error(error);
            alert("❌ Ocurrió un error al generar el Excel.");
            setStatus("❌ Error al descargar.");
        } finally {
            setLoading(false);
        }
    };
    

    return (
        <>
            <form
                className="w-full h-full flex flex-col bg-content1 rounded-b-2xl"
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
            >
                <div
                    className={`p-7 flex justify-center items-center flex-1 flex-col transition-all rounded-xl ${
                        dragActive ? "bg-default-100" : "bg-content1"
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

                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={48}
                        height={48}
                        viewBox="0 0 24 24"
                    >
                        <g
                            fill="none"
                            stroke="#A1A1AA"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                        >
                            <path
                                strokeDasharray={20}
                                strokeDashoffset={20}
                                d="M8 19h-1c-2.5 0 -4-2 -4-4c0-2 1.5-4 4-4c1 0 1.5 0.5 1.5 0.5M16 19h1c2.5 0 4-2 4-4c0-2 -1.5-4 -4-4c-1 0 -1.5 0.5 -1.5 0.5"
                            >
                                <animate
                                    attributeName="stroke-dashoffset"
                                    dur="0.4s"
                                    values="20;0"
                                    fill="freeze"
                                />
                            </path>
                            <path
                                strokeDasharray={20}
                                strokeDashoffset={20}
                                d="M7 11v-1c0-2.5 2-5 5-5M17 11v-1c0-2.5-2-5-5-5"
                            >
                                <animate
                                    attributeName="stroke-dashoffset"
                                    begin="0.4s"
                                    dur="0.3s"
                                    values="20;0"
                                    fill="freeze"
                                />
                            </path>
                            <path
                                strokeDasharray={8}
                                strokeDashoffset={8}
                                d="M12 20v-6"
                            >
                                <animate
                                    attributeName="stroke-dashoffset"
                                    begin="0.8s"
                                    dur="0.2s"
                                    values="8;0"
                                    fill="freeze"
                                />
                            </path>
                            <path
                                strokeDasharray={4}
                                strokeDashoffset={4}
                                d="M12 13l2 2M12 13l-2 2"
                            >
                                <animate
                                    attributeName="stroke-dashoffset"
                                    begin="1s"
                                    dur="0.2s"
                                    values="4;0"
                                    fill="freeze"
                                />
                            </path>
                        </g>
                    </svg>

                    <p className="text-center text-sm text-gray-300 my-7">
                        Seleccione o arrastre archivos aquí
                        <br />
                        <span className="text-xs text-gray-500">
                            Formato .XML
                        </span>
                    </p>

                    {xmlFiles.length > 0 && (
                        <p className="text-sm text-gray-400 mb-4">
                            ✅ {xmlFiles.length} archivo
                            {xmlFiles.length > 1 ? "s" : ""} listo
                            {xmlFiles.length > 1 ? "s" : ""}
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
                    <Button
                        type="button"
                        onClick={handleDownloadClick}
                        variant={loading ? "loading" : "solid"}
                        color="green"
                        width="w-full"
                    >
                        Descargar
                    </Button>
                </div>
            </form>
        </>
    );
}
