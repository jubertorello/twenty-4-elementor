'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Lock, Mail, ArrowRight, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulación de login
    setTimeout(() => {
      setIsLoading(false);
      router.push('/admin');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-green/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-green/5 rounded-full blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-[440px] relative z-10"
      >
        {/* Header */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-block mb-8 hover:opacity-80 transition-opacity">
            <div className="relative h-10 w-48 mx-auto">
              <Image
                src="https://res.cloudinary.com/dxmmnvpab/image/upload/q_auto/f_auto/v1777040958/Twenty4_Long_Summit-cropped_1_nw9whv.svg"
                alt="Twenty4 Studios"
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>
          <h1 className="text-2xl font-serif font-black uppercase tracking-[0.2em] text-white">
            Admin Access
          </h1>
          <p className="text-white/30 text-[10px] uppercase tracking-widest font-bold mt-3">
            Ingrese sus credenciales para continuar
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-10 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-white/40 ml-1">
                Email Address
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-brand-green transition-colors" size={18} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@twenty4studios.com"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white text-sm outline-none focus:border-brand-green/50 transition-all placeholder:text-white/10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[10px] uppercase tracking-widest font-bold text-white/40">
                  Password
                </label>
                <button type="button" className="text-[8px] uppercase tracking-widest font-bold text-white/20 hover:text-white transition-colors">
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-brand-green transition-colors" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-12 text-white text-sm outline-none focus:border-brand-green/50 transition-all placeholder:text-white/10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-brand-green hover:bg-brand-green/90 text-white font-black uppercase tracking-[0.2em] text-[11px] py-4 rounded-xl shadow-lg shadow-brand-green/20 transition-all flex items-center justify-center gap-3 group relative overflow-hidden disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Entrar al Panel</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer Link */}
        <div className="mt-10 text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-white/20 hover:text-white transition-colors text-[10px] uppercase tracking-widest font-bold group">
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Volver al sitio web
          </Link>
        </div>
      </motion.div>

      {/* Decorative dots */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
    </div>
  );
}
