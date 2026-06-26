const CLASSES = ["Tumor", "MS", "Injury", "Normal"];

export default function MetricsPanel({ metrics }) {
    if (!metrics) return null;
    const cm = metrics.confusion_matrix;
    const max = Math.max(...cm.flat());

    return (
        <section id="metrics" className="border-t border-white/10 relative z-10" data-testid="metrics-section">
            <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-12 grid grid-cols-12 gap-6">
                
                <div className="col-span-12 lg:col-span-5">
                    <div className="kicker text-blue-400">03 · EVALUATION</div>
                    <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight mt-2 text-white">
                        Model performance.
                    </h2>
                    <p className="text-zinc-400 text-sm mt-3 leading-relaxed max-w-md font-light">
                        Aggregate diagnostic metrics over the test split + ongoing predictions.
                        Dice and IoU capture segmentation quality; the confusion matrix captures classification.
                    </p>

                    <div className="grid grid-cols-2 gap-px bg-white/10 border border-white/10 mt-6 rounded-xl overflow-hidden glass-panel">
                        <Stat label="Avg Dice" value={metrics.avg_dice.toFixed(3)} />
                        <Stat label="Avg IoU" value={metrics.avg_iou.toFixed(3)} />
                        <Stat label="Accuracy" value={(metrics.classification_report.accuracy * 100).toFixed(1) + "%"} />
                        <Stat label="Classes" value="04" />
                    </div>

                    <div className="mt-6 border border-white/10 rounded-xl overflow-hidden glass-card">
                        <div className="px-4 py-3 border-b border-white/10 kicker text-white bg-black/20">PER-CLASS F1</div>
                        <div className="p-4 space-y-2">
                            {CLASSES.map((c) => {
                                const r = metrics.classification_report[c] || { f1: 0 };
                                return (
                                    <div key={c} className="grid grid-cols-12 items-center gap-2 text-xs">
                                        <span className={`col-span-3 font-mono cls-${c}`}>{c}</span>
                                        <div className="col-span-7 h-1.5 progress-track relative">
                                            <div
                                                className={`progress-fill shadow-[0_0_10px_currentcolor] bg-cls-${c} text-cls-${c}`}
                                                style={{ width: `${Math.min(100, r.f1 * 100)}%` }}
                                            />
                                        </div>
                                        <span className="col-span-2 text-right font-mono text-zinc-300">
                                            {(r.f1 || 0).toFixed(3)}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className="col-span-12 lg:col-span-7">
                    <div className="border border-white/10 rounded-t-xl overflow-hidden glass-card">
                        <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between bg-black/20">
                            <span className="kicker text-white">CONFUSION MATRIX</span>
                            <span className="kicker text-zinc-500">PREDICTED →</span>
                        </div>

                        <div className="p-8">
                            <div className="grid" style={{ gridTemplateColumns: "100px repeat(4, 1fr)" }}>
                                <div />
                                {CLASSES.map((c) => (
                                    <div key={c} className={`text-center kicker cls-${c}`}>
                                        {c}
                                    </div>
                                ))}

                                {cm.map((row, i) => (
                                    <RowCells key={i} row={row} max={max} actual={CLASSES[i]} />
                                ))}
                            </div>

                            <div className="mt-6 kicker text-zinc-500">↑ ACTUAL</div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-white/10 border border-white/10 border-t-0 rounded-b-xl overflow-hidden glass-panel">
                        {CLASSES.map((c) => {
                            const r = metrics.classification_report[c] || {};
                            return (
                                <div key={c} className="bg-black/40 p-4 transition-colors hover:bg-white/5" data-testid={`metric-card-${c}`}>
                                    <div className={`kicker cls-${c}`}>{c}</div>
                                    <div className="grid grid-cols-3 gap-2 mt-3 text-sm font-mono text-white">
                                        <div>
                                            <div className="text-zinc-500 text-[10px] mb-1">P</div>
                                            {(r.precision || 0).toFixed(2)}
                                        </div>
                                        <div>
                                            <div className="text-zinc-500 text-[10px] mb-1">R</div>
                                            {(r.recall || 0).toFixed(2)}
                                        </div>
                                        <div>
                                            <div className="text-zinc-500 text-[10px] mb-1">F1</div>
                                            {(r.f1 || 0).toFixed(2)}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}

const RowCells = ({ row, max, actual }) => (
    <>
        <div className={`kicker cls-${actual} flex items-center pr-3 justify-end`}>
            {actual}
        </div>

        {row.map((v, j) => {
            const intensity = max > 0 ? v / max : 0;
            return (
                <div
                    key={j}
                    className="aspect-square border border-white/5 flex items-center justify-center font-mono text-sm transition-transform duration-300 hover:scale-105 hover:z-10 rounded-md m-0.5"
                    style={{
                        backgroundColor: intensity > 0 ? `rgba(59, 130, 246, ${Math.max(0.1, intensity)})` : 'rgba(255,255,255,0.02)',
                        color: intensity > 0.3 ? "white" : "rgba(255,255,255,0.4)",
                        boxShadow: intensity > 0.5 ? `0 0 20px rgba(59, 130, 246, ${intensity * 0.5})` : 'none',
                    }}
                >
                    {v}
                </div>
            );
        })}
    </>
);

const Stat = ({ label, value }) => (
    <div className="bg-black/40 p-5 transition-colors hover:bg-white/5">
        <div className="kicker text-zinc-400">{label}</div>
        <div className="font-display text-3xl font-semibold mt-2 text-white">{value}</div>
    </div>
);