import { Cpu, Layers, Target, GitBranch } from "lucide-react";

export default function ArchitecturePanel() {
    return (
        <section id="architecture" className="border-t border-white/10 bg-transparent relative z-10" data-testid="architecture-section">
            <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-12">
                <div className="grid grid-cols-12 gap-6">
                    <div className="col-span-12 lg:col-span-4">
                        <div className="kicker text-blue-400">SYS · PIPELINE</div>
                        <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight mt-2 text-white">
                            Encoder · Bottleneck · Decoder · Heads.
                        </h2>
                        <p className="text-zinc-400 text-sm mt-3 leading-relaxed font-light">
                            U-Net with skip connections handles segmentation; a parallel classification head taps
                            into the bottleneck features for the four-class diagnostic prediction.
                        </p>
                        <div className="mt-6 space-y-3 text-sm">
                            <Row icon={<Cpu className="w-3.5 h-3.5" />} k="Framework" v="PyTorch · OpenCV inference" />
                            <Row icon={<Layers className="w-3.5 h-3.5" />} k="Backbone" v="U-Net · base=32 · depth=5" />
                            <Row icon={<Target className="w-3.5 h-3.5" />} k="Loss" v="Dice + Categorical CE" />
                            <Row icon={<GitBranch className="w-3.5 h-3.5" />} k="Optimizer" v="Adam · lr=1e-3" />
                        </div>
                    </div>

                    <div className="col-span-12 lg:col-span-8">
                        <div className="glass-card overflow-hidden">
                            <div className="px-5 py-4 border-b border-white/10 kicker text-white bg-black/20">ARCHITECTURE FLOW</div>
                            <div className="p-8 overflow-x-auto">
                                <div className="grid grid-cols-7 gap-3 min-w-[700px]">
                                    <Block label="INPUT" sub="1×128×128" tone="bg-white/10 text-white border-white/10 shadow-lg" />
                                    <Arrow />
                                    <Block label="ENC" sub="32→256" tone="bg-blue-500/20 text-blue-400 border-blue-500/30" />
                                    <Arrow />
                                    <Block label="BOTTLENECK" sub="512" tone="bg-white/10 text-white border-white/10" />
                                    <Arrow />
                                    <BlockSplit
                                        top={{ label: "DECODER", sub: "U-Net", tone: "bg-blue-500/20 text-blue-400 border-blue-500/30" }}
                                        bottom={{ label: "CLASS HEAD", sub: "FC×2", tone: "bg-amber-500/20 text-amber-400 border-amber-500/30" }}
                                    />
                                </div>
                                <div className="grid grid-cols-7 gap-3 mt-4 min-w-[700px]">
                                    <div className="col-span-7 grid grid-cols-2 gap-3">
                                        <OutBlock label="SEGMENTATION OUTPUT" sub="1×128×128 · sigmoid" tone="bg-blue-500/10 border-blue-500/30 text-blue-400" />
                                        <OutBlock label="CLASSIFICATION OUTPUT" sub="4-way softmax" tone="bg-amber-500/10 border-amber-500/30 text-amber-400" />
                                    </div>
                                </div>
                            </div>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-white/10 border-t border-white/10 bg-black/40">
                                <Foot label="Train Split" v="70%" />
                                <Foot label="Val Split" v="15%" />
                                <Foot label="Test Split" v="15%" />
                                <Foot label="Image Size" v="128 px" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

const Row = ({ icon, k, v }) => (
    <div className="flex items-start gap-3 border-b border-white/5 pb-2">
        <span className="mt-1 text-zinc-500">{icon}</span>
        <div className="flex-1 flex items-baseline justify-between gap-3">
            <span className="kicker text-zinc-400">{k}</span>
            <span className="font-mono text-sm text-white">{v}</span>
        </div>
    </div>
);

const Block = ({ label, sub, tone = "bg-white/5 border-white/10 text-white" }) => (
    <div className={`border px-3 py-4 text-center rounded-lg backdrop-blur-sm ${tone}`}>
        <div className="kicker text-[10px] opacity-70">{label}</div>
        <div className="font-display text-sm font-semibold mt-1">{sub}</div>
    </div>
);

const BlockSplit = ({ top, bottom }) => (
    <div className="space-y-2">
        <Block {...top} />
        <Block {...bottom} />
    </div>
);

const Arrow = () => (
    <div className="grid place-items-center text-zinc-400 font-mono text-lg">→</div>
);

const OutBlock = ({ label, sub, tone = "bg-blue-500/10 border-blue-500/30 text-blue-400" }) => (
    <div className={`border ${tone} px-4 py-3 rounded-lg backdrop-blur-sm`}>
        <div className="kicker opacity-80">{label}</div>
        <div className="font-display text-lg font-semibold mt-1 text-white">{sub}</div>
    </div>
);

const Foot = ({ label, v }) => (
    <div className="bg-transparent p-4 transition-colors hover:bg-white/5">
        <div className="kicker text-[10px] text-zinc-400">{label}</div>
        <div className="font-display text-xl font-semibold mt-1 text-white">{v}</div>
    </div>
);