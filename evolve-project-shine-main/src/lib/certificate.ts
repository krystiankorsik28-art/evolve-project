// Certificate utilities — serial generation, QR code URL, PDF generation
import jsPDF from "jspdf";

const SALT = "edunex-cert-v1";
const BASE_URL = typeof window !== "undefined" ? window.location.origin : "https://edunex.app";

export type CertData = {
  attempt_id: string;
  exam_title: string;
  student_name: string;
  score: number;
  max_score: number;
  percent: number;
  passed: boolean;
  completed_at: string;
};

function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36).toUpperCase().padStart(6, "0").slice(0, 6);
}

export function generateSerial(cert: CertData): string {
  const raw = `${cert.attempt_id}-${cert.score}-${cert.percent}-${SALT}`;
  const h = simpleHash(raw);
  const id = cert.attempt_id.replace(/-/g, "").slice(0, 6).toUpperCase();
  return `EDX-${id}-${h}`;
}

export function getVerifyUrl(serial: string): string {
  return `${BASE_URL}/verify/${serial}`;
}

export function getQrUrl(serial: string, size = 240): string {
  const url = getVerifyUrl(serial);
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(url)}`;
}

export function parseSerial(serial: string): string | null {
  const parts = serial.split("-");
  if (parts.length !== 3 || parts[0] !== "EDX") return null;
  return parts[1];
}

export function downloadCertPdf(cert: CertData, serial: string) {
  const doc = new jsPDF("landscape", "mm", "a4");
  const w = doc.internal.pageSize.getWidth();
  const h = doc.internal.pageSize.getHeight();
  const margin = 15;

  // Background
  doc.setFillColor(10, 15, 30);
  doc.rect(0, 0, w, h, "F");

  // Border
  doc.setDrawColor(34, 211, 238);
  doc.setLineWidth(2);
  doc.rect(margin, margin, w - margin * 2, h - margin * 2);
  doc.setDrawColor(6, 182, 212);
  doc.setLineWidth(0.5);
  doc.rect(margin + 4, margin + 4, w - margin * 2 - 8, h - margin * 2 - 8);

  // Title
  doc.setTextColor(34, 211, 238);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(36);
  doc.text("CERTYFIKAT UKOŃCZENIA", w / 2, 45, { align: "center" });

  // Separator
  doc.setDrawColor(52, 211, 153);
  doc.setLineWidth(0.5);
  doc.line(w * 0.2, 52, w * 0.8, 52);

  // Student name
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(28);
  doc.setFont("helvetica", "bold");
  doc.text(cert.student_name, w / 2, 72, { align: "center" });

  // Description
  doc.setFont("helvetica", "normal");
  doc.setFontSize(14);
  doc.setTextColor(200, 200, 200);
  doc.text("za pomyślne ukończenie egzaminu", w / 2, 85, { align: "center" });

  // Exam title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(52, 211, 153);
  doc.text(cert.exam_title, w / 2, 100, { align: "center" });

  // Score
  doc.setFont("helvetica", "normal");
  doc.setFontSize(13);
  doc.setTextColor(180, 180, 180);
  doc.text(`Wynik: ${cert.score}/${cert.max_score} (${Math.round(cert.percent)}%) — ${cert.passed ? "ZALICZONY" : "NIEZALICZONY"}`, w / 2, 118, { align: "center" });

  // Date
  const date = new Date(cert.completed_at).toLocaleDateString("pl-PL", { year: "numeric", month: "long", day: "numeric" });
  doc.setFontSize(11);
  doc.setTextColor(150, 150, 150);
  doc.text(`Data ukończenia: ${date}`, w / 2, 133, { align: "center" });

  // Serial at bottom
  doc.setFont("courier", "bold");
  doc.setFontSize(10);
  doc.setTextColor(100, 200, 200);
  doc.text(`Nr seryjny: ${serial}`, w / 2, h - margin - 10, { align: "center" });

  // Verify note
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text(`Zweryfikuj online: ${getVerifyUrl(serial)}`, w / 2, h - margin - 4, { align: "center" });

  // Seal
  doc.setDrawColor(34, 211, 238);
  doc.setLineWidth(1);
  const cx = w - margin - 25;
  const cy = 55;
  doc.circle(cx, cy, 18);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(34, 211, 238);
  doc.text("EduNex", cx, cy - 3, { align: "center" });
  doc.setFontSize(6);
  doc.text("VERIFIED", cx, cy + 4, { align: "center" });

  doc.save(`certyfikat-${serial}.pdf`);
}
