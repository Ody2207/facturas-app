"use client";

import { useState } from "react";

function HomePage() {
    const [status, setStatus] = useState(null);
    const [files, setFile] = useState();
    const [message, setMessage] = useState('');

    const getProcess = async () => {
        try {
            const res = await fetch('/api/process')
            const data = await res.json()

            setMessage(data.message)
            getStatus()
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    const getStatus = async () => {
        try {
            const res = await fetch('/api/process')

            setStatus(res.status)
        } catch (err) {
            console.error(err)
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

                { status === 200 ? <a href="excel/facturas.xlsx">Descargar</a> : null }
            </form>

            <p>Status: {message}</p>
        </div>
    );
}

export default HomePage;
