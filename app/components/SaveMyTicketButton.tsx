"use client";

import React from "react";
import { jsPDF } from "jspdf";
import QRCode from "qrcode";

const SaveMyTicketButton = () => {
  // Function to convert image to base64 as required by jspdf
  const getImageBase64 = async (url: string) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = url;

    // Wait for the image to load
    return new Promise<string>((resolve, reject) => {
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (ctx) {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
          const dataURL = canvas.toDataURL("image/png");
          resolve(dataURL);
        } else {
          reject("Failed to get canvas context");
        }
      };
      img.onerror = (error) => reject(error);
    });
  };

  // Function to download the PDF
  const handleDownloadPDF = async () => {
    const doc = new jsPDF();
    doc.setFontSize(34);
    doc.text("DEMO | IIIT KOTA TECHFEST", 20, 30);

    doc.setFontSize(20);
    doc.text("DEMO | Rahul Bagdi", 20, 50);

    doc.setFontSize(16);
    doc.setTextColor("#484848");
    doc.text("DEMO | example@gmail.com", 20, 58);

    const imageUrl =
      "https://samples-files.com/samples/images/png/480-360-sample.png";

    try {
      const base64Image = await getImageBase64(imageUrl);
      doc.addImage(base64Image, "PNG", 15, 70, 180, 100);

      doc.text("DEMO | This is your personalized ticket.", 20, 190);

      const qrData = "https://www.example.com";
      const qrCodeUrl = await QRCode.toDataURL(qrData);

      const qrX = 20;
      const qrY = 210;
      const qrWidth = 40;
      const qrHeight = 40;
      doc.addImage(qrCodeUrl, "PNG", qrX, qrY, qrWidth, qrHeight);

      const textX = qrX + qrWidth + 10;
      const textY = qrY + qrHeight / 2;
      doc.setTextColor("#000000");

      doc.setFontSize(18);
      doc.text("DEMO | Use this QR for a quicker verification", textX, textY);

      doc.save("ticket.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  return (
    <button
      onClick={handleDownloadPDF}
      className="
        px-6 py-3 
        text-white font-semibold text-lg 
        bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 
        rounded-lg shadow-md hover:shadow-lg
        transition-all duration-300 transform hover:-translate-y-1
        focus:outline-none focus:ring-4 focus:ring-purple-300
      "
    >
      Please Save My Ticket
    </button>
  );
};

export default SaveMyTicketButton;
