import { Cpu, Layers, Target, GitBranch } from "lucide-react";

export default function ArchitecturePanel() {
    return (
        <section id="architecture" className="border-t border-zinc-200 bg-zinc-50" data-testid="architecture-section">
            <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-12">
                <div className="grid grid-cols-12 gap-6">
                    <div className="col-span-12 lg:col-span-4">
                        <div className="kicker">SYS · PIPELINE</div>
                        <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight mt-2">
                            Encoder · Bottleneck · Decoder · Heads.
                        </h2>
                        <p className="text-zinc-600 text-sm mt-3 leading-relaxed">
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
                        <div className="border border-zinc-200 bg-white">
                            <div className="px-5 py-3 border-b border-zinc-200 kicker">ARCHITECTURE FLOW</div>
                            <div className="p-6 overflow-x-auto">
                                <div className="grid grid-cols-7 gap-3 min-w-[700px]">
                                    <Block label="INPUT" sub="1×128×128" tone="bg-zinc-900 text-white" />
                                    <Arrow />
                                    <Block label="ENC" sub="32→256" tone="bg-blue-600 text-white" />
                                    <Arrow />
                                    <Block label="BOTTLENECK" sub="512" tone="bg-zinc-900 text-white" />
                                    <Arrow />
                                    <BlockSplit
                                        top={{ label: "DECODER", sub: "U-Net", tone: "bg-blue-600 text-white" }}
                                        bottom={{ label: "CLASS HEAD", sub: "FC×2", tone: "bg-amber-500 text-white" }}
                                    />
                                </div>
                                <div className="grid grid-cols-7 gap-3 mt-4 min-w-[700px]">
                                    <div className="col-span-7 grid grid-cols-2 gap-3">
                                        <OutBlock label="SEGMENTATION OUTPUT" sub="1×128×128 · sigmoid" />
                                        <OutBlock label="CLASSIFICATION OUTPUT" sub="4-way softmax" tone="bg-amber-50 border-amber-300" />
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-zinc-200 border-t border-zinc-200">
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
    <div className="flex items-start gap-3 border-b border-zinc-200 pb-2">
        <span className="mt-1 text-zinc-400">{icon}</span>
        <div className="flex-1 flex items-baseline justify-between gap-3">
            <span className="kicker text-zinc-500">{k}</span>
            <span className="font-mono text-sm">{v}</span>
        </div>
    </div>
);

const Block = ({ label, sub, tone = "bg-white border-zinc-300" }) => (
    <div className={`border border-zinc-300 px-3 py-4 text-center ${tone}`}>
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

const OutBlock = ({ label, sub, tone = "bg-blue-50 border-blue-300" }) => (
    <div className={`border ${tone} px-4 py-3`}>
        <div className="kicker">{label}</div>
        <div className="font-display text-lg font-semibold mt-1">{sub}</div>
    </div>
);

const Foot = ({ label, v }) => (
    <div className="bg-white p-3">
        <div className="kicker text-[10px]">{label}</div>
        <div className="font-display text-lg font-semibold mt-1">{v}</div>
    </div>
);