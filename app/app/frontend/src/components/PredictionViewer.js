export default function PredictionViewer({ record }) {
    const tiles = [
        { label: "Original MRI", b64: record.original_b64, code: "T1", note: "Resized · CLAHE" },
        { label: "Segmented Cord", b64: record.segmented_b64, code: "T2", note: "Background dimmed" },
        { label: "Binary Mask", b64: record.mask_b64, code: "T3", note: "Cord region (1=cord)" },
        { label: "Disease Overlay", b64: record.overlay_b64, code: "T4", note: "Anomaly highlighted" },
    ];

    return (
        <div id="viewer" className="glass-panel overflow-hidden fade-up">
            <div className="px-5 py-4 border-b border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 bg-black/20">
                <div className="kicker text-white">VIEWER · 4-PANEL</div>
                <div className="kicker font-mono text-zinc-400">
                    {record.filename} · {new Date(record.timestamp).toLocaleString()}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-[1px] bg-white/10">
                {tiles.map((t) => (
                    <Tile key={t.code} {...t} />
                ))}
            </div>

            <div className="px-5 py-4 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-px text-xs bg-black/20">
                <Spec label="LESION COUNT" value={record.lesion_count} />
                <Spec label="LESION AREA" value={`${(record.lesion_area_ratio * 100).toFixed(2)}%`} />
                <Spec label="DICE" value={record.dice_score.toFixed(3)} />
                <Spec label="IoU" value={record.iou_score.toFixed(3)} />
            </div>
        </div>
    );
}

const Tile = ({ label, b64, code, note }) => (
    <div className="bg-black/60 relative group overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 py-3 border-b border-white/5 bg-black/40 absolute top-0 w-full z-10 transition-transform duration-300 transform -translate-y-full group-hover:translate-y-0 backdrop-blur-md">
            <div className="kicker text-white">{code} · {label}</div>
            <div className="kicker text-blue-400 text-[9px]">{note}</div>
        </div>
        <div className="aspect-square viewer-frame">
            <img
                src={`data:image/png;base64,${b64}`}
                alt={label}
                className="absolute inset-0 w-full h-full object-contain flicker transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 shadow-[inset_0_0_50px_rgba(0,0,0,0.8)] pointer-events-none"></div>
        </div>
    </div>
);

const Spec = ({ label, value }) => (
    <div className="px-4 py-2 border-r last:border-r-0 border-white/10 sm:border-r-white/10">
        <div className="kicker text-[10px] text-zinc-400">{label}</div>
        <div className="font-display text-lg font-semibold mt-1 text-white">{value}</div>
    </div>
);