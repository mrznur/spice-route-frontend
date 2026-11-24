"use client";

import { useEffect, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  BrainCircuit,
  Check,
  CheckCircle2,
  Clock3,
  Database,
  EyeOff,
  Lightbulb,
  LockKeyhole,
  MessageSquare,
  Send,
  ShieldCheck,
  Sparkles,
  Star,
  ThumbsUp,
  TrendingUp,
  Users,
} from "lucide-react";
import "./hero-product-animation.css";

const INTRO_MS = 4800;
const SCENE_DURATION = 5600;

const SCENES = [
  { label: "QR code generation" },
  { label: "Customer feedback" },
  { label: "Live dashboard" },
  { label: "AI-powered insights" },
  { label: "Secure AI processing" },
];

const QR_MATRIX = [
  "111111100101111",
  "100000101001001",
  "101110101111101",
  "101110100100101",
  "101110101010101",
  "100000101101001",
  "111111101010111",
  "000000000101000",
  "110101111010101",
  "001011001111010",
  "111010111001101",
  "100101001010011",
  "101111101101110",
  "100000101011001",
  "111111101110111",
];

function QRCodeGraphic() {
  return (
    <svg
      className="sr-product-qr-svg"
      viewBox="0 0 150 150"
      role="img"
      aria-label="Illustrative table QR code"
    >
      <rect width="150" height="150" rx="5" fill="#fff" />
      {QR_MATRIX.map((row, y) =>
        row
          .split("")
          .map((cell, x) =>
            cell === "1" ? (
              <rect
                key={`${x}-${y}`}
                x={10 + x * 8.65}
                y={10 + y * 8.65}
                width="7.5"
                height="7.5"
                rx=".7"
                fill="#251d1b"
              />
            ) : null,
          ),
      )}
    </svg>
  );
}

function SceneQR() {
  return (
    <div className="sr-product-qr-layout">
      <div className="sr-product-qr-card">
        <div className="sr-product-qr-code">
          <QRCodeGraphic />
          <div className="sr-product-scan-line" />
          <div className="sr-product-scan-corners" />
        </div>
        <div className="sr-product-qr-caption">
          <strong>Scan for feedback</strong>
          <span>TABLE 08</span>
        </div>
      </div>

      <div className="sr-product-qr-connector" aria-hidden="true">
        <span />
        <ArrowRight size={18} />
        <span />
      </div>

      <div className="sr-product-phone">
        <div className="sr-product-phone-speaker" />
        <div className="sr-product-phone-screen">
          <div className="sr-product-phone-status">
            <span>9:41</span>
            <span>●●●</span>
          </div>
          <div className="sr-product-phone-check">
            <Check size={22} />
          </div>
          <strong>You&apos;re connected!</strong>
          <span className="sr-product-phone-muted">
            Your table was identified
          </span>
          <div className="sr-product-location">
            <div>
              <strong>Gulshan Branch</strong>
              <span>Restaurant location</span>
            </div>
          </div>
          <div className="sr-product-table-info">
            <span>YOUR TABLE</span>
            <strong>Table 08</strong>
          </div>
          <div className="sr-product-phone-button">
            Leave feedback <ArrowRight size={13} />
          </div>
        </div>
      </div>
    </div>
  );
}

function SceneFeedback() {
  return (
    <div className="sr-product-feedback-layout">
      <div className="sr-product-feedback-phone">
        <div className="sr-product-feedback-top">
          <span className="sr-product-eyebrow">YOUR EXPERIENCE</span>
          <span className="sr-product-language">EN / বাংলা</span>
        </div>
        <div className="sr-product-feedback-content">
          <h3>How was your visit?</h3>
          <p>We&apos;d love to hear what you think.</p>
          <div className="sr-product-stars">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} fill="currentColor" />
            ))}
          </div>
          <span className="sr-product-rating-label">Excellent!</span>
          <div className="sr-product-comment">
            <span>Your comments (optional)</span>
            <p>The food was delicious and the service was amazing!</p>
            <span className="sr-product-cursor" />
          </div>
          <div className="sr-product-feedback-fields">
            <span>Your name (optional)</span>
            <span>Phone (optional)</span>
          </div>
          <div className="sr-product-submit">
            Submit feedback <Send size={13} />
          </div>
        </div>
      </div>

      <div className="sr-product-feedback-success">
        <div className="sr-product-success-icon">
          <CheckCircle2 size={27} />
        </div>
        <strong>Thank you!</strong>
        <span>Your feedback means a lot to us.</span>
        <div className="sr-product-success-rating">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star key={star} fill="currentColor" />
          ))}
        </div>
        <span className="sr-product-success-tag">Feedback received</span>
      </div>
    </div>
  );
}

