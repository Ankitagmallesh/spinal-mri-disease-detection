import { Activity } from "lucide-react";

export default function Header() {
    return (
        <header className="border-b border-zinc-200 bg-white sticky top-0 z-30" data-testid="header">
            <div className="max-w-[1400px] mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
                
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 grid-cell flex items-center justify-center bg-zinc-900">
                        <Activity className="w-4 h-4 text-white" strokeWidth={2.5} />
                    </div>
                    <div>
                        <div className="font-display font-bold tracking-tight text-base leading-none">
                            NeuralCord<span className="text-blue-600">.</span>
                        </div>
                        <div className="kicker mt-1 text-[10px]">
                            MRI · DIAGNOSTIC PIPELINE
                        </div>
                    </div>
                </div>

                <nav className="hidden md:flex items-center gap-7 text-sm text-zinc-600">
                    <a href="#viewer" className="hover:text-zinc-900" data-testid="nav-viewer">Viewer</a>
                    <a href="#architecture" className="hover:text-zinc-900" data-testid="nav-arch">Architecture</a>
                    <a href="#metrics" className="hover:text-zinc-900" data-testid="nav-metrics">Metrics</a>
                    <a href="#history" className="hover:text-zinc-900" data-testid="nav-history">History</a>
                </nav>

                <div className="flex items-center gap-2">
                    <span className="pulse-dot bg-emerald-500" />
                    <span className="kicker">PIPELINE ACTIVE</span>
                </div>

            </div>
        </header>
    );
}