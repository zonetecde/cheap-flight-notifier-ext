import React, { FormEvent, useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";

const Popup = () => {
    const [currentURL, setCurrentURL] = useState<string>();
    const telegramsIdInputRef = React.useRef<HTMLInputElement>(null);

    useEffect(() => {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            setCurrentURL(tabs[0].url);
        });

        chrome.storage.sync.set({ key: "value" }, function () {});
    }, []);

    function handleTelegramsIdInput(event: FormEvent<HTMLInputElement>): void {
        const telegramsId = telegramsIdInputRef.current?.value;

        chrome.storage.sync.set({ telegramsId: telegramsId }, function () {});
    }

    // load them on start
    useMemo(() => {
        chrome.storage.sync.get(["telegramsId"], function (result) {
            if (result.telegramsId && telegramsIdInputRef.current) telegramsIdInputRef.current.value = result.telegramsId;
        });
    }, []);

    return (
        <>
            <div className="bg-sky-200 relative" style={{ minWidth: "375px", minHeight: "500px" }}>
                <img src="bg.png" alt="" className="absolute inset-0 object-contain" />
                <div className="absolute left-7 top-7 right-7 border-2 border-blue-300 rounded-lg -bottom-4 bg-white z-10 px-3  text-base">
                    <p className="text-2xl font-bold text-center mt-5">Cheap Flight Notifier</p>

                    <p className="mt-5">Vos identifiants Télégram, séparés par des virgules :</p>
                    <input type="text" className="border-2 border-blue-300 rounded-lg w-full mt-2 h-8 px-3 outline-none" ref={telegramsIdInputRef} onInput={handleTelegramsIdInput} />

                    <p className="mt-5">Vos vols espionnés :</p>
                </div>
            </div>
        </>
    );
};

const root = createRoot(document.getElementById("root")!);

root.render(
    <React.StrictMode>
        <Popup />
    </React.StrictMode>
);
