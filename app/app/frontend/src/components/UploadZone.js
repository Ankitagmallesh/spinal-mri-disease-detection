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
        <div className="border border-zinc-200 bg-white" data-testid="upload-card">
            <div className="px-5 py-3 border-b border-zinc-200 flex items-center justify-between">
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
                className={`relative cursor-pointer transition-colors p-10 text-center border-2 border-dashed m-4 ${
                    drag
                        ? "border-blue-600 bg-blue-50"
                        : "border-zinc-300 bg-zinc-50 hover:border-zinc-900 hover:bg-white"
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
                    <div className="w-12 h-12 border border-zinc-300 grid place-items-center bg-white">
                        {loading ? (
                            <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                        ) : (
                            <Upload className="w-5 h-5" />
                        )}
                    </div>

                    <div className="font-display text-xl font-medium tracking-tight">
                        {loading ? "Analyzing slice..." : "Drop MRI slice"}
                    </div>

                    <div className="text-xs text-zinc-500 max-w-xs">
                        or click to browse. Image will be resized to 256x256 and processed by the segmentation pipeline.
                    </div>

                    {name && (
                        <div className="mt-2 inline-flex items-center gap-2 text-xs font-mono text-zinc-700 px-2 py-1 border border-zinc-200 bg-white">
                            <FileImage className="w-3 h-3" /> {name}
                        </div>
                    )}
                </div>
            </div>

            <div className="px-5 py-3 border-t border-zinc-200 flex items-center justify-between text-xs text-zinc-500">
                <span>Resize · CLAHE · Normalize</span>
                <span className="font-mono">128-256 px</span>
            </div>
        </div>
    );
}