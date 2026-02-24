import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { SEO } from "@/components/SEO";

// Standalone embeddable widget page - renders without header/footer
// Usage: <iframe src="https://karloshaadi.com/embed?type=countdown&date=2025-12-15&names=Priya+%26+Rahul" width="320" height="200" />

const WIDGET_TYPES = ["countdown", "budget-preview"] as const;

const EmbedWidget = () => {
  const [params] = useSearchParams();
  const type = params.get("type") || "countdown";
  const names = params.get("names") || "Your Wedding";
  const date = params.get("date") || "";
  const budget = params.get("budget") || "1000000";

  if (type === "countdown") {
    return <CountdownWidget names={names} date={date} />;
  }
  if (type === "budget-preview") {
    return <BudgetPreviewWidget budget={parseInt(budget)} />;
  }
  return <CountdownWidget names={names} date={date} />;
};

const CountdownWidget = ({ names, date }: { names: string; date: string }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0 });

  useEffect(() => {
    const target = date ? new Date(date).getTime() : Date.now() + 90 * 24 * 60 * 60 * 1000;
    const update = () => {
      const diff = Math.max(0, target - Date.now());
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        mins: Math.floor((diff / (1000 * 60)) % 60),
      });
    };
    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, [date]);

  return (
    <div style={{
      fontFamily: "'Inter', sans-serif",
      background: "linear-gradient(135deg, #fff1f2, #fff7ed)",
      borderRadius: "16px",
      padding: "20px",
      textAlign: "center",
      border: "1px solid rgba(219, 39, 119, 0.15)",
      maxWidth: "320px",
      margin: "0 auto",
    }}>
      <SEO title="Wedding Countdown Widget" description="Embeddable wedding countdown timer" />
      <p style={{ fontSize: "11px", color: "#db2777", fontWeight: 600, letterSpacing: "0.5px", textTransform: "uppercase", margin: "0 0 6px" }}>
        💒 Wedding Countdown
      </p>
      <p style={{ fontSize: "16px", fontWeight: 700, color: "#1f2937", margin: "0 0 12px" }}>
        {names}
      </p>
      <div style={{ display: "flex", justifyContent: "center", gap: "12px", marginBottom: "14px" }}>
        {[
          { val: timeLeft.days, label: "Days" },
          { val: timeLeft.hours, label: "Hrs" },
          { val: timeLeft.mins, label: "Min" },
        ].map((item) => (
          <div key={item.label} style={{
            background: "white",
            borderRadius: "10px",
            padding: "8px 14px",
            boxShadow: "0 2px 8px rgba(219, 39, 119, 0.08)",
            minWidth: "56px",
          }}>
            <div style={{ fontSize: "24px", fontWeight: 800, color: "#db2777" }}>{item.val}</div>
            <div style={{ fontSize: "10px", color: "#9ca3af", fontWeight: 500 }}>{item.label}</div>
          </div>
        ))}
      </div>
      <a
        href="https://karloshaadi.com/plan-wizard?utm_source=widget&utm_medium=embed"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "inline-block",
          fontSize: "10px",
          color: "#db2777",
          textDecoration: "none",
          fontWeight: 600,
          opacity: 0.8,
        }}
      >
        ✨ Powered by Karlo Shaadi — Get Your Free Wedding Plan
      </a>
    </div>
  );
};

const BudgetPreviewWidget = ({ budget }: { budget: number }) => {
  const formatCurrency = (amount: number) => {
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
    if (amount >= 1000) return `₹${(amount / 1000).toFixed(0)}K`;
    return `₹${amount}`;
  };

  const categories = [
    { name: "Venue", pct: 25 },
    { name: "Catering", pct: 20 },
    { name: "Photography", pct: 12 },
    { name: "Decoration", pct: 10 },
    { name: "Makeup", pct: 8 },
    { name: "Other", pct: 25 },
  ];

  return (
    <div style={{
      fontFamily: "'Inter', sans-serif",
      background: "linear-gradient(135deg, #fff1f2, #fff7ed)",
      borderRadius: "16px",
      padding: "20px",
      border: "1px solid rgba(219, 39, 119, 0.15)",
      maxWidth: "320px",
      margin: "0 auto",
    }}>
      <p style={{ fontSize: "11px", color: "#db2777", fontWeight: 600, letterSpacing: "0.5px", textTransform: "uppercase", margin: "0 0 4px" }}>
        💰 Wedding Budget Snapshot
      </p>
      <p style={{ fontSize: "22px", fontWeight: 800, color: "#1f2937", margin: "0 0 12px" }}>
        {formatCurrency(budget)}
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "14px" }}>
        {categories.map((cat) => (
          <div key={cat.name} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "11px", color: "#6b7280", width: "80px" }}>{cat.name}</span>
            <div style={{
              flex: 1, height: "6px", background: "#f3f4f6", borderRadius: "3px", overflow: "hidden"
            }}>
              <div style={{
                width: `${cat.pct}%`,
                height: "100%",
                background: "linear-gradient(90deg, #db2777, #f59e0b)",
                borderRadius: "3px",
              }} />
            </div>
            <span style={{ fontSize: "10px", color: "#9ca3af", width: "40px", textAlign: "right" }}>
              {formatCurrency(budget * cat.pct / 100)}
            </span>
          </div>
        ))}
      </div>
      <a
        href="https://karloshaadi.com/budget-calculator?utm_source=widget&utm_medium=embed"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "inline-block",
          fontSize: "10px",
          color: "#db2777",
          textDecoration: "none",
          fontWeight: 600,
          opacity: 0.8,
        }}
      >
        ✨ Powered by Karlo Shaadi — Calculate Your Full Budget
      </a>
    </div>
  );
};

export default EmbedWidget;
