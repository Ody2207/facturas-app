"use client";

import { useState } from "react";

function HomePage() {
    const [files, setFile] = useState();
    const [message, setMessage] = useState('');

    const getProcess = async () => {
        try {
            const res = await fetch('/api/process')
            const data = await res.json()
            
            console.log(data)
            setMessage(data.message)
        } catch (error) {
            console.error("Error al procesar XML:", error);
            return null;
        }
    }
    return (
        <div>
            <form
                onSubmit={async (e) => {
                    e.preventDefault();

                    if (!files || files.length === 0) return;

                    const form = new FormData();
                    Array.from(files).forEach((file) => {
                        form.append("files", file);
                    });
                    // form.set('file', file)

                    // Sending file to server
                    const res = await fetch('/api/upload', {
                        method: 'POST',
                        body: form
                    })
                    const data = await res.json()
                    console.log(data)
                }}
            >
                <label>Upload file:</label>

                <input
                    type="file"
                    accept=".xml"
                    multiple
                    onChange={(e) => {
                        setFile(e.target.files);
                    }}
                />

                <button
                    type="button"
                    onClick={async (e) =>  {
                        const res = await fetch('/api/upload', {
                            method: 'DELETE'
                        })

                        console.log(res)
                    }}
                >Limpar</button>
                <button type="button" onClick={getProcess}>Correr</button>
                <button>Subir</button>
            </form>

            <p>Status: {message}</p>
        </div>
    );
}

export default HomePage;
