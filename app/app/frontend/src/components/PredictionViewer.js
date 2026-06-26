export default function PredictionViewer({ record }) {
    const tiles = [
        { label: "Original MRI", b64: record.original_b64, code: "T1", note: "Resized · CLAHE" },
        { label: "Segmented Cord", b64: record.segmented_b64, code: "T2", note: "Background dimmed" },
        { label: "Binary Mask", b64: record.mask_b64, code: "T3", note: "Cord region (1=cord)" },
        { label: "Disease Overlay", b64: record.overlay_b64, code: "T4", note: "Anomaly highlighted" },
    ];

    return (
        <div id="viewer" className="border border-zinc-200 bg-white fade-up">
            <div className="px-5 py-3 border-b border-zinc-200 flex items-center justify-between">
                <div className="kicker">VIEWER · 4-PANEL</div>
                <div className="kicker font-mono text-zinc-700">
                    {record.filename} · {new Date(record.timestamp).toLocaleString()}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-px bg-zinc-200">
                {tiles.map((t) => (
                    <Tile key={t.code} {...t} />
                ))}
            </div>

            <div className="px-5 py-3 border-t border-zinc-200 grid grid-cols-2 sm:grid-cols-4 text-xs">
                <Spec label="LESION COUNT" value={record.lesion_count} />
                <Spec label="LESION AREA" value={`${(record.lesion_area_ratio * 100).toFixed(2)}%`} />
                <Spec label="DICE" value={record.dice_score.toFixed(3)} />
                <Spec label="IoU" value={record.iou_score.toFixed(3)} />
            </div>
        </div>
    );
}

const Tile = ({ label, b64, code, note }) => (
    <div className="bg-white">
        <div className="flex items-center justify-between px-3 py-2 border-b border-zinc-200">
            <div className="kicker">{code} · {label}</div>
            <div className="kicker text-zinc-400">{note}</div>
        </div>
        <div className="aspect-square viewer-frame relative">
            <img
                src={`data:image/png;base64,${b64}`}
                alt={label}
                className="absolute inset-0 w-full h-full object-contain flicker"
            />
        </div>
    </div>
);

const Spec = ({ label, value }) => (
    <div className="px-3 py-2 border-r last:border-r-0 border-zinc-200">
        <div className="kicker text-[10px]">{label}</div>
        <div className="font-display text-base font-semibold mt-1">{value}</div>
    </div>
);