import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function NavCard({ to, icon: Icon, color, title, desc }) {
  const [hovered, setHovered] = React.useState(false);
  
  return (
    <Link to={to} style={{ textDecoration: "none" }}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: hovered 
            ? `linear-gradient(135deg, #fff 0%, ${color}08 100%)`
            : "#fff",
          borderRadius: 20,
          padding: "36px",
          border: `2px solid ${hovered ? color : `${color}15`}`,
          boxShadow: hovered
            ? `0 30px 60px ${color}25, inset 0 1px 0 ${color}20`
            : `0 8px 24px rgba(0,0,0,0.06)`,
          transform: hovered 
            ? "translateY(-16px) scale(1.04) rotate(0.5deg)" 
            : "translateY(0) scale(1) rotate(0deg)",
          transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
          cursor: "pointer",
          height: "100%",
          minHeight: "320px",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          overflow: "hidden"
        }}
      >
        {/* Decorative top accent line */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: hovered ? 4 : 2,
            background: hovered 
              ? `linear-gradient(90deg, ${color} 0%, ${color}00 100%)`
              : `linear-gradient(90deg, ${color}50 0%, ${color}00 100%)`,
            transition: "all 0.35s ease"
          }}
        />

        {/* Animated gradient orb */}
        <div
          style={{
            position: "absolute",
            top: hovered ? -60 : -100,
            right: hovered ? -40 : -80,
            width: 280,
            height: 280,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${color}20 0%, ${color}08 70%, transparent 100%)`,
            transition: "all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
            pointerEvents: "none",
            filter: "blur(40px)"
          }}
        />

        {/* Icon container - glassmorphic */}
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: 18,
            background: hovered
              ? `linear-gradient(135deg, ${color}20 0%, ${color}10 100%)`
              : `linear-gradient(135deg, ${color}12 0%, ${color}05 100%)`,
            border: `2.5px solid ${color}25`,
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 32,
            position: "relative",
            zIndex: 2,
            transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
            transform: hovered 
              ? "translateY(-8px) rotate(12deg) scale(1.12)" 
              : "translateY(0) rotate(0) scale(1)",
            boxShadow: hovered
              ? `0 16px 32px ${color}20, inset 0 1px 2px rgba(255,255,255,0.5)`
              : `0 8px 16px ${color}10, inset 0 1px 1px rgba(255,255,255,0.3)`
          }}
        >
          <Icon 
            size={40} 
            color={color}
            strokeWidth={1.5}
            style={{
              transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
              transform: hovered ? "scale(1.15) rotate(-8deg)" : "scale(1) rotate(0)",
              filter: hovered ? `drop-shadow(0 4px 8px ${color}30)` : "drop-shadow(none)"
            }}
          />
        </div>

        {/* Title */}
        <h3
          style={{
            fontSize: 24,
            fontWeight: 900,
            color: hovered ? color : "#1a2340",
            margin: "0 0 12px",
            transition: "all 0.3s ease",
            letterSpacing: "-0.8px",
            lineHeight: 1.2
          }}
        >
          {title}
        </h3>

        {/* Divider line */}
        <div
          style={{
            width: hovered ? 60 : 40,
            height: 3,
            background: `linear-gradient(90deg, ${color} 0%, ${color}00 100%)`,
            borderRadius: 2,
            marginBottom: 16,
            transition: "all 0.4s ease"
          }}
        />

        {/* Description */}
        <p
          style={{
            fontSize: 15,
            color: hovered ? "#475569" : "#64748b",
            margin: 0,
            marginBottom: 32,
            lineHeight: 1.8,
            flex: 1,
            transition: "all 0.3s ease",
            fontWeight: 500
          }}
        >
          {desc}
        </p>

        {/* CTA Button */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            padding: "14px 16px",
            borderRadius: 12,
            background: hovered
              ? `linear-gradient(135deg, ${color}15 0%, ${color}08 100%)`
              : "transparent",
            border: `1.5px solid ${hovered ? `${color}40` : `${color}20`}`,
            color: color,
            fontSize: 15,
            fontWeight: 700,
            transition: "all 0.35s ease",
            position: "relative",
            zIndex: 2,
            cursor: "pointer"
          }}
        >
          <span style={{ 
            transition: "all 0.35s ease", 
            transform: hovered ? "translateX(4px)" : "translateX(0)",
            letterSpacing: "0.3px"
          }}>
            Accéder
          </span>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 28,
              height: 28,
              borderRadius: 8,
              background: hovered ? color : `${color}10`,
              transition: "all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)"
            }}
          >
            <ArrowRight
              size={16}
              color={hovered ? "#fff" : color}
              style={{
                transition: "all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)",
                transform: hovered ? "translateX(3px)" : "translateX(0)"
              }}
            />
          </div>
        </div>
      </div>
    </Link>
  );
}