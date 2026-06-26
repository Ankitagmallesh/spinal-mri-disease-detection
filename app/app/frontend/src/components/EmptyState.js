export default function EmptyState() {
    return (
        <div className="glass-panel overflow-hidden h-full min-h-[460px] flex flex-col" data-testid="empty-state">
            <div className="px-5 py-4 border-b border-white/10 kicker text-zinc-400 bg-black/20">VIEWER · STANDBY</div>

            <div className="grid grid-cols-2 gap-[1px] bg-white/10 flex-1">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-black/60 relative aspect-square">
                        <div className="absolute inset-0 viewer-frame" />
                        <div className="absolute inset-0 grid place-items-center text-blue-500/30 font-mono text-xs tracking-widest">
                            T{i} · NO SIGNAL
                        </div>
                    </div>
                ))}
            </div>

            <div className="px-5 py-4 border-t border-white/10 flex items-center justify-between bg-black/20">
                <span className="kicker text-white">UPLOAD SLICE TO BEGIN</span>
                <span className="kicker text-zinc-500">SYS · IDLE</span>
            </div>
        </div>
    );
}
