"use client";
import { useEffect } from "react";
import "./globals.css"; // move your CSS there
import Link from "next/link";

export default function Home() {

  useEffect(() => {
    // Cursor
    const cursor = document.getElementById('cursor');
    const ring = document.getElementById('cursorRing');
    let mx = 0, my = 0, rx = 0, ry = 0;

    const move = (e) => {
      mx = e.clientX;
      my = e.clientY;
      cursor.style.left = mx + 'px';
      cursor.style.top = my + 'px';
    };

    document.addEventListener('mousemove', move);

    function animateRing() {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      ring.style.left = rx + 'px';
      ring.style.top = ry + 'px';
      requestAnimationFrame(animateRing);
    }
    animateRing();

    document.querySelectorAll('a, button').forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.style.width = '20px';
        cursor.style.height = '20px';
        ring.style.width = '50px';
        ring.style.height = '50px';
      });
      el.addEventListener('mouseleave', () => {
        cursor.style.width = '12px';
        cursor.style.height = '12px';
        ring.style.width = '36px';
        ring.style.height = '36px';
      });
    });

    // Floating icons
    const icons = ['📸','❤️','✨','🚀','📊','🔥','💡','⭐','🎯','👥','💬','📈'];
    const container = document.getElementById('floatIcons');

    for (let i = 0; i < 18; i++) {
      const el = document.createElement('div');
      el.className = 'float-icon';
      el.textContent = icons[Math.floor(Math.random() * icons.length)];
      el.style.left = Math.random() * 100 + '%';
      el.style.top = Math.random() * 100 + '%';
      el.style.animationDuration = (10 + Math.random() * 20) + 's';
      el.style.animationDelay = (-Math.random() * 20) + 's';
      el.style.fontSize = (0.8 + Math.random() * 1.5) + 'rem';
      container.appendChild(el);
    }

    // Scroll reveal
    const reveals = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add('visible');
      });
    });

    reveals.forEach(r => observer.observe(r));

    return () => {
      document.removeEventListener('mousemove', move);
    };
  }, []);

  return (
    <>
      <div className="cursor" id="cursor"></div>
      <div className="cursor-ring" id="cursorRing"></div>

      {/* NAV */}
      <nav>
        <div className="logo">GrowthSpark</div>
        <ul className="nav-links">
          <li><a href="#how">How it works</a></li>
          <li><a href="#features">Features</a></li>
          <li><a href="#pricing">Pricing</a></li>
        </ul>
        <button className="nav-cta">Start Free Trial →</button>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
        <div className="float-icons" id="floatIcons"></div>

        <div className="badge">
          <span className="badge-dot"></span>
          AI-powered Instagram growth
        </div>

        <h1>
          Never run out of <br />
          <em>growth ideas</em> again.
        </h1>

        <p>
          GrowthSpark generates endless, strategy-backed Instagram content ideas
          tailored to your niche.
        </p>

        <div className="hero-ctas">
          <Link href="/ideaGenerator" className="btn-primary">✦ Generate Ideas Free</Link>
          <a href="#how" className="btn-ghost">See how it works</a>
        </div>
      </section>

      {/* STATS */}
      <div className="stats">
        <div className="stat">
          <span className="stat-number">50K+</span>
          <span className="stat-label">Businesses growing</span>
        </div>
        <div className="stat">
          <span className="stat-number">2.4M</span>
          <span className="stat-label">Ideas generated</span>
        </div>
        <div className="stat">
          <span className="stat-number">340%</span>
          <span className="stat-label">Avg. follower growth</span>
        </div>
        <div className="stat">
          <span className="stat-number">4.9★</span>
          <span className="stat-label">Average rating</span>
        </div>
      </div>

      {/* CTA */}
      <section className="cta-section">
        <h2>
          Your audience is waiting. <br />
          <em>Start growing today.</em>
        </h2>
        <p>Join thousands of businesses growing with AI.</p>
        <a href="#" className="btn-primary">Start Free</a>
      </section>

      <footer>
        <div className="footer-logo">GrowthSpark</div>
        <div className="footer-links">
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Contact</a>
        </div>
        <div className="footer-copy">© 2025 GrowthSpark</div>
      </footer>
    </>
  );
}