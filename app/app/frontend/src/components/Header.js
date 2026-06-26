import { Activity } from "lucide-react";

export default function Header() {
    return (
        <header className="border-b border-white/10 bg-black/40 backdrop-blur-xl sticky top-0 z-30" data-testid="header">
            <div className="max-w-[1400px] mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
                
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-md flex items-center justify-center bg-blue-600 border border-blue-400 shadow-[0_0_15px_rgba(37,99,235,0.5)]">
                        <Activity className="w-4 h-4 text-white" strokeWidth={2.5} />
                    </div>
                    <div>
                        <div className="font-display font-bold tracking-tight text-base leading-none text-white">
                            NeuralCord<span className="text-blue-400">.</span>
                        </div>
                        <div className="kicker mt-1 text-[10px] text-zinc-400">
                            MRI · DIAGNOSTIC PIPELINE
                        </div>
                    </div>
                </div>

                <nav className="hidden md:flex items-center gap-7 text-sm text-zinc-400">
                    <a href="#viewer" className="hover:text-white transition-colors" data-testid="nav-viewer">Viewer</a>
                    <a href="#architecture" className="hover:text-white transition-colors" data-testid="nav-arch">Architecture</a>
                    <a href="#metrics" className="hover:text-white transition-colors" data-testid="nav-metrics">Metrics</a>
                    <a href="#history" className="hover:text-white transition-colors" data-testid="nav-history">History</a>
                </nav>

                <div className="flex items-center gap-2">
                    <span className="pulse-dot bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
                    <span className="kicker text-emerald-500">PIPELINE ACTIVE</span>
                </div>

            </div>
        </header>
    );
}