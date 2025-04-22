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
        <section className="flex justify-center items-center w-full h-screen bg-backgroud">
            <section className="with-card h-1/2 bg-content1 rounded-2xl space-y-*">
                <div className="p-7 border-b border-b-[#3A3A3D]">
                    <h2 className="text-lg font-bold text-[#f4f4f5]">
                        Subir los archivos
                    </h2>
                    <p className="text-sm text-[#A1A1AA]">
                        Seleccione los archivos .xml
                    </p>
                </div>

                <div className="h-full rounded-b-2x">
                    <UploadForm />
                </div>
            </section>
        </section>
    );
}

export default HomePage;


