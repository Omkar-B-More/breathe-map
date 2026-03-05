import { useMemo } from "react";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { generateWeeklyAqi, generateDailyIntervals, generateDailyTrend } from "@/lib/routeScoring";
import { ArrowLeft, TrendingDown, TrendingUp, Activity } from "lucide-react";
import { useNavigate } from "react-router-dom";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Filler, Tooltip, Legend);

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    x: { grid: { display: false }, ticks: { color: "#94a3b8", font: { size: 10 } } },
    y: { grid: { color: "rgba(148,163,184,0.1)" }, ticks: { color: "#94a3b8", font: { size: 10 } } },
  },
};

const Analytics = () => {
  const navigate = useNavigate();

  const weekly = useMemo(() => generateWeeklyAqi(), []);
  const intervals = useMemo(() => generateDailyIntervals(), []);
  const trend = useMemo(() => generateDailyTrend(), []);

  const avgAqi = Math.round(weekly.reduce((s, d) => s + d.aqi, 0) / weekly.length);
  const maxAqi = Math.max(...weekly.map((d) => d.aqi));
  const minAqi = Math.min(...weekly.map((d) => d.aqi));

  return (
    <div className="min-h-screen bg-background p-4 pb-8">
      <div className="max-w-lg mx-auto space-y-5">
        {/* Header */}
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/")} className="p-2 glass rounded-xl hover:shadow-float transition-shadow">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="text-xl font-display font-bold text-foreground">Pollution Analytics</h1>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Avg AQI", value: avgAqi, icon: Activity, color: "text-primary" },
            { label: "Peak", value: maxAqi, icon: TrendingUp, color: "aqi-red" },
            { label: "Lowest", value: minAqi, icon: TrendingDown, color: "aqi-green" },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="glass rounded-xl p-3 text-center">
              <Icon className={`w-4 h-4 mx-auto mb-1 ${color}`} />
              <p className={`text-lg font-display font-bold ${color}`}>{value}</p>
              <p className="text-[10px] text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>

        {/* Weekly AQI */}
        <div className="glass rounded-xl p-4">
          <h2 className="font-display font-semibold text-sm text-foreground mb-3">Weekly AQI</h2>
          <div className="h-48">
            <Bar
              data={{
                labels: weekly.map((d) => d.day),
                datasets: [{
                  data: weekly.map((d) => d.aqi),
                  backgroundColor: weekly.map((d) =>
                    d.aqi <= 80 ? "#2ECC71" : d.aqi <= 150 ? "#F1C40F" : "#E74C3C"
                  ),
                  borderRadius: 6,
                }],
              }}
              options={chartOptions}
            />
          </div>
        </div>

        {/* 30-min Intervals */}
        <div className="glass rounded-xl p-4">
          <h2 className="font-display font-semibold text-sm text-foreground mb-3">Today – 30 Min Intervals</h2>
          <div className="h-48">
            <Line
              data={{
                labels: intervals.filter((_, i) => i % 4 === 0).map((d) => d.time),
                datasets: [{
                  data: intervals.filter((_, i) => i % 4 === 0).map((d) => d.aqi),
                  borderColor: "#2ECC71",
                  backgroundColor: "rgba(46,204,113,0.1)",
                  fill: true,
                  tension: 0.4,
                  pointRadius: 0,
                  borderWidth: 2,
                }],
              }}
              options={chartOptions}
            />
          </div>
        </div>

        {/* Daily Trend */}
        <div className="glass rounded-xl p-4">
          <h2 className="font-display font-semibold text-sm text-foreground mb-3">Daily Trend (Min / Avg / Max)</h2>
          <div className="h-48">
            <Line
              data={{
                labels: trend.map((d) => d.day),
                datasets: [
                  { label: "Max", data: trend.map((d) => d.max), borderColor: "#E74C3C", borderWidth: 1.5, pointRadius: 3, tension: 0.3 },
                  { label: "Avg", data: trend.map((d) => d.avg), borderColor: "#F1C40F", borderWidth: 2, pointRadius: 3, tension: 0.3 },
                  { label: "Min", data: trend.map((d) => d.min), borderColor: "#2ECC71", borderWidth: 1.5, pointRadius: 3, tension: 0.3 },
                ],
              }}
              options={{ ...chartOptions, plugins: { legend: { display: true, labels: { color: "#94a3b8", font: { size: 10 } } } } }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
