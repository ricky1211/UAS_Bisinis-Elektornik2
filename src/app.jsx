import React, { useState } from 'react';
import { Check, Star, TrendingUp, Shield, BookOpen, Zap, Award, Users } from 'lucide-react';

export default function MagicChessLanding() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [customerData, setCustomerData] = useState({
    name: '',
    email: '',
    phone: ''
  });

  const handlePurchase = async () => {
    // Validasi input
    if (!customerData.name || !customerData.email || !customerData.phone) {
      alert('Mohon lengkapi semua data terlebih dahulu');
      return;
    }

    setIsProcessing(true);

    try {
      // Call backend API untuk mendapatkan Snap Token
      const response = await fetch('/api/create-transaction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerName: customerData.name,
          customerEmail: customerData.email,
          customerPhone: customerData.phone,
          itemName: 'Magic Chess GO GO - Ultimate Guide',
          price: 97000,
          productUrl: 'https://drive.google.com/your-product-link' // GANTI dengan link produk Anda
        }),
      });

      const data = await response.json();

      if (data.token) {
        // Panggil Midtrans Snap
        window.snap.pay(data.token, {
          onSuccess: function(result) {
            alert('Pembayaran berhasil! Cek email Anda untuk link download.');
            console.log('success', result);
          },
          onPending: function(result) {
            alert('Menunggu pembayaran Anda.');
            console.log('pending', result);
          },
          onError: function(result) {
            alert('Pembayaran gagal. Silakan coba lagi.');
            console.log('error', result);
          },
          onClose: function() {
            setIsProcessing(false);
          }
        });
      }
    } catch (error) {
      alert('Terjadi kesalahan. Silakan coba lagi.');
      console.error('Error:', error);
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <div className="inline-block bg-yellow-400 text-purple-900 px-4 py-2 rounded-full text-sm font-bold mb-6 animate-pulse">
            🔥 PROMO TERBATAS - Diskon 50% Hari Ini!
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Kuasai <span className="text-yellow-400">Magic Chess</span> dalam 7 Hari!
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 text-gray-300">
            Panduan Lengkap dari Pemula hingga Mythic Glory - Strategi Rahasia Para Pro Player
          </p>

          <div className="flex flex-wrap justify-center gap-6 mb-12">
            <div className="flex items-center gap-2 bg-white/10 px-6 py-3 rounded-lg">
              <Star className="text-yellow-400" size={24} />
              <span>Rating 4.9/5</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-6 py-3 rounded-lg">
              <Users className="text-green-400" size={24} />
              <span>2,500+ Pembeli</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-6 py-3 rounded-lg">
              <Award className="text-blue-400" size={24} />
              <span>100% Original</span>
            </div>
          </div>

          {/* Product Image Mockup */}
          <div className="mb-12">
            <img 
              src="https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&h=500&fit=crop" 
              alt="Magic Chess Guide" 
              className="rounded-2xl shadow-2xl mx-auto border-4 border-yellow-400"
            />
          </div>
        </div>

        {/* Problem Section */}
        <div className="max-w-4xl mx-auto mb-16 bg-red-900/30 border-2 border-red-500 rounded-2xl p-8">
          <h2 className="text-3xl font-bold mb-6 text-center">😤 Apakah Kamu Mengalami Ini?</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              'Selalu застряв di rank Epic-Legend',
              'Bingung combo synergy yang efektif',
              'Sering kalah di early-mid game',
              'Tidak tahu kapan harus pivot strategi',
              'Economy management berantakan',
              'Kalah terus dari meta player'
            ].map((problem, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <span className="text-red-400 text-xl">❌</span>
                <span className="text-lg">{problem}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Solution Section */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-4xl font-bold mb-8 text-center">
            <span className="text-yellow-400">Solusi:</span> Ultimate Guide Magic Chess GO GO
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <TrendingUp className="text-yellow-400 mb-4" size={48} />
              <h3 className="text-xl font-bold mb-3">Strategi Teruji</h3>
              <p className="text-gray-300">15+ Meta Composition yang terbukti ampuh push rank</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <BookOpen className="text-green-400 mb-4" size={48} />
              <h3 className="text-xl font-bold mb-3">Panduan Lengkap</h3>
              <p className="text-gray-300">150+ halaman materi dari basic hingga advanced</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <Zap className="text-blue-400 mb-4" size={48} />
              <h3 className="text-xl font-bold mb-3">Update Rutin</h3>
              <p className="text-gray-300">Gratis update setiap patch baru dirilis</p>
            </div>
          </div>

          {/* What's Inside */}
          <div className="bg-gradient-to-r from-purple-800/50 to-blue-800/50 rounded-2xl p-8 mb-12">
            <h3 className="text-3xl font-bold mb-6 text-center">📚 Isi Panduan:</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                'Fundamental & Game Mechanics',
                'Economy Management System',
                '15+ Best Meta Compositions',
                'Positioning & Itemization Guide',
                'Early-Mid-Late Game Strategy',
                'Counter Pick & Pivot Strategy',
                'Leveling & Reroll Timing',
                'Cheat Sheet & Quick Reference',
                'Video Tutorial Bonus',
                'Update Patch Notes Analysis'
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <Check className="text-green-400 flex-shrink-0" size={24} />
                  <span className="text-lg">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-4xl font-bold mb-8 text-center">💬 Testimoni Pembeli</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: 'Andi S.', rank: 'Mythic 400⭐', text: 'Dari Epic застряв 2 bulan, sekarang udah Mythic! Guide-nya detail banget!' },
              { name: 'Rizky P.', rank: 'Mythic Glory', text: 'Worth it banget! Economy management jadi lebih bagus, winrate naik 30%' },
              { name: 'Deva M.', rank: 'Legend → Mythic', text: 'Panduan terlengkap! Combo & positioning-nya bikin game gw berubah total' }
            ].map((testimonial, idx) => (
              <div key={idx} className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-yellow-400/50">
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="text-yellow-400 fill-yellow-400" size={20} />
                  ))}
                </div>
                <p className="text-gray-300 mb-4 italic">"{testimonial.text}"</p>
                <div className="font-bold">{testimonial.name}</div>
                <div className="text-sm text-yellow-400">{testimonial.rank}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Section */}
        <div className="max-w-2xl mx-auto mb-16">
          <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl p-1">
            <div className="bg-gray-900 rounded-xl p-8">
              <div className="text-center mb-8">
                <h2 className="text-4xl font-bold mb-4">Investasi Terbaik untuk Skill Kamu</h2>
                <div className="flex items-center justify-center gap-4 mb-4">
                  <span className="text-3xl text-gray-400 line-through">Rp 197.000</span>
                  <span className="text-6xl font-bold text-yellow-400">Rp 97.000</span>
                </div>
                <div className="bg-red-600 text-white px-4 py-2 rounded-full inline-block font-bold">
                  ⏰ Promo berakhir dalam 24 jam!
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <input
                  type="text"
                  placeholder="Nama Lengkap"
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400"
                  value={customerData.name}
                  onChange={(e) => setCustomerData({...customerData, name: e.target.value})}
                />
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400"
                  value={customerData.email}
                  onChange={(e) => setCustomerData({...customerData, email: e.target.value})}
                />
                <input
                  type="tel"
                  placeholder="No. WhatsApp (08xxx)"
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400"
                  value={customerData.phone}
                  onChange={(e) => setCustomerData({...customerData, phone: e.target.value})}
                />
              </div>

              <button
                onClick={handlePurchase}
                disabled={isProcessing}
                className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 font-bold text-xl py-4 rounded-xl hover:scale-105 transition-transform duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? 'Memproses...' : '🚀 BELI SEKARANG - Rp 97.000'}
              </button>

              <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-400">
                <Shield size={20} className="text-green-400" />
                <span>Pembayaran aman dengan Midtrans</span>
              </div>
            </div>
          </div>
        </div>

        {/* Guarantee */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <div className="bg-green-900/30 border-2 border-green-500 rounded-2xl p-8">
            <Shield className="mx-auto text-green-400 mb-4" size={64} />
            <h3 className="text-3xl font-bold mb-4">100% Garansi Kepuasan</h3>
            <p className="text-xl text-gray-300">
              Jika dalam 7 hari kamu merasa panduan ini tidak membantu, 
              kami akan refund 100% uang kamu. No questions asked!
            </p>
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-4xl font-bold mb-8 text-center">❓ Pertanyaan Umum</h2>
          <div className="space-y-4">
            {[
              { q: 'Format produk apa yang akan saya terima?', a: 'E-book PDF lengkap + bonus video tutorial yang bisa diakses selamanya' },
              { q: 'Berapa lama proses pengiriman?', a: 'Instant! Setelah pembayaran dikonfirmasi, link download langsung dikirim ke email' },
              { q: 'Apakah ada update gratis?', a: 'Ya! Setiap ada patch baru atau meta berubah, kami update gratis untuk pembeli' },
              { q: 'Cocok untuk pemula?', a: 'Sangat! Panduan dimulai dari basic fundamental hingga advanced strategy' }
            ].map((faq, idx) => (
              <div key={idx} className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
                <h4 className="font-bold text-lg mb-2 text-yellow-400">{faq.q}</h4>
                <p className="text-gray-300">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-400 text-sm">
          <p>© 2026 Magic Chess GO GO Guide. All rights reserved.</p>
          <p className="mt-2">Kontak: support@magicchessguide.com | WA: 08xx-xxxx-xxxx</p>
        </div>
      </div>
    </div>
  );
}