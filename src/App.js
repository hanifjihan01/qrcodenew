import React, { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import Swal from "sweetalert2";
import axios from "axios";

function App() {
  const [nip, setNip] = useState("");
  const [qrData, setQrData] = useState("");
  const [loading, setLoading] = useState(false);

  const checkNip = async () => {
    if (!nip.trim()) {
      Swal.fire("Error", "Harap masukkan NIP yang valid.", "error");
      return false;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        "https://api.sigap.solutions/no-auth/pegawai/check-nip",
        { nip  },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setLoading(false);

      if (response.status === 200 ) {
        const namaPegawai = response.data.records.nama_pegawai;
        Swal.fire("NIP Ditemukan", `Data milik: ${namaPegawai}`, "success");
        return true;
      // } else {
      //   Swal.fire("NIP Tidak Ditemukan", "NIP tidak terdaftar.", "error");
      //   return false;
      }
      
    } catch (error) {
      setLoading(false);
      Swal.fire("NIP Tidak Ditemukan", "NIP tidak terdaftar.", "error");
      return false;
    }
  };

  const generateQR = async () => {
    const isValid = await checkNip();
    if (isValid) {
      setQrData(nip);
    }
  };

  const downloadQR = () => {
    const canvas = document.getElementById("qrCode");
    const pngUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = pngUrl;
    link.download = `${nip}.png`;
    link.click();
  };

  return (
    <div className="container mt-5 text-center">
      <div className="judul">SILAHKAN MASUKKAN NOMOR INDUK PEGAWAI</div>

      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Masukkan NIP"
          value={nip}
          onChange={(e) => setNip(e.target.value)}
        />
      </div>

      <button
        className="btn btn-primary mb-4"
        onClick={generateQR}
        disabled={loading}
      >
        {loading ? "Memeriksa..." : "Generate QR"}
      </button>

      {qrData && (
        <div className="mt-4">
          <QRCodeCanvas
            id="qrCode"
            value={qrData}
            size={200}
            className="mb-4"
          />
          <p className="mt-2">
            Generated NIP: <strong>{qrData}</strong>
          </p>
          <button className="btn btn-success mt-2" onClick={downloadQR}>
            Download QR
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
