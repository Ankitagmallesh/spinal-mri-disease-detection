import { Trash2 } from "lucide-react";

export default function HistoryPanel({ items, onSelect, onDelete }) {
    return (
        <section id="history" className="border-t border-white/10 relative z-10" data-testid="history-section">
            <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-10">
                <div className="flex items-end justify-between mb-6">
                    <div>
                        <div className="kicker text-blue-400">04 · HISTORY</div>
                        <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight mt-2 text-white">
                            Recent predictions
                        </h2>
                    </div>
                    <span className="kicker text-zinc-500">{items.length} ENTRIES</span>
                </div>

                {items.length === 0 ? (
                    <div className="glass-card p-10 text-center text-zinc-400 text-sm border border-white/10" data-testid="history-empty">
                        No predictions yet. Run an analysis to populate history.
                    </div>
                ) : (
                    <div className="glass-panel overflow-x-auto rounded-xl">
                        <table className="w-full text-sm" data-testid="history-table">
                            <thead className="border-b border-white/10 bg-black/40">
                                <tr className="text-left">
                                    <Th>FILE</Th>
                                    <Th>CLASS</Th>
                                    <Th>CONFIDENCE</Th>
                                    <Th>DICE</Th>
                                    <Th>IoU</Th>
                                    <Th>LESIONS</Th>
                                    <Th>TIME</Th>
                                    <Th></Th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((rec) => (
                                    <tr
                                        key={rec.id}
                                        className="border-b border-white/5 hover:bg-white/5 cursor-pointer transition-colors"
                                        onClick={() => onSelect(rec)}
                                        data-testid={`history-row-${rec.id}`}
                                    >
                                        <Td className="font-mono text-zinc-300 max-w-[240px] truncate">
                                            {rec.filename}
                                        </Td>

                                        <Td>
                                            <span className={`inline-block px-2 py-0.5 border cls-${rec.predicted_class} font-mono text-xs`}>
                                                {rec.predicted_class}
                                            </span>
                                        </Td>

                                        <Td className="font-mono text-white">{rec.confidence.toFixed(1)}%</Td>
                                        <Td className="font-mono text-white">{rec.dice_score.toFixed(3)}</Td>
                                        <Td className="font-mono text-white">{rec.iou_score.toFixed(3)}</Td>
                                        <Td className="font-mono text-white">{rec.lesion_count}</Td>
                                        <Td className="text-zinc-500 text-xs font-mono">
                                            {new Date(rec.timestamp).toLocaleString()}
                                        </Td>

                                        <Td>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onDelete(rec.id);
                                                }}
                                                className="p-1.5 rounded hover:bg-red-500/20 hover:text-red-400 text-zinc-500 transition-colors"
                                                data-testid={`history-delete-${rec.id}`}
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </Td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </section>
    );
}

const Th = ({ children }) => (
    <th className="kicker px-4 py-4 font-medium text-zinc-400">{children}</th>
);

const Td = ({ children, className = "" }) => (
    <td className={`px-4 py-3 ${className}`}>{children}</td>
);