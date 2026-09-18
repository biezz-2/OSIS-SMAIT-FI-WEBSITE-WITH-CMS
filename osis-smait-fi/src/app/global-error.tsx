"use client";

import React from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const handleReload = () => {
    const errorMsg = error?.message || "";
    const isChunkMismatch =
      errorMsg.includes("ChunkLoadError") ||
      errorMsg.includes("Loading chunk") ||
      errorMsg.includes("failed to fetch dynamically imported module");

    if (typeof window !== "undefined" && "caches" in window && isChunkMismatch) {
      window.caches
        .keys()
        .then((names) => Promise.all(names.map((name) => window.caches.delete(name))))
        .then(() => {
          window.location.reload();
        })
        .catch(() => {
          window.location.reload();
        });
      return;
    }

    reset();
  };

  return (
    <html lang="id">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Terjadi Kendala Sistem | OSIS SMAIT Fithrah Insani</title>
        <style>{`
          * { box-sizing: border-box; }
          body {
            margin: 0;
            padding: 0;
            background-color: #070b14;
            color: #f8fafc;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
          }
          .container {
            max-width: 520px;
            margin: 24px;
            padding: 40px 32px;
            background: rgba(15, 23, 42, 0.75);
            border: 1px solid rgba(245, 158, 11, 0.2);
            border-radius: 20px;
            text-align: center;
            box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.7), 0 0 30px -10px rgba(245, 158, 11, 0.15);
            backdrop-filter: blur(16px);
          }
          .icon-badge {
            width: 72px;
            height: 72px;
            margin: 0 auto 24px auto;
            border-radius: 50%;
            background: linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(217, 119, 6, 0.05));
            border: 1px solid rgba(245, 158, 11, 0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 0 20px rgba(245, 158, 11, 0.2);
          }
          .icon-badge svg {
            width: 36px;
            height: 36px;
            color: #fbbf24;
          }
          .brand-tag {
            display: inline-block;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.12em;
            font-weight: 700;
            color: #f59e0b;
            margin-bottom: 8px;
          }
          h1 {
            font-size: 24px;
            font-weight: 700;
            margin: 0 0 12px 0;
            color: #ffffff;
            letter-spacing: -0.02em;
          }
          p {
            font-size: 14px;
            line-height: 1.6;
            color: #94a3b8;
            margin: 0 0 28px 0;
          }
          .actions {
            display: flex;
            flex-direction: column;
            gap: 12px;
          }
          @media (min-width: 480px) {
            .actions {
              flex-direction: row;
              justify-content: center;
            }
          }
          .btn-primary {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 12px 24px;
            background: linear-gradient(135deg, #f59e0b, #d97706);
            color: #070b14;
            font-weight: 700;
            font-size: 14px;
            border-radius: 12px;
            text-decoration: none;
            border: none;
            cursor: pointer;
            transition: all 0.2s ease;
            box-shadow: 0 4px 14px rgba(245, 158, 11, 0.35);
          }
          .btn-primary:hover {
            background: linear-gradient(135deg, #fbbf24, #f59e0b);
            transform: translateY(-1px);
            box-shadow: 0 6px 20px rgba(245, 158, 11, 0.45);
          }
          .btn-secondary {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 12px 24px;
            background: rgba(255, 255, 255, 0.05);
            color: #cbd5e1;
            font-weight: 600;
            font-size: 14px;
            border-radius: 12px;
            text-decoration: none;
            border: 1px solid rgba(255, 255, 255, 0.12);
            transition: all 0.2s ease;
          }
          .btn-secondary:hover {
            background: rgba(255, 255, 255, 0.1);
            color: #ffffff;
            border-color: rgba(255, 255, 255, 0.2);
          }
          .digest {
            margin-top: 24px;
            font-size: 11px;
            font-family: monospace;
            color: #64748b;
          }
        `}</style>
      </head>
      <body>
        <main className="container">
          <div className="icon-badge" aria-hidden="true">
            <svg
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>

          <span className="brand-tag">OSIS SMAIT FITHRAH INSANI &bull; AGORA ACTA</span>
          <h1>Terjadi Kendala Sistem</h1>
          <p>
            Terjadi kesalahan fatal saat memuat halaman sistem. Jangan khawatir,
            Anda dapat memuat ulang halaman untuk memperbarui data aplikasi atau kembali ke beranda.
          </p>

          <div className="actions">
            <button
              type="button"
              onClick={handleReload}
              className="btn-primary"
            >
              Muat Ulang Halaman
            </button>
            <a href="/" className="btn-secondary">
              Kembali ke Beranda
            </a>
          </div>

          {error?.digest && (
            <div className="digest">
              Kode Error: {error.digest}
            </div>
          )}
        </main>
      </body>
    </html>
  );
}
