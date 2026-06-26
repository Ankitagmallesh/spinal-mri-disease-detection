const CLASSES = ["Tumor", "MS", "Injury", "Normal"];

export default function MetricsPanel({ metrics }) {
    if (!metrics) return null;
    const cm = metrics.confusion_matrix;
    const max = Math.max(...cm.flat());

    return (
        <section id="metrics" className="border-t border-zinc-200" data-testid="metrics-section">
            <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-12 grid grid-cols-12 gap-6">
                
                <div className="col-span-12 lg:col-span-5">
                    <div className="kicker">03 · EVALUATION</div>
                    <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight mt-2">
                        Model performance.
                    </h2>
                    <p className="text-zinc-600 text-sm mt-3 leading-relaxed max-w-md">
                        Aggregate diagnostic metrics over the test split + ongoing predictions.
                        Dice and IoU capture segmentation quality; the confusion matrix captures classification.
                    </p>

                    <div className="grid grid-cols-2 gap-px bg-zinc-200 border border-zinc-200 mt-6">
                        <Stat label="Avg Dice" value={metrics.avg_dice.toFixed(3)} />
                        <Stat label="Avg IoU" value={metrics.avg_iou.toFixed(3)} />
                        <Stat label="Accuracy" value={(metrics.classification_report.accuracy * 100).toFixed(1) + "%"} />
                        <Stat label="Classes" value="04" />
                    </div>

                    <div className="mt-6 border border-zinc-200">
                        <div className="px-4 py-2 border-b border-zinc-200 kicker">PER-CLASS F1</div>
                        <div className="p-4 space-y-2">
                            {CLASSES.map((c) => {
                                const r = metrics.classification_report[c] || { f1: 0 };
                                return (
                                    <div key={c} className="grid grid-cols-12 items-center gap-2 text-xs">
                                        <span className={`col-span-3 font-mono cls-${c}`}>{c}</span>
                                        <div className="col-span-7 h-1.5 bg-zinc-100">
                                            <div
                                                className={`h-full bg-cls-${c}`}
                                                style={{ width: `${Math.min(100, r.f1 * 100)}%` }}
                                            />
                                        </div>
                                        <span className="col-span-2 text-right font-mono">
                                            {(r.f1 || 0).toFixed(3)}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className="col-span-12 lg:col-span-7">
                    <div className="border border-zinc-200">
                        <div className="px-4 py-2 border-b border-zinc-200 flex items-center justify-between">
                            <span className="kicker">CONFUSION MATRIX</span>
                            <span className="kicker text-zinc-400">PREDICTED →</span>
                        </div>

                        <div className="p-6">
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

                            <div className="mt-4 kicker text-zinc-400">↑ ACTUAL</div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-zinc-200 border-x border-b border-zinc-200">
                        {CLASSES.map((c) => {
                            const r = metrics.classification_report[c] || {};
                            return (
                                <div key={c} className="bg-white p-3" data-testid={`metric-card-${c}`}>
                                    <div className={`kicker cls-${c}`}>{c}</div>
                                    <div className="grid grid-cols-3 gap-2 mt-2 text-xs font-mono">
                                        <div>
                                            <div className="text-zinc-400 text-[10px]">P</div>
                                            {(r.precision || 0).toFixed(2)}
                                        </div>
                                        <div>
                                            <div className="text-zinc-400 text-[10px]">R</div>
                                            {(r.recall || 0).toFixed(2)}
                                        </div>
                                        <div>
                                            <div className="text-zinc-400 text-[10px]">F1</div>
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
                    className="aspect-square border border-zinc-100 flex items-center justify-center font-mono text-sm"
                    style={{
                        backgroundColor: `rgba(37, 99, 235, ${intensity * 0.85})`,
                        color: intensity > 0.45 ? "white" : "#0a0a0a",
                    }}
                >
                    {v}
                </div>
            );
        })}
    </>
);

const Stat = ({ label, value }) => (
    <div className="bg-white p-4">
        <div className="kicker">{label}</div>
        <div className="font-display text-2xl font-semibold mt-1">{value}</div>
    </div>
);