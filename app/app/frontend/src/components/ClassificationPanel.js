import { CheckCircle2, AlertTriangle, Lightbulb } from "lucide-react";

export default function ClassificationPanel({ record, loading }) {
    if (loading) {
        return (
            <div className="border border-zinc-200 bg-white" data-testid="classification-loading">
                <div className="px-5 py-3 border-b border-zinc-200 kicker">02 · CLASSIFICATION</div>
                <div className="p-8">
                    <div className="h-3 w-2/3 bg-zinc-100 mb-3 shimmer" />
                    <div className="h-12 w-1/2 bg-zinc-100 mb-3 shimmer" />
                    <div className="h-3 w-1/3 bg-zinc-100 shimmer" />
                </div>
            </div>
        );
    }

    if (!record) {
        return (
            <div className="border border-zinc-200 bg-white" data-testid="classification-empty">
                <div className="px-5 py-3 border-b border-zinc-200 kicker">02 · CLASSIFICATION</div>
                <div className="p-8 text-zinc-400 text-sm">
                    Awaiting input. Predicted class, confidence and class probability distribution will appear here.
                </div>
            </div>
        );
    }

    const { predicted_class, confidence, confidence_level, probabilities, reasoning } = record;
    const isHigh = confidence_level === "High";

    return (
        <div className="border border-zinc-200 bg-white" data-testid="classification-result">
            <div className="px-5 py-3 border-b border-zinc-200 flex items-center justify-between">
                <span className="kicker">02 · CLASSIFICATION</span>
                <span className={`kicker ${isHigh ? "text-emerald-600" : "text-amber-600"}`}>
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
                        <span className="text-zinc-400 font-mono text-xs">
                            CLASS {["Tumor", "MS", "Injury", "Normal"].indexOf(predicted_class) + 1}/4
                        </span>
                    </div>
                </div>

                {/* Confidence */}
                <div>
                    <div className="flex items-center justify-between text-xs">
                        <span className="kicker">CONFIDENCE</span>
                        <span className="font-mono font-semibold" data-testid="confidence-value">
                            {confidence.toFixed(2)}%
                        </span>
                    </div>

                    <div className="mt-2 h-2 bg-zinc-100 relative">
                        <div
                            className={`h-full ${isHigh ? "bg-emerald-500" : "bg-amber-500"}`}
                            style={{ width: `${Math.max(2, Math.min(100, confidence))}%` }}
                            data-testid="confidence-bar"
                        />
                        <div
                            className="absolute top-0 bottom-0 border-l border-zinc-400"
                            style={{ left: "85%" }}
                        >
                            <span className="absolute -top-5 -translate-x-1/2 text-[9px] font-mono text-zinc-500">
                                85%
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-zinc-600 mt-2">
                        {isHigh ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                        )}
                        <span>
                            {isHigh
                                ? "Above 95% confidence threshold."
                                : "Below 95% — consider additional review."}
                        </span>
                    </div>
                </div>

                {/* Reasoning */}
                {reasoning && (
                    <div
                        className="border border-blue-200 bg-blue-50 p-3"
                        data-testid="diagnostic-reasoning"
                    >
                        <div className="flex items-center gap-2">
                            <Lightbulb className="w-3.5 h-3.5 text-blue-700" />
                            <span className="kicker text-blue-700">DIAGNOSTIC REASONING</span>
                        </div>
                        <div className="mt-1.5 text-xs text-blue-900 leading-relaxed">
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
                                <div className="col-span-7 h-1.5 bg-zinc-100 relative">
                                    <div
                                        className={`h-full bg-cls-${cls}`}
                                        style={{ width: `${Math.min(100, p)}%` }}
                                    />
                                </div>
                                <span className="col-span-2 text-right font-mono">
                                    {p.toFixed(1)}%
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-px bg-zinc-200 border border-zinc-200 mt-2">
                    <Metric label="Dice" value={record.dice_score.toFixed(3)} />
                    <Metric label="IoU" value={record.iou_score.toFixed(3)} />
                    <Metric label="Lesions" value={record.lesion_count} />
                </div>
            </div>
        </div>
    );
}

const Metric = ({ label, value }) => (
    <div className="bg-white p-3">
        <div className="kicker text-[10px]">{label}</div>
        <div className="font-display text-xl font-semibold mt-1">{value}</div>
    </div>
);