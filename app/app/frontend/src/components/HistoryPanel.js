import { Trash2 } from "lucide-react";

export default function HistoryPanel({ items, onSelect, onDelete }) {
    return (
        <section id="history" className="border-t border-zinc-200" data-testid="history-section">
            <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-10">
                <div className="flex items-end justify-between mb-6">
                    <div>
                        <div className="kicker">04 · HISTORY</div>
                        <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight mt-2">
                            Recent predictions
                        </h2>
                    </div>
                    <span className="kicker">{items.length} ENTRIES</span>
                </div>

                {items.length === 0 ? (
                    <div className="border border-zinc-200 bg-zinc-50 p-10 text-center text-zinc-500 text-sm" data-testid="history-empty">
                        No predictions yet. Run an analysis to populate history.
                    </div>
                ) : (
                    <div className="border border-zinc-200 bg-white overflow-x-auto">
                        <table className="w-full text-sm" data-testid="history-table">
                            <thead className="border-b border-zinc-200">
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
                                        className="border-b border-zinc-100 hover:bg-zinc-50 cursor-pointer"
                                        onClick={() => onSelect(rec)}
                                        data-testid={`history-row-${rec.id}`}
                                    >
                                        <Td className="font-mono text-zinc-700 max-w-[240px] truncate">
                                            {rec.filename}
                                        </Td>

                                        <Td>
                                            <span className={`inline-block px-2 py-0.5 border cls-${rec.predicted_class} font-mono text-xs`}>
                                                {rec.predicted_class}
                                            </span>
                                        </Td>

                                        <Td className="font-mono">{rec.confidence.toFixed(1)}%</Td>
                                        <Td className="font-mono">{rec.dice_score.toFixed(3)}</Td>
                                        <Td className="font-mono">{rec.iou_score.toFixed(3)}</Td>
                                        <Td className="font-mono">{rec.lesion_count}</Td>
                                        <Td className="text-zinc-500 text-xs">
                                            {new Date(rec.timestamp).toLocaleString()}
                                        </Td>

                                        <Td>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onDelete(rec.id);
                                                }}
                                                className="p-1.5 hover:bg-red-50 hover:text-red-600 text-zinc-400 transition-colors"
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
    <th className="kicker px-4 py-3 font-medium text-zinc-500">{children}</th>
);

const Td = ({ children, className = "" }) => (
    <td className={`px-4 py-3 ${className}`}>{children}</td>
);