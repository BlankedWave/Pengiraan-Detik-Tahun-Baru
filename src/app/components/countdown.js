"use client"

import React, { useState, useEffect } from 'react';
import { Sparkles, Stars, } from 'lucide-react';

// Get timezone configuration from environment variables
const TIMEZONE_OFFSET = Number(process.env.PUBLIC_TIMEZONE_OFFSET) || 8; // Default to Malaysia time if not set
const TIMEZONE_NAME = process.env.PUBLIC_TIMEZONE_NAME || "Malaysia";

const Firework = ({ delay }) => {
    const [position] = useState({
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`
    });

    const size = Math.floor(Math.random() * 32) + 32;
    const colors = ['text-yellow-400', 'text-red-400', 'text-green-400', 'text-blue-400', 'text-purple-400', 'text-pink-400'];
    const color = colors[Math.floor(Math.random() * colors.length)];

    return (
        <div
            className={`absolute animate-ping ${color}`}
            style={{
                top: position.top,
                left: position.left,
                animationDelay: `${delay}ms`
            }}
        >
            <Sparkles size={size} />
        </div>
    );
};

const FireworksDisplay = ({ count = 8 }) => {
    return (
        <div className="fixed top-0 left-0 w-full h-full pointer-events-none">
            {[...Array(count)].map((_, i) => (
                <Firework key={i} delay={i * 100} />
            ))}
        </div>
    );
};

const NewYear = () => {
    const [timeLeft, setTimeLeft] = useState({
        hari: 0,
        jam: 0,
        minit: 0,
        saat: 0
    });

    const [showFireworks, setShowFireworks] = useState(false);
    const [isNewYear, setIsNewYear] = useState(false);
    const [fireworksKey, setFireworksKey] = useState(0);
    const [nextYear, setNextYear] = useState(new Date().getFullYear() + 1);

    useEffect(() => {
        const calculateTimeLeft = () => {
            // Create date object for configured timezone
            const now = new Date();
            const localOffset = now.getTimezoneOffset();
            const totalOffset = (TIMEZONE_OFFSET * 60) + localOffset;
            const targetTime = new Date(now.getTime() + totalOffset * 60 * 1000);

            // Calculate next new year in target timezone
            const currentYear = targetTime.getFullYear();
            const nextNewYear = new Date(currentYear + 1, 0, 1);
            nextNewYear.setHours(0, 0, 0, 0);

            // Convert next new year to local time for comparison
            const nextNewYearLocal = new Date(nextNewYear.getTime() - totalOffset * 60 * 1000);
            const difference = nextNewYearLocal - now;

            if (difference > 0) {
                setTimeLeft({
                    hari: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    jam: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minit: Math.floor((difference / 1000 / 60) % 60),
                    saat: Math.floor((difference / 1000) % 60)
                });
                setNextYear(currentYear + 1);
                setIsNewYear(false);
            } else {
                setTimeLeft({ hari: 0, jam: 0, minit: 0, saat: 0 });
                setIsNewYear(true);
                setNextYear(currentYear + 1);
                triggerAutomaticFireworks();
            }
        };

        const timer = setInterval(calculateTimeLeft, 1000);
        return () => clearInterval(timer);
    }, []);

    const triggerAutomaticFireworks = () => {
        const shootFireworks = () => {
            setShowFireworks(true);
            setFireworksKey(prev => prev + 1);
            setTimeout(() => {
                setShowFireworks(false);
                if (isNewYear) {
                    setTimeout(shootFireworks, Math.random() * 1500 + 500);
                }
            }, 2000);
        };
        shootFireworks();
    };

    const triggerFireworks = () => {
        setShowFireworks(true);
        setFireworksKey(prev => prev + 1);
        setTimeout(() => setShowFireworks(false), 30000);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-900 to-black text-white flex flex-col items-center justify-center p-4">
            <div className={`transition-all duration-500 ${showFireworks ? 'scale-110' : 'scale-100'}`}>
                <h1 className="text-6xl font-bold mb-8 text-center animate-pulse">
                    {isNewYear ? `Selamat Tahun Baru ${nextYear}! 🎉` : `Sekarang Adalah Tahun ${nextYear}!`}
                    <Stars className="inline ml-4 text-yellow-400" />
                </h1>
            </div>

            <div className="text-2xl mb-12 text-center">
                {!isNewYear ? (
                    <>
                        <p className="mb-4">Pengiraan Detik Untuk<div>(Waktu {TIMEZONE_NAME})</div></p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {Object.entries(timeLeft).map(([unit, value]) => (
                                <div key={unit} className="bg-blue-800 bg-opacity-50 p-4 rounded-lg">
                                    <div className="text-4xl font-bold">{String(value).padStart(2, '0')}</div>
                                    <div className="text-sm uppercase">{unit}</div>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <p className="text-4xl font-bold animate-bounce">Ayuh Raikan! 🎊</p>
                )}
            </div>

            <div className="space-y-8 text-center">
                {!isNewYear && (
                    <button
                        onClick={triggerFireworks}
                        className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 px-6 rounded-full transform transition-transform hover:scale-105 active:scale-95"
                    >
                        Pratonton Sambutan! 🎉
                    </button>
                )}

                {showFireworks && <FireworksDisplay key={fireworksKey} count={isNewYear ? 12 : 8} />}
            </div>
        </div>
    );
};

export default NewYear;
