"use client";

import UploadForm from "./components/UploadForm";

function HomePage() {

    return (
        <section className="flex justify-center items-center w-full h-screen bg-backgroud">
            <section className="with-card h-1/2 bg-content1 rounded-2xl space-y-*">
                <div className="flex gap-3 p-7 border-b border-b-[#3A3A3D]">
                    <div className="border-2 border-[#A1A1AA] w-8 h-8 flex justify-center items-center rounded-full" >
                        <svg xmlns="http://www.w3.org/2000/svg" width={15} height={15} viewBox="0 0 24 24"><g fill="none" stroke="#A1A1AA" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}><path strokeDasharray={20} strokeDashoffset={20} d="M8 19h-1c-2.5 0 -4 -2 -4 -4c0 -2 1.5 -4 4 -4c1 0 1.5 0.5 1.5 0.5M16 19h1c2.5 0 4 -2 4 -4c0 -2 -1.5 -4 -4 -4c-1 0 -1.5 0.5 -1.5 0.5"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.4s" values="20;0"></animate></path><path strokeDasharray={20} strokeDashoffset={20} d="M7 11v-1c0 -2.5 2 -5 5 -5M17 11v-1c0 -2.5 -2 -5 -5 -5"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.4s" dur="0.3s" values="20;0"></animate></path><path strokeDasharray={8} strokeDashoffset={8} d="M12 20v-6"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.8s" dur="0.2s" values="8;0"></animate></path><path strokeDasharray={4} strokeDashoffset={4} d="M12 13l2 2M12 13l-2 2"><animate fill="freeze" attributeName="stroke-dashoffset" begin="1s" dur="0.2s" values="4;0"></animate></path></g></svg>  
                    </div>

                    <h2 className="text-lg font-bold leading-4 text-[#f4f4f5]">
                        Subir los archivos
                        <br />
                        <span className="text-sm font-light text-[#A1A1AA]">
                            Selecciona los archivos .xml
                        </span>
                    </h2>
                </div>

                <div className="h-full rounded-b-2x">
                    <UploadForm />
                </div>
            </section>
        </section>
    );
}

export default HomePage;


