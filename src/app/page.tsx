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

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [telegramUser, setTelegramUser] = useState<TelegramUser | null>(null);
  const [iframeKey, setIframeKey] = useState(0);
  const [initData, setInitData] = useState<string>('');

  useEffect(() => {
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
          console.log('Telegram User:', user);
          console.log('Init Data:', rawInitData);
        }

        setLoading(false);
        setIframeKey(prev => prev + 1); // Force iframe reload with new data
      } else {
        // Not in Telegram, still show iframe
        setLoading(false);
      }
    };

    script.onerror = () => {
      console.error('Failed to load Telegram Web App SDK');
      setLoading(false);
    };

    return () => {
      // Cleanup script on unmount
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