function SceneDashboard() {
  return (
    <div className="sr-product-dashboard">
      <div className="sr-product-dashboard-top">
        <div>
          <span className="sr-product-eyebrow">OVERVIEW</span>
          <strong>Good morning, Manager</strong>
        </div>
        <div className="sr-product-dashboard-avatar">
          <Users size={17} />
        </div>
      </div>

      <div className="sr-product-stat-grid">
        <div className="sr-product-stat">
          <span>Average rating</span>
          <strong>
            4.8 <Star size={15} fill="currentColor" />
          </strong>
          <small>
            <TrendingUp size={12} /> +0.4 this month
          </small>
        </div>
        <div className="sr-product-stat">
          <span>Total feedback</span>
          <strong>1,284</strong>
          <small>
            <TrendingUp size={12} /> +18.6% this month
          </small>
        </div>
      </div>

      <div className="sr-product-chart-card">
        <div className="sr-product-chart-heading">
          <div>
            <strong>Feedback trends</strong>
            <span>Customer ratings over time</span>
          </div>
          <span className="sr-product-chart-period">7 days</span>
        </div>
        <div className="sr-product-chart">
          <div className="sr-product-chart-grid">
            <span />
            <span />
            <span />
          </div>
          <svg
            viewBox="0 0 340 105"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="sr-chart-fill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#ec6608" stopOpacity=".24" />
                <stop offset="100%" stopColor="#ec6608" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              className="sr-product-chart-area"
              d="M0 78 C30 70 35 62 65 67 S100 42 130 50 S165 25 195 40 S235 18 260 29 S310 12 340 8 L340 105 L0 105 Z"
              fill="url(#sr-chart-fill)"
            />
            <path
              className="sr-product-chart-line"
              d="M0 78 C30 70 35 62 65 67 S100 42 130 50 S165 25 195 40 S235 18 260 29 S310 12 340 8"
              fill="none"
              stroke="#ec6608"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <circle cx="340" cy="8" r="4" fill="#ec6608" />
          </svg>
        </div>
        <div className="sr-product-chart-labels">
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
          <span>Sun</span>
        </div>
      </div>

      <div className="sr-product-dashboard-bottom">
        <div>
          <strong>Recent feedback</strong>
          <span>
            <MessageSquare size={13} /> 24 new responses
          </span>
        </div>
        <div className="sr-product-feedback-row">
          <span className="sr-product-feedback-avatar">A</span>
          <span>Great food and service!</span>
          <strong>★★★★★</strong>
        </div>
      </div>
    </div>
  );
}

function SceneAI() {
  return (
    <div className="sr-product-ai-layout">
      <div className="sr-product-ai-window">
        <div className="sr-product-ai-header">
          <div className="sr-product-ai-icon">
            <BrainCircuit size={20} />
          </div>
          <div>
            <strong>AI Summary</strong>
            <span>Customer feedback analysis</span>
          </div>
          <span className="sr-product-demo-tag">DEMO</span>
        </div>

        <div className="sr-product-ai-filters">
          <span>
            Gulshan Branch <ArrowRight size={11} />
          </span>
          <span>
            Last 30 days <ArrowRight size={11} />
          </span>
        </div>

        <div className="sr-product-ai-action">
          <Sparkles size={16} />
          <strong>Generate AI Summary</strong>
          <ArrowRight size={15} />
        </div>

        <div className="sr-product-ai-progress">
          <span>Analyzing meaningful comments</span>
          <div>
            <i />
          </div>
        </div>

        <div className="sr-product-sentiment">
          <strong>Overall sentiment</strong>
          <div className="sr-product-sentiment-bar">
            <span />
            <span />
            <span />
          </div>
          <div className="sr-product-sentiment-labels">
            <span>Positive 78%</span>
            <span>Neutral 15%</span>
            <span>Negative 7%</span>
          </div>
        </div>

        <div className="sr-product-insights">
          <div>
            <ThumbsUp size={15} />
            <span>Food quality praised</span>
            <strong>42</strong>
          </div>
          <div>
            <AlertTriangle size={15} />
            <span>Waiting time mentioned</span>
            <strong>18</strong>
          </div>
          <div>
            <Lightbulb size={15} />
            <span>Service improvement</span>
            <strong>12</strong>
          </div>
        </div>

        <div className="sr-product-ai-footer">
          <CheckCircle2 size={13} />
          Illustrative insights — not live customer data
        </div>
      </div>
    </div>
  );
}

function SceneSecurity() {
  return (
    <div className="sr-product-security-layout">
      <div className="sr-product-security-flow">
        <div className="sr-product-flow-node">
          <div className="sr-product-flow-icon">
            <MessageSquare size={19} />
          </div>
          <div>
            <strong>Customer feedback</strong>
            <span>New submission received</span>
          </div>
          <CheckCircle2 size={17} />
        </div>
        <div className="sr-product-flow-connector" />
        <div className="sr-product-flow-node">
          <div className="sr-product-flow-icon">
            <EyeOff size={19} />
          </div>
          <div>
            <strong>Privacy protection</strong>
            <span>Name and phone removed</span>
          </div>
          <CheckCircle2 size={17} />
        </div>
        <div className="sr-product-flow-connector" />
        <div className="sr-product-flow-node">
          <div className="sr-product-flow-icon">
            <BrainCircuit size={19} />
          </div>
          <div>
            <strong>AI processing</strong>
            <span>Meaningful comments only</span>
          </div>
          <CheckCircle2 size={17} />
        </div>
        <div className="sr-product-flow-connector" />
        <div className="sr-product-flow-node">
          <div className="sr-product-flow-icon">
            <Database size={19} />
          </div>
          <div>
            <strong>Cached results</strong>
            <span>Reuse existing analysis</span>
          </div>
          <CheckCircle2 size={17} />
        </div>
      </div>

      <div className="sr-product-security-panel">
        <div className="sr-product-security-shield">
          <ShieldCheck size={34} />
          <span />
        </div>
        <div>
          <strong>Privacy first.</strong>
          <span>Secure by design.</span>
        </div>
      </div>

      <div className="sr-product-security-foot">
        <span>
          <LockKeyhole size={13} /> Backend-only API keys
        </span>
        <span>
          <Clock3 size={13} /> Rate limits &amp; timeouts
        </span>
      </div>
    </div>
  );
}

function SceneContent({ index }: { index: number }) {
  switch (index) {
    case 0:
      return <SceneQR />;
    case 1:
      return <SceneFeedback />;
    case 2:
      return <SceneDashboard />;
    case 3:
      return <SceneAI />;
    default:
      return <SceneSecurity />;
  }
}

export default function HeroProductAnimation() {
  const [activeScene, setActiveScene] = useState(0);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) return;

    let interval: number | undefined;

    const start = window.setTimeout(() => {
      interval = window.setInterval(() => {
        setActiveScene((current) => (current + 1) % SCENES.length);
      }, SCENE_DURATION);
    }, INTRO_MS);

    return () => {
      window.clearTimeout(start);
      if (interval) window.clearInterval(interval);
    };
  }, []);

  return (
    <div
      className="sr-product-wrap"
      aria-label="Restaurant feedback platform demonstration"
    >
      <div className="sr-product-glow" aria-hidden="true" />
      <div className="sr-product-stage">
        <div key={activeScene} className="sr-product-scene-enter">
          <SceneContent index={activeScene} />
        </div>
      </div>

      <div className="sr-product-progress" aria-hidden="true">
        {SCENES.map((scene, index) => (
          <span
            key={scene.label}
            className={
              index === activeScene
                ? "active"
                : index < activeScene
                  ? "completed"
                  : ""
            }
          >
            <i />
          </span>
        ))}
      </div>
    </div>
  );
}
