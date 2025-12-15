'use client';


import { useEffect, useState } from 'react';
import './globals.css';

// ============================================
// MOCK DATA FOR TESTING WITHOUT TELEGRAM
// Set USE_MOCK_DATA to true for local testing
// Set to false for production
// ============================================
const USE_MOCK_DATA = false;

const MOCK_TELEGRAM_USER = {
  id: 5928771903,
  first_name: 'Abel',
  last_name: 'Abate',
  username: 'Abeloabate',
  language_code: 'en',
  is_premium: false,
};

const MOCK_INIT_DATA = 'user=%7B%22id%22%3A5928771903%2C%22first_name%22%3A%22Abel%22%2C%22last_name%22%3A%22Abate%22%2C%22username%22%3A%22Abeloabate%22%2C%22language_code%22%3A%22en%22%2C%22allows_write_to_pm%22%3Atrue%2C%22photo_url%22%3A%22https%3A%5C%2F%5C%2Ft.me%5C%2Fi%5C%2Fuserpic%5C%2F320%5C%2FZDGQ8WfSgSY9HE2Jtay-1LeLDFq-OgeBJ2kQ-n8m11F3kdAoyrVzMEaiWP6P571U.svg%22%7D&chat_instance=249390302376292316&chat_type=sender&auth_date=1765360888&signature=xV-EwttzYtuuisBVkGwxHjXv9i2Mqp30xas9mbQ3i8LNTlroOiMFnjQy3TRTir2YvcLLvfaGQZiBp6gHUv5UCw&hash=d856062821bde378459bb402f691d0747ba0014ac22cc396bd3cd31d8a75134a';
// ============================================

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [telegramUser, setTelegramUser] = useState<any | null>(null);
  const [iframeKey, setIframeKey] = useState(0);
  const [initData, setInitData] = useState<string>('');
  const [isUsingMockData, setIsUsingMockData] = useState(false);

  useEffect(() => {
    // Check if running in Telegram WebApp
    // WebApp.initData is empty string if not in Telegram (or if mocked env not set)
    // But we should check if window.Telegram.WebApp is available basically via the SDK

    // The SDK initialized automatically if the script is present.
    // Call ready/expand
    const initWebApp = async () => {
      if (typeof window !== 'undefined') {
        try {
          const WebApp = (await import('@twa-dev/sdk')).default;

          WebApp.ready();
          WebApp.expand();
          // Optional: Set header color
          try {
            WebApp.setHeaderColor('#000000');
          } catch (e) {
            console.log("Could not set header color", e);
          }

          if (USE_MOCK_DATA) {
            console.log('🧪 Using MOCK Telegram data for testing');
            setTelegramUser(MOCK_TELEGRAM_USER);
            setInitData(MOCK_INIT_DATA);
            setIsUsingMockData(true);
            setLoading(false);
            return;
          }

          const user = WebApp.initDataUnsafe?.user;
          const rawInitData = WebApp.initData;

          if (user) {
            setTelegramUser(user);
            setInitData(rawInitData);
            console.log('📱 Telegram User:', user);
            console.log('📱 Init Data:', rawInitData);
          } else {
            // Not in Telegram or failed to init
            console.log('⚠️ No Telegram user detected or not inside Telegram');
          }

          setLoading(false);

        } catch (e) {
          console.error("WebApp usage error", e);
          setLoading(false);
        }
      }
    };

    initWebApp();

  }, []);

  // Generate iframe src with Telegram user data as query params
  const generateIframeSrc = () => {
    const baseUrl = 'https://paxyo.com/telegram_data.php';

    if (telegramUser) {
      const params = new URLSearchParams({
        tg_id: telegramUser.id.toString(),
        tg_first_name: telegramUser.first_name || '',
        tg_last_name: telegramUser.last_name || '',
        tg_username: telegramUser.username || '',
        tg_language: telegramUser.language_code || '',
        tg_is_premium: telegramUser.is_premium ? '1' : '0',
        tg_init_data: initData,
      });

      return `${baseUrl}?${params.toString()}`;
    }

    return baseUrl;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="webview-container">
      {/* Mock data indicator banner */}




      <iframe
        key={iframeKey}
        src={generateIframeSrc()}
        className="webview-frame"
        title="Paxyo SMM"
        allowFullScreen
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="no-referrer-when-downgrade"
        onLoad={() => setLoading(false)}
      />
    </div>
  );
}
