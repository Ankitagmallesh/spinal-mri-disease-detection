export default function EmptyState() {
    return (
        <div className="border border-zinc-200 bg-white h-full min-h-[460px] flex flex-col" data-testid="empty-state">
            <div className="px-5 py-3 border-b border-zinc-200 kicker">VIEWER · STANDBY</div>

            <div className="grid grid-cols-2 gap-px bg-zinc-200 flex-1">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-white relative aspect-square">
                        <div className="absolute inset-0 viewer-frame" />
                        <div className="absolute inset-0 grid place-items-center text-cyan-300/40 font-mono text-xs">
                            T{i} · NO SIGNAL
                        </div>
                    </div>
                ))}
            </div>

            <div className="px-5 py-4 border-t border-zinc-200 flex items-center justify-between">
                <span className="kicker">UPLOAD SLICE TO BEGIN</span>
                <span className="kicker text-zinc-400">SYS · IDLE</span>
            </div>
        </div>
    );
}
