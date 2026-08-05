'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { TermsModal } from '@/app/components/TermsModal';

export default function Register() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [showTerms, setShowTerms] = useState(true);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const handleAcceptTerms = () => {
    setTermsAccepted(true);
    setShowTerms(false);
    localStorage.setItem('pulso_terms_accepted', JSON.stringify({
      accepted: true,
      timestamp: new Date().toISOString(),
    }));
  };

  const handleDeclineTerms = () => {
    setShowTerms(false);
    setError('Debes aceptar los Términos y Condiciones para continuar');
    setTimeout(() => window.location.href = '/', 2000);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!termsAccepted) {
      setError('Debes aceptar los Términos y Condiciones');
      setShowTerms(true);
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        setError(error.message);
      } else {
        setMessage('¡Cuenta creada! Redirigiendo al dashboard...');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setTimeout(() => router.push('/dashboard'), 1500);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%)', padding: 20 }}>
      <TermsModal
        isOpen={showTerms}
        onAccept={handleAcceptTerms}
        onDecline={handleDeclineTerms}
      />

      <div style={{ width: '100%', maxWidth: 420, background: '#FFFFFF', backdropFilter: 'blur(20px)', borderRadius: 20, padding: 32, border: '1px solid #E2E8F0' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ marginBottom: 16 }}>
            <img src="https://codifyanalytics.com/storage/header-logos/01KSQBC6WDJ44NMC75X9Y8MWNA.png" alt="Codify" style={{ height: 48, margin: '0 auto' }} />
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0F172A', marginBottom: 8 }}>Crear Cuenta en PULSO</h1>
          <p style={{ fontSize: 14, color: '#334155' }}>Regístrate para evaluar tu posición en el mercado</p>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24 }}>
          <div>
            <label style={{ display: 'block', fontSize: 13, color: '#334155', marginBottom: 8, fontWeight: 500 }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              required
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: 10,
                border: '1px solid #E2E8F0',
                background: '#F1F5F9',
                color: '#0F172A',
                fontSize: 14,
                outline: 'none',
                transition: 'border-color 0.3s',
                opacity: loading ? 0.6 : 1,
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(191, 5, 125,0.5)'; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(148,163,184,0.2)'; }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 13, color: '#334155', marginBottom: 8, fontWeight: 500 }}>Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: 10,
                border: '1px solid #E2E8F0',
                background: '#F1F5F9',
                color: '#0F172A',
                fontSize: 14,
                outline: 'none',
                transition: 'border-color 0.3s',
                opacity: loading ? 0.6 : 1,
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(191, 5, 125,0.5)'; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(148,163,184,0.2)'; }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 13, color: '#334155', marginBottom: 8, fontWeight: 500 }}>Confirmar Contraseña</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: 10,
                border: password && confirmPassword && password !== confirmPassword ? '1px solid #DC2626' : '1px solid #E2E8F0',
                background: '#F1F5F9',
                color: '#0F172A',
                fontSize: 14,
                outline: 'none',
                transition: 'border-color 0.3s',
                opacity: loading ? 0.6 : 1,
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(191, 5, 125,0.5)'; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = password && confirmPassword && password !== confirmPassword ? '#DC2626' : 'rgba(148,163,184,0.2)'; }}
            />
            {password && confirmPassword && password !== confirmPassword && (
              <div style={{ color: '#DC2626', fontSize: 12, marginTop: 4 }}>⚠️ Las contraseñas no coinciden</div>
            )}
          </div>

          {/* Terms Acceptance Indicator */}
          <div style={{
            padding: '12px',
            background: termsAccepted ? 'rgba(22, 163, 74, 0.15)' : 'rgba(217, 119, 6, 0.15)',
            borderRadius: '8px',
            fontSize: '13px',
            color: termsAccepted ? '#15803D' : '#92400E',
            border: `1px solid ${termsAccepted ? 'rgba(22, 163, 74, 0.3)' : 'rgba(217, 119, 6, 0.3)'}`,
          }}>
            {termsAccepted ? '✓ Términos y Condiciones aceptados' : '⚠️ Debes aceptar los Términos y Condiciones'}
          </div>

          {/* Error Message */}
          {error && <div style={{ padding: 12, background: 'rgba(239,68,68,0.15)', borderRadius: 8, color: '#fca5a5', fontSize: 13, border: '1px solid rgba(239,68,68,0.3)' }}>⚠️ {error}</div>}

          {/* Success Message */}
          {message && <div style={{ padding: 12, background: 'rgba(191, 5, 125,0.15)', borderRadius: 8, color: '#BF057D', fontSize: 13, border: '1px solid rgba(191, 5, 125,0.3)' }}>✓ {message}</div>}

          <button
            type="submit"
            disabled={loading || !email || !password || !termsAccepted || (password !== confirmPassword)}
            style={{
              width: '100%',
              padding: '14px 24px',
              background: loading || !email || !password || !termsAccepted || (password !== confirmPassword) ? '#94A3B8' : '#BF057D',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: 12,
              fontSize: 15,
              fontWeight: 700,
              cursor: loading || !email || !password || !termsAccepted || (password !== confirmPassword) ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s',
              boxShadow: '0 4px 15px rgba(191, 5, 125,0.25)',
            }}
          >
            {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
          </button>
        </form>

        {/* Footer */}
        <div style={{ textAlign: 'center', color: '#999', fontSize: '14px' }}>
          <p style={{ marginBottom: '12px' }}>
            ¿Ya tienes cuenta?{' '}
            <a href="/login" style={{ color: '#bf057d', textDecoration: 'none', fontWeight: '600' }}>
              Inicia sesión aquí
            </a>
          </p>
          <p>
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); setShowTerms(true); }}
              style={{ color: '#bf057d', textDecoration: 'none', fontWeight: '600' }}
            >
              Ver Términos y Condiciones
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
