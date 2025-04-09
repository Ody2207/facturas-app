"use client";

import { useState } from "react";
import UploadForm from "./components/UploadForm";

function HomePage() {
    const [status, setStatus] = useState(null);
    const [files, setFile] = useState();
    const [message, setMessage] = useState("");

    const getProcess = async () => {
        try {
            const res = await fetch("/api/process");
            const data = await res.json();

            setMessage(data.message);
            getStatus();
        } catch (error) {
            console.error(error);
            return null;
        }
    };

    const getStatus = async () => {
        try {
            const res = await fetch("/api/process");

            setStatus(res.status);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <UploadForm />

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
        </div>
    );
}

export default HomePage;
