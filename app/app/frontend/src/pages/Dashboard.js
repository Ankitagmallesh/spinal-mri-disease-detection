import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import Header from "../components/Header";
import UploadZone from "../components/UploadZone";
import PredictionViewer from "../components/PredictionViewer";
import ClassificationPanel from "../components/ClassificationPanel";
import HistoryPanel from "../components/HistoryPanel";
import MetricsPanel from "../components/MetricsPanel";
import ArchitecturePanel from "../components/ArchitecturePanel";
import EmptyState from "../components/EmptyState";

const API = `${process.env.REACT_APP_BACKEND_URL || "http://127.0.0.1:8000"}/api`;

export default function Dashboard() {
    const [current, setCurrent] = useState(null);
    const [loading, setLoading] = useState(false);
    const [history, setHistory] = useState([]);
    const [metrics, setMetrics] = useState(null);
    const [uploadError, setUploadError] = useState(null);

    const refreshHistory = async () => {
        try {
            const r = await axios.get(`${API}/predictions?limit=20`);
            setHistory(r.data || []);
        } catch (e) {
            console.error(e);
        }
    };

    const refreshMetrics = async () => {
        try {
            const r = await axios.get(`${API}/metrics`);
            setMetrics(r.data);
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        refreshHistory();
        refreshMetrics();
    }, []);

    const handleFile = async (file) => {
        if (!file) return;
        const valid = ["image/png", "image/jpg", "image/jpeg"].includes(file.type);
        if (!valid) {
            toast.error("Only PNG/JPG/JPEG are supported");
            return;
        }

        setUploadError(null);
        const fd = new FormData();
        fd.append("file", file);
        setLoading(true);

        try {
            const r = await axios.post(`${API}/predict`, fd, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setCurrent(r.data);
            toast.success(`Analyzed: ${r.data.predicted_class} (${r.data.confidence.toFixed(1)}%)`);
            refreshHistory();
            refreshMetrics();
        } catch (e) {
            const status = e?.response?.status;
            const detail = e?.response?.data?.detail || e?.response?.data?.message || "Prediction failed";

            if (status === 422) {
                setCurrent(null);
                setUploadError(detail);
                toast.error("Not an MRI image", {
                    duration: 6000,
                    description: detail,
                });
            } else {
                toast.error(detail);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSelectHistory = (rec) => setCurrent(rec);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${API}/predictions/${id}`);
            toast.success("Record deleted");
            if (current?.id === id) setCurrent(null);
            refreshHistory();
            refreshMetrics();
        } catch {
            toast.error("Could not delete");
        }
    };

    return (
    return (
        <div className="min-h-screen bg-transparent relative overflow-hidden" data-testid="dashboard-root">
            <div className="absolute inset-0 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10"></div>
            <Header />

            {/* Hero / intro */}
            <section className="border-b border-white/5 relative z-10 fade-up">
                <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-10 grid grid-cols-12 gap-6">
                    <div className="col-span-12 lg:col-span-8">
                        <div className="kicker mb-4 text-blue-400" data-testid="hero-kicker">SYS-01 / SPINAL CORD MRI · NEURAL DIAGNOSTIC PIPELINE</div>
                        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-[0.95] tracking-tight">
                            Automatic Segmentation &<br />
                            Disease Localization for<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Spinal Cord MRI.</span>
                        </h1>
                        <p className="mt-6 max-w-xl text-zinc-400 text-lg leading-relaxed">
                            Upload an MRI slice (PNG/JPG). The pipeline segments the spinal cord with a U-Net,
                            localizes anomalous regions and classifies the slice into one of four diagnostic
                            classes — Tumor, MS, Injury, or Normal — alongside the model's confidence score.
                        </p>
                    </div>
                    <div className="col-span-12 lg:col-span-4 grid grid-cols-2 gap-px bg-white/5 border border-white/10 rounded-xl overflow-hidden glass-panel">
                        <Stat label="Classes" value="04" data-testid="stat-classes" />
                        <Stat label="Architecture" value="U-Net" data-testid="stat-arch" />
                        <Stat label="Image Size" value="256" suffix="px" data-testid="stat-size" />
                        <Stat label="Pipeline" value="CV+CNN" data-testid="stat-pipeline" />
                    </div>
                </div>
            </section>

            <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-10 grid grid-cols-12 gap-8 relative z-10">
                {/* LEFT — upload & classification */}
                <div className="col-span-12 lg:col-span-4 space-y-6">
                    <UploadZone onFile={handleFile} loading={loading} />

                    {uploadError && (
                        <div
                            className="glass-card p-4 rounded-xl border border-red-500/30 bg-red-500/10"
                            data-testid="non-mri-error-banner"
                            role="alert"
                        >
                            <div className="kicker text-red-400">NOT AN MRI</div>
                            <div className="mt-2 text-sm text-red-200 leading-relaxed">
                                {uploadError}
                            </div>
                            <div className="mt-3 text-xs text-red-300/80">
                                Please upload a valid spinal-cord MRI slice (grayscale, dark background, PNG/JPG).
                            </div>
                        </div>
                    )}

                    <ClassificationPanel record={current} loading={loading} />
                </div>

                {/* RIGHT — viewer */}
                <div className="col-span-12 lg:col-span-8">
                    {current ? (
                        <PredictionViewer record={current} />
                    ) : (
                        <EmptyState />
                    )}
                </div>
            </div>

            {/* Architecture */}
            <ArchitecturePanel />

            {/* Metrics */}
            <MetricsPanel metrics={metrics} />

            {/* History */}
            <HistoryPanel
                items={history}
                onSelect={handleSelectHistory}
                onDelete={handleDelete}
            />

            <footer className="border-t border-white/10 mt-10 relative z-10">
                <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-8 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                    <div className="kicker">© 2026 NEURAL CORD · DIAGNOSTIC RESEARCH BUILD</div>
                    <div className="text-xs text-zinc-500 max-w-md text-right">
                        Research preview. Not a medical device. No diagnostic decisions should be made on the basis of these outputs.
                    </div>
                </div>
            </footer>
        </div>
    );
}

const Stat = ({ label, value, suffix, "data-testid": tid }) => (
    <div className="bg-black/40 p-6 flex flex-col justify-center backdrop-blur-md transition-all duration-300 hover:bg-white/5" data-testid={tid}>
        <div className="kicker text-zinc-400">{label}</div>
        <div className="font-display text-4xl font-bold mt-3 leading-none text-white tracking-tight">
            {value}
            {suffix && <span className="text-zinc-400 text-base ml-1 font-mono">{suffix}</span>}
        </div>
    </div>
);