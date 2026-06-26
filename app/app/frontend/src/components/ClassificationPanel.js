import { CheckCircle2, AlertTriangle, Lightbulb } from "lucide-react";

export default function ClassificationPanel({ record, loading }) {
    if (loading) {
        return (
            <div className="glass-card flex flex-col" data-testid="classification-loading">
                <div className="px-5 py-3 border-b border-white/10 kicker text-white">02 · CLASSIFICATION</div>
                <div className="p-8">
                    <div className="h-3 w-2/3 bg-white/10 mb-3 shimmer rounded-full" />
                    <div className="h-12 w-1/2 bg-white/10 mb-3 shimmer rounded-md" />
                    <div className="h-3 w-1/3 bg-white/10 shimmer rounded-full" />
                </div>
            </div>
        );
    }

    if (!record) {
        return (
            <div className="glass-card flex flex-col" data-testid="classification-empty">
                <div className="px-5 py-3 border-b border-white/10 kicker text-white">02 · CLASSIFICATION</div>
                <div className="p-8 text-zinc-500 text-sm">
                    Awaiting input. Predicted class, confidence and class probability distribution will appear here.
                </div>
            </div>
        );
    }

    const { predicted_class, confidence, confidence_level, probabilities, reasoning } = record;
    const isHigh = confidence_level === "High";

    return (
        <div className="glass-card flex flex-col relative overflow-hidden" data-testid="classification-result">
            {/* Ambient background glow based on predicted class */}
            <div className={`absolute -top-20 -right-20 w-64 h-64 rounded-full blur-[100px] opacity-20 bg-cls-${predicted_class} pointer-events-none`} />

            <div className="px-5 py-3 border-b border-white/10 flex items-center justify-between relative z-10">
                <span className="kicker text-white">02 · CLASSIFICATION</span>
                <span className={`kicker ${isHigh ? "text-emerald-400" : "text-amber-400"}`}>
                    {isHigh ? "HIGH CONFIDENCE" : "LOW CONFIDENCE"}
                </span>
            </div>

            <div className="p-6 space-y-5">
                {/* Predicted Class */}
                <div>
                    <div className="kicker">PREDICTED CLASS</div>
                    <div className="flex items-baseline gap-3 mt-2">
                        <span
                            className={`font-display font-bold tracking-tight text-5xl cls-${predicted_class}`}
                            data-testid="predicted-class-label"
                        >
                            {predicted_class}
                        </span>
                        <span className="text-zinc-500 font-mono text-xs">
                            CLASS {["Tumor", "MS", "Injury", "Normal"].indexOf(predicted_class) + 1}/4
                        </span>
                    </div>
                </div>

                {/* Confidence */}
                <div>
                    <div className="flex items-center justify-between text-xs">
                        <span className="kicker">CONFIDENCE</span>
                        <span className="font-mono font-semibold text-white" data-testid="confidence-value">
                            {confidence.toFixed(2)}%
                        </span>
                    </div>

                    <div className="mt-2 h-2.5 progress-track relative">
                        <div
                            className={`progress-fill shadow-[0_0_10px_currentcolor] ${isHigh ? "bg-emerald-500 text-emerald-500" : "bg-amber-500 text-amber-500"}`}
                            style={{ width: `${Math.max(2, Math.min(100, confidence))}%` }}
                            data-testid="confidence-bar"
                        />
                        <div
                            className="absolute top-0 bottom-0 border-l border-white/30 z-10"
                            style={{ left: "85%" }}
                        >
                            <span className="absolute -top-5 -translate-x-1/2 text-[9px] font-mono text-zinc-400">
                                85%
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-zinc-400 mt-3">
                        {isHigh ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                        )}
                        <span>
                            {isHigh
                                ? "Above 85% confidence threshold."
                                : "Below 85% — consider additional review."}
                        </span>
                    </div>
                </div>

                {/* Reasoning */}
                {reasoning && (
                    <div
                        className="border border-blue-500/20 bg-blue-500/10 p-4 rounded-xl backdrop-blur-md relative overflow-hidden"
                        data-testid="diagnostic-reasoning"
                    >
                        <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.8)]"></div>
                        <div className="flex items-center gap-2">
                            <Lightbulb className="w-4 h-4 text-blue-400" />
                            <span className="kicker text-blue-400">DIAGNOSTIC REASONING</span>
                        </div>
                        <div className="mt-2 text-sm text-blue-100 leading-relaxed font-light">
                            {reasoning}
                        </div>
                    </div>
                )}

                {/* Probability Distribution */}
                <div>
                    <div className="kicker mb-2">PROBABILITY DISTRIBUTION</div>
                    <div className="space-y-2" data-testid="probability-distribution">
                        {Object.entries(probabilities).map(([cls, p]) => (
                            <div key={cls} className="grid grid-cols-12 items-center gap-2 text-xs">
                                <span className={`col-span-3 font-mono cls-${cls}`}>{cls}</span>
                                <div className="col-span-7 h-1.5 progress-track relative">
                                    <div
                                        className={`progress-fill shadow-[0_0_10px_currentcolor] bg-cls-${cls} text-cls-${cls}`}
                                        style={{ width: `${Math.min(100, p)}%` }}
                                    />
                                </div>
                                <span className="col-span-2 text-right font-mono text-zinc-300">
                                    {p.toFixed(1)}%
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-px bg-white/10 border border-white/10 mt-4 rounded-xl overflow-hidden glass-panel">
                    <Metric label="Dice" value={record.dice_score.toFixed(3)} />
                    <Metric label="IoU" value={record.iou_score.toFixed(3)} />
                    <Metric label="Lesions" value={record.lesion_count} />
                </div>
            </div>
        </div>
    );
}

const Metric = ({ label, value }) => (
    <div className="bg-black/40 p-4 transition-colors hover:bg-white/5">
        <div className="kicker text-[10px] text-zinc-400">{label}</div>
        <div className="font-display text-2xl font-semibold mt-1 text-white">{value}</div>
    </div>
);