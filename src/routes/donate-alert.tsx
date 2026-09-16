import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

import { playerConfig } from "@/config/player";

export const Route = createFileRoute("/donate-alert")({
  head: () => ({ meta: [{ title: "Donate Alert — Byte" }] }),
  component: DonateAlert,
});

interface Donation {
  hash: string;
  from: string;
  value: string;
  timestamp: number;
}

function DonateAlert() {
  const [alert, setAlert] = useState<Donation | null>(null);
  const seenRef = useRef(new Set<string>());
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const wallet = playerConfig.supportLinks.crypto;
  const apiKey = "YourApiKeyToken";
  const usdtContract = "0x55d398326f99059fF775485246999027B3197955";

  useEffect(() => {
    if (!wallet) return;

    const checkDonations = async () => {
      try {
        const url = `https://api.bscscan.com/api?module=account&action=tokentx&contractaddress=${usdtContract}&address=${wallet}&sort=desc&apikey=${apiKey}`;
        const res = await fetch(url);
        const data = await res.json();

        if (data.status === "1" && data.result) {
          for (const tx of data.result.slice(0, 5)) {
            if (tx.to.toLowerCase() === wallet.toLowerCase() && !seenRef.current.has(tx.hash)) {
              seenRef.current.add(tx.hash);
              const value = (Number(tx.value) / 1e18).toFixed(2);
              setAlert({
                hash: tx.hash,
                from: tx.from,
                value,
                timestamp: Number(tx.timeStamp),
              });
              setTimeout(() => setAlert(null), 8000);
              break;
            }
          }
        }
      } catch {
        /* API error, silently retry */
      }
    };

    checkDonations();
    timerRef.current = setInterval(checkDonations, 10000);
    return () => clearInterval(timerRef.current);
  }, [wallet]);

  if (!alert) return null;

  const shortFrom = `${alert.from.slice(0, 6)}...${alert.from.slice(-4)}`;

  return (
    <div className="fixed inset-0 flex items-end justify-center p-8">
      <style>{`
        @keyframes donateSlideIn {
          0% { transform: translateY(60px) scale(0.9); opacity: 0; }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }
        @keyframes donateSlideOut {
          0% { transform: translateY(0) scale(1); opacity: 1; }
          100% { transform: translateY(60px) scale(0.9); opacity: 0; }
        }
        @keyframes donateGlow {
          0%, 100% { box-shadow: 0 0 20px rgba(234, 179, 8, 0.3); }
          50% { box-shadow: 0 0 40px rgba(234, 179, 8, 0.6); }
        }
      `}</style>
      <div
        style={{
          animation: "donateSlideIn 0.4s ease-out, donateGlow 2s ease-in-out infinite",
          background: "linear-gradient(135deg, rgba(20,20,20,0.95) 0%, rgba(40,30,10,0.95) 100%)",
          border: "2px solid rgba(234, 179, 8, 0.6)",
          borderRadius: "16px",
          padding: "24px 32px",
          minWidth: "320px",
          backdropFilter: "blur(12px)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #eab308, #f59e0b)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "20px",
              fontWeight: "bold",
              color: "#000",
            }}
          >
            $
          </div>
          <div>
            <div style={{ color: "#eab308", fontWeight: "800", fontSize: "14px", letterSpacing: "0.1em", fontFamily: "'Saira Condensed', sans-serif" }}>
              NEW DONATION
            </div>
            <div style={{ color: "#fff", fontSize: "24px", fontWeight: "bold", fontFamily: "'Saira Condensed', sans-serif" }}>
              {alert.value} USDT
            </div>
          </div>
        </div>
        <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "12px", marginTop: "4px" }}>
          from {shortFrom}
        </div>
      </div>
    </div>
  );
}
