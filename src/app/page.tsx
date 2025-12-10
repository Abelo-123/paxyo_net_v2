'use client';

import { useEffect, useState } from 'react';
import './globals.css';

// Define Telegram types
interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
}

interface TelegramWebApp {
  ready: () => void;
  expand: () => void;
  initDataUnsafe: {
    user?: TelegramUser;
    query_id?: string;
    auth_date?: number;
    hash?: string;
  };
  initData: string;
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp;
    };
  }
}

// ============================================
// MOCK DATA FOR TESTING WITHOUT TELEGRAM
// Set USE_MOCK_DATA to true for local testing
// Set to false for production
// ============================================
const USE_MOCK_DATA = true;

const MOCK_TELEGRAM_USER: TelegramUser = {
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
  const [telegramUser, setTelegramUser] = useState<TelegramUser | null>(null);
  const [iframeKey, setIframeKey] = useState(0);
  const [initData, setInitData] = useState<string>('');
  const [isUsingMockData, setIsUsingMockData] = useState(false);

  useEffect(() => {
    // If USE_MOCK_DATA is enabled, use mock data immediately
    if (USE_MOCK_DATA) {
      console.log('🧪 Using MOCK Telegram data for testing');
      setTelegramUser(MOCK_TELEGRAM_USER);
      setInitData(MOCK_INIT_DATA);
      setIsUsingMockData(true);
      setLoading(false);
      setIframeKey(prev => prev + 1);
      return;
    }

    // Load Telegram Web App SDK
    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-web-app.js?2';
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      const Telegram = window.Telegram;

      if (Telegram && Telegram.WebApp) {
        // Initialize Telegram Web App
        Telegram.WebApp.ready();
        Telegram.WebApp.expand();

        // Get user data from Telegram
        const { user } = Telegram.WebApp.initDataUnsafe;
        const rawInitData = Telegram.WebApp.initData;

        if (user) {
          setTelegramUser(user);
          setInitData(rawInitData);
          console.log('📱 Telegram User:', user);
          console.log('📱 Init Data:', rawInitData);
        } else {
          // Not in Telegram and no user data - use mock as fallback
          console.log('⚠️ No Telegram user detected, falling back to mock data');
          setTelegramUser(MOCK_TELEGRAM_USER);
          setInitData(MOCK_INIT_DATA);
          setIsUsingMockData(true);
        }

        setLoading(false);
        setIframeKey(prev => prev + 1);
      } else {
        // Telegram SDK didn't load properly - use mock as fallback
        console.log('⚠️ Telegram SDK not available, falling back to mock data');
        setTelegramUser(MOCK_TELEGRAM_USER);
        setInitData(MOCK_INIT_DATA);
        setIsUsingMockData(true);
        setLoading(false);
        setIframeKey(prev => prev + 1);
      }
    };

    script.onerror = () => {
      console.error('❌ Failed to load Telegram Web App SDK, using mock data');
      setTelegramUser(MOCK_TELEGRAM_USER);
      setInitData(MOCK_INIT_DATA);
      setIsUsingMockData(true);
      setLoading(false);
      setIframeKey(prev => prev + 1);
    };

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
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
