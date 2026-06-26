import { useRef, useState } from "react";
import { Upload, FileImage, Loader2 } from "lucide-react";

export default function UploadZone({ onFile, loading }) {
    const inputRef = useRef(null);
    const [drag, setDrag] = useState(false);
    const [name, setName] = useState("");

    const handle = (file) => {
        if (!file) return;
        setName(file.name);
        onFile(file);
    };

    return (
        <div className="glass-card flex flex-col" data-testid="upload-card">
            <div className="px-5 py-3 border-b border-white/10 flex items-center justify-between">
                <div className="kicker">01 · INPUT</div>
                <div className="kicker">PNG · JPG · JPEG</div>
            </div>

            <div
                onDragOver={(e) => {
                    e.preventDefault();
                    setDrag(true);
                }}
                onDragLeave={() => setDrag(false)}
                onDrop={(e) => {
                    e.preventDefault();
                    setDrag(false);
                    handle(e.dataTransfer.files?.[0]);
                }}
                onClick={() => !loading && inputRef.current?.click()}
                className={`relative cursor-pointer transition-all duration-300 p-10 text-center border-2 border-dashed m-4 rounded-xl ${
                    drag
                        ? "border-blue-500 bg-blue-500/10 shadow-[0_0_30px_rgba(59,130,246,0.15)]"
                        : "border-white/20 bg-black/20 hover:border-white/40 hover:bg-white/5"
                }`}
                data-testid="upload-mri-zone"
            >
                <input
                    ref={inputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/jpg"
                    className="hidden"
                    onChange={(e) => handle(e.target.files?.[0])}
                    data-testid="upload-input"
                />

                <div className="flex flex-col items-center gap-3">
                    <div className="w-14 h-14 rounded-full border border-white/20 grid place-items-center bg-white/5 backdrop-blur-md shadow-lg transition-transform duration-300 group-hover:scale-110">
                        {loading ? (
                            <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
                        ) : (
                            <Upload className="w-6 h-6 text-zinc-300" />
                        )}
                    </div>

                    <div className="font-display text-xl font-medium tracking-tight text-white mt-2">
                        {loading ? "Analyzing slice..." : "Drop MRI slice"}
                    </div>

                    <div className="text-xs text-zinc-400 max-w-xs">
                        or click to browse. Image will be resized to 256x256 and processed by the segmentation pipeline.
                    </div>

                    {name && (
                        <div className="mt-4 inline-flex items-center gap-2 text-xs font-mono text-zinc-300 px-3 py-1.5 border border-white/10 rounded-full bg-white/5 backdrop-blur-md">
                            <FileImage className="w-3.5 h-3.5 text-blue-400" /> {name}
                        </div>
                    )}
                </div>
            </div>

            <div className="px-5 py-3 border-t border-white/10 flex items-center justify-between text-xs text-zinc-500 bg-black/20 rounded-b-xl">
                <span>Resize · CLAHE · Normalize</span>
                <span className="font-mono text-zinc-400">128-256 px</span>
            </div>
        </div>
    );
}