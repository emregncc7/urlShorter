'use client';

import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { ClipboardDocumentIcon, QrCodeIcon } from '@heroicons/react/24/outline';

export default function Home() {
  const [url, setUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [showQR, setShowQR] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleShorten = async () => {
    if (!url) {
      setError('Lütfen bir URL girin');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const response = await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`);
      if (!response.ok) throw new Error('URL kısaltma işlemi başarısız oldu');
      const data = await response.text();
      setShortUrl(data);
    } catch (err) {
      setError('URL kısaltma işlemi sırasında bir hata oluştu');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="min-h-screen bg-[#1D1616] text-[#EEEEEE] relative overflow-hidden">
      {/* Dalgalı SVG Arka Plan */}
      <div className="absolute bottom-0 w-full">
        <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320'>
          <path fill='#D84040' fillOpacity='1' d='M0,192L120,202.7C240,213,480,235,720,213.3C960,192,1200,128,1320,96L1440,64L1440,320L1320,320C1200,320,960,320,720,320C480,320,240,320,120,320L0,320Z'></path>
        </svg>
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-8">URL Kısaltıcı</h1>
          <p className="text-xl mb-12 text-[#EEEEEE]/80">
            Uzun URL'lerinizi tek tıkla kısaltın ve paylaşın
          </p>

          <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="url"
                placeholder="URL'nizi buraya yapıştırın"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="flex-1 px-6 py-4 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:border-[#D84040] text-lg"
              />
              <button
                onClick={handleShorten}
                disabled={loading}
                className={`px-8 py-4 bg-[#8E1616] hover:bg-[#D84040] rounded-lg font-semibold transition-colors duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {loading ? 'Kısaltılıyor...' : 'Kısalt'}
              </button>
            </div>

            {error && (
              <div className="text-[#D84040] bg-[#D84040]/10 p-4 rounded-lg">
                {error}
              </div>
            )}

            {shortUrl && (
              <div className="bg-white/5 rounded-lg p-6 space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <a 
                    href={shortUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-lg font-medium truncate hover:text-[#D84040] transition-colors"
                  >
                    {shortUrl}
                  </a>
                  <div className="flex gap-2">
                    <CopyToClipboard text={shortUrl} onCopy={handleCopy}>
                      <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                        <ClipboardDocumentIcon className="w-6 h-6" />
                      </button>
                    </CopyToClipboard>
                    <button
                      onClick={() => setShowQR(!showQR)}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <QrCodeIcon className="w-6 h-6" />
                    </button>
                  </div>
                </div>

                {showQR && (
                  <div className="flex justify-center p-4 bg-white rounded-lg">
                    <QRCodeSVG value={shortUrl} size={200} />
                  </div>
                )}

                {copied && (
                  <div className="text-sm text-[#D84040]">
                    Kopyalandı!
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
