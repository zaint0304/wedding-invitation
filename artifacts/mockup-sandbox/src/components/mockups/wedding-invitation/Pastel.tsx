import { useEffect, useRef, useState, type FormEvent, type PointerEvent } from 'react';
import './_group.css';
import './pastel.css';

const COVER_IMAGE = '/__mockup/images/wedding-cover-pastel.webp';
const MUSIC = 'https://ubaidurrehmanw.lovable.app/__l5e/assets-v1/6879fe34-f22f-43af-86f8-386d8ee7578f/wedding-music.mp3';
const HERO_ART = '/__mockup/images/wedding-hero.jpg';
const AYAT_ART = '/__mockup/images/wedding-ayat.webp';
const WALIMA_ART = '/__mockup/images/wedding-walima.jpg';
const LOCATION = 'https://www.google.com/maps/search/?api=1&query=Usman%20Grand%20Marquee%2C%20Millat%20Town%2C%20Afridi%20Chowk%2C%20Fsd.';
const WEDDING_TIME = new Date('2026-11-14T13:00:00+05:00').getTime();

type Wish = { id: number; guestName: string; message: string };
type Countdown = { days: number | '--'; hours: number | '--'; minutes: number | '--'; seconds: number | '--' };

function useCountdown(): Countdown {
  const [remaining, setRemaining] = useState<number | null>(null);
  useEffect(() => {
    const update = () => setRemaining(Math.max(0, WEDDING_TIME - Date.now()));
    update();
    const interval = window.setInterval(update, 1000);
    return () => window.clearInterval(interval);
  }, []);
  if (remaining === null) return { days: '--', hours: '--', minutes: '--', seconds: '--' };
  return {
    days: Math.floor(remaining / 86400000),
    hours: Math.floor((remaining / 3600000) % 24),
    minutes: Math.floor((remaining / 60000) % 60),
    seconds: Math.floor((remaining / 1000) % 60),
  };
}

function ChapterOrnament() {
  return (
    <svg className="chapter-ornament" viewBox="0 0 120 16" aria-hidden="true">
      <path d="M2 8h44M74 8h44" stroke="currentColor" strokeWidth=".7" />
      <path d="m60 1 5 7-5 7-5-7z" fill="none" stroke="currentColor" strokeWidth=".8" />
      <circle cx="49" cy="8" r="1.4" fill="currentColor" />
      <circle cx="71" cy="8" r="1.4" fill="currentColor" />
    </svg>
  );
}

function ScratchHeart({ onReveal }: { onReveal: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const revealedRef = useRef(false);
  const revealRef = useRef(onReveal);
  revealRef.current = onReveal;
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d', { willReadFrequently: true });
    if (!canvas || !context) return;
    const ratio = window.devicePixelRatio || 1;
    const { width, height } = canvas.getBoundingClientRect();
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    context.scale(ratio, ratio);
    context.fillStyle = getComputedStyle(canvas).getPropertyValue('--scratch-rose').trim() || '#b58f86';
    context.fillRect(0, 0, width, height);
    for (let index = 0; index < 900; index += 1) {
      context.fillStyle = `rgba(255,255,255,${Math.random() * .16})`;
      context.fillRect(Math.random() * width, Math.random() * height, 1, 1);
    }
    context.fillStyle = 'rgba(255,250,245,.85)';
    context.textAlign = 'center';
    context.font = "italic 500 19px 'Cormorant Garamond', serif";
    context.fillText('Scratch to reveal', width / 2, height * .46);
    context.font = '600 8px Manrope, sans-serif';
    context.fillText('✦   THE DATE   ✦', width / 2, height * .46 + 20);
  }, []);

  const position = (event: PointerEvent<HTMLCanvasElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  };
  const erase = (point: { x: number; y: number }) => {
    const context = canvasRef.current?.getContext('2d');
    if (!context) return;
    context.globalCompositeOperation = 'destination-out';
    context.beginPath();
    context.arc(point.x, point.y, 22, 0, Math.PI * 2);
    context.fill();
  };
  const finishScratch = () => {
    drawing.current = false;
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d', { willReadFrequently: true });
    if (!canvas || !context || revealedRef.current) return;
    const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
    let count = 0;
    let cleared = 0;
    for (let index = 3; index < pixels.length; index += 80) {
      count += 1;
      if ((pixels[index] ?? 255) < 20) cleared += 1;
    }
    if (cleared > count * .4) {
      revealedRef.current = true;
      setRevealed(true);
      revealRef.current();
    }
  };

  return (
    <div className={`heart-scratch${revealed ? ' is-revealed' : ''}`} aria-label="Scratch to reveal the Walima date">
      <div className="heart-scratch__inner"><strong>14th</strong></div>
      <canvas
        ref={canvasRef}
        className="heart-scratch__canvas"
        onPointerDown={(event) => {
          drawing.current = true;
          event.currentTarget.setPointerCapture(event.pointerId);
          erase(position(event));
        }}
        onPointerMove={(event) => { if (drawing.current) erase(position(event)); }}
        onPointerUp={finishScratch}
        onPointerCancel={finishScratch}
      />
    </div>
  );
}

function ChapterPages({ onReveal }: { onReveal: () => void }) {
  const [dateRevealed, setDateRevealed] = useState(false);
  const revealDate = () => {
    setDateRevealed(true);
    onReveal();
  };
  return (
    <>
      <section className="chapter-page chapter-date chapter--c" aria-label="Walima date">
        <img className="chapter-art" src={WALIMA_ART} alt="" aria-hidden="true" />
        <div className="chapter-copy">
          <span className="chapter-number">Chapter 01</span>
          <h2 className="chapter-title">Walima</h2>
          <ChapterOrnament />
          <ScratchHeart onReveal={revealDate} />
          <div className={`chapter-date-rest${dateRevealed ? ' is-visible' : ''}`} aria-hidden={!dateRevealed}>
            <p className="chapter-month">November</p>
            <p className="chapter-weekday">Saturday</p>
            <p className="chapter-year">2026</p>
            <p className="chapter-scroll">Scroll to continue<span aria-hidden="true" /></p>
          </div>
        </div>
      </section>
      <section className="chapter-page chapter-details chapter--c" aria-label="Walima details">
        <img className="chapter-art" src={WALIMA_ART} alt="" aria-hidden="true" />
        <div className="chapter-frame">
          <h2 className="chapter-title">Walima</h2>
          <ChapterOrnament />
          <div className="chapter-detail-body">
            <p className="chapter-label">Time</p>
            <p className="chapter-time">1:00 pm</p>
            <span className="chapter-dot">✦</span>
            <p className="chapter-label">Venue</p>
            <p className="chapter-venue">Usman Grand Marquee</p>
            <p className="chapter-address">Millat Town, Afridi Chowk, Fsd.</p>
          </div>
          <div className="chapter-map-buttons">
            <a className="location-button" data-slot="button" href={LOCATION} target="_blank" rel="noreferrer">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
                <path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="12" cy="10" r="2.2" stroke="currentColor" strokeWidth="1.5" />
              </svg>
              View Location
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

function InvitationPage() {
  const [state, setState] = useState<'closed' | 'opening' | 'open'>('open');
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [wishSending, setWishSending] = useState(false);
  const [wishError, setWishError] = useState<string | null>(null);
  const [wishes, setWishes] = useState<Wish[]>([]);
  const wishesQuery = { isError: false, isSuccess: true };
  const audioRef = useRef<HTMLAudioElement>(null);
  const countdown = useCountdown();

  useEffect(() => {
    if (state !== 'open') return;
    let observer: IntersectionObserver | undefined;
    const frame = window.requestAnimationFrame(() => {
      const targets = document.querySelectorAll<HTMLElement>(
        ".ayat-copy > p, .ayat-copy > span, .chapter-number, .chapter-title, .chapter-frame > .eyebrow, .chapter-detail-body > *, .chapter-frame [data-slot='button'], .section-heading > *, .countdown > div, .rsvp-copy > .eyebrow, .rsvp-copy > h2, .rsvp-copy > p, .rsvp-actions > *, .wishes-copy > *",
      );
      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-text-visible');
            observer?.unobserve(entry.target);
          }
        });
      }, { threshold: .16, rootMargin: '0px 0px -8%' });
      targets.forEach((target) => {
        target.classList.add('scroll-text-reveal');
        observer?.observe(target);
      });
    });
    return () => {
      window.cancelAnimationFrame(frame);
      observer?.disconnect();
    };
  }, [state]);

  const openInvitation = () => {
    if (state !== 'closed') return;
    setState('opening');
    const audio = audioRef.current;
    if (audio) {
      audio.volume = .6;
      audio.play().then(() => setMusicPlaying(true)).catch(() => {});
    }
    window.setTimeout(() => {
      setState('open');
      window.requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    }, 900);
  };

  const toggleMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) audio.play().then(() => setMusicPlaying(true)).catch(() => {});
    else {
      audio.pause();
      setMusicPlaying(false);
    }
  };

  const submitWish = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (wishSending) return;
    const form = event.currentTarget;
    const values = new FormData(form);
    const name = String(values.get('wish-name') || '').trim();
    const message = String(values.get('wish-text') || '').trim();
    if (!name || !message) {
      setWishError('Please add your name and a wish.');
      return;
    }
    setWishSending(true);
    setWishError(null);
    setWishes((current) => [{ id: Date.now(), guestName: name, message }, ...current]);
    form.reset();
    setWishSending(false);
  };

  return (
    <main className={`invitation-page pastel-invitation invitation-page--${state}`}>
      <audio ref={audioRef} src={MUSIC} loop preload="auto" />
      {state === 'open' && (
        <button className="music-toggle" aria-label={musicPlaying ? 'Pause music' : 'Play music'} onClick={toggleMusic}>
          {musicPlaying ? (
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M9 5v14M15 5v14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m9 5 10 7-10 7V5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /></svg>
          )}
        </button>
      )}
      {state === 'open' ? (
        <div className="invitation-journey">
          <section id="invitation" className="hero-section paper-section">
            <img src={HERO_ART} alt="Black and gold ornate wedding artwork" className="section-art" />
            <img
              src="/__mockup/images/pastel-bride.webp"
              alt="Illustration of a bride in a maroon embroidered dress, her face fully concealed by a veil"
              className="pastel-bride-art"
            />
            <div className="hero-copy reveal-copy">
              <p className="arabic-kicker hero-reveal hero-reveal--1" lang="ar" dir="rtl">بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ</p>
              <div className="wedding-introduction hero-reveal hero-reveal--2">
                <p className="blessing-line">With the Blessings of Allah Almighty</p>
                <p className="honoured-family">Mr &amp; Mrs Dr. Muhammad Misbah ul Islam</p>
                <p className="invitation-line">warmly invite you to grace the wedding ceremony of their beloved daughter</p>
              </div>
              <div className="couple-intro">
                <h1 className="hero-reveal hero-reveal--3">Jannat ul Islam</h1>
                <span className="ampersand hero-reveal hero-reveal--4">with</span>
                <h1 className="hero-reveal hero-reveal--5">Muhammad Sanan Hassan</h1>
              </div>
              <div className="wedding-introduction hero-reveal hero-reveal--6">
                <p className="invitation-line">S/O Majid Ali</p>
              </div>
              <div className="wedding-introduction hero-reveal hero-reveal--7">
                <span className="introduction-dot" aria-hidden="true">✦</span>
                <p className="invitation-line">Your presence and blessings will make this joyous occasion truly special.</p>
              </div>
            </div>
          </section>
          <section className="ayat-section">
            <img src={AYAT_ART} alt="Leafy green floral arch with glowing lanterns" className="section-art" />
            <div className="ayat-copy">
              <ChapterOrnament />
              <p className="ayat-arabic" lang="ar" dir="rtl">وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً</p>
              <p>“And among His signs is that He created for you mates from among yourselves, that you may dwell in tranquility with them; and He has put love and mercy between your hearts.”</p>
              <span>Surah Ar-Rum · 30:21</span>
            </div>
          </section>
          <div className="chapters">
            <ChapterPages onReveal={() => {}} />
          </div>
          <section className="countdown-section paper-section">
            <div className="section-heading">
              <p className="eyebrow">Until we celebrate</p>
              <h2>Counting every moment</h2>
            </div>
            <div className="countdown" aria-label="Countdown to the wedding">
              {Object.entries(countdown).map(([label, value]) => (
                <div key={label}>
                  <strong>{typeof value === 'number' ? String(value).padStart(2, '0') : value}</strong>
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </section>
          <section className="wishes-section">
            <div className="wishes-copy">
              <p className="eyebrow">Wishes &amp; Gift</p>
              <h2>Your presence is our greatest gift</h2>
              <span className="gold-rule" aria-hidden="true"><i>✦</i></span>
              <div className="wishes-pair">
                <div>
                  <p className="wishes-label">Wishes</p>
                  <p>We warmly invite you to share your blessings and heartfelt prayers for the couple as they begin this new journey together.</p>
                </div>
                <div>
                  <p className="wishes-label">Gift</p>
                  <p>Your presence, prayers and warm wishes are the greatest gifts we could ask for.</p>
                </div>
              </div>
              <span className="gold-rule" aria-hidden="true"><i>✦</i></span>
              <p className="wishes-label">Add your wishes</p>
              <form className="wishes-form" onSubmit={submitWish}>
                <input name="wish-name" type="text" placeholder="Your name" maxLength={80} required />
                <textarea name="wish-text" placeholder="Write your wish for the couple…" rows={3} maxLength={2000} required />
                <button type="submit" disabled={wishSending}>{wishSending ? 'Sending…' : 'Send your wish'}</button>
                {wishError && <p role="alert">{wishError}</p>}
              </form>
              {wishesQuery.isError ? (
                <p role="status">Something went wrong. Please try again.</p>
              ) : wishesQuery.isSuccess && wishes.length === 0 ? (
                <p>Be the first to leave a wish.</p>
              ) : (
                <ul className="wishes-live">
                  {wishes.map((wish) => (
                    <li key={wish.id}>
                      <p style={{ whiteSpace: 'pre-wrap' }}>“{wish.message}”</p>
                      <span>— {wish.guestName}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
          <section className="rsvp-section">
            <img src={HERO_ART} alt="" aria-hidden="true" className="section-art" />
            <div className="rsvp-copy">
              <p className="eyebrow">Kindly respond</p>
              <h2>RSVP</h2>
              <p>Please share your blessings and confirm your attendance with the family.</p>
              <ul className="rsvp-list">
                <li><span>Zia Ur Rehman</span><a href="tel:03335205040">03335205040</a></li>
                <li><span>Attiq Ur Rehman</span><a href="tel:03008532490">03008532490</a></li>
                <li><span>Sana Ur Rehman</span><a href="tel:03457901101">03457901101</a></li>
                <li><span>Saif Ur Rehman</span><a href="tel:03007640012">03007640012</a></li>
              </ul>
              <div className="rsvp-actions">
                <div className="rsvp-closing">
                  <span className="gold-rule" aria-hidden="true"><i>✦</i></span>
                  <p className="rsvp-closing-date">Custom designed by</p>
                  <p className="rsvp-closing-names">ARMANICLICKS</p>
                  <a className="contact-cta-btn" href="https://wa.me/923014824409?text=hi%20i%20want%20to%20book%20a%20custom%20web%20invtation" target="_blank" rel="noreferrer">Contact Us</a>
                </div>
              </div>
            </div>
          </section>
        </div>
      ) : (
        <section className={`cover-stage cover-stage--${state}`} aria-label="Wedding invitation cover">
          <img src={COVER_IMAGE} alt="Black and gold invitation cover with lanterns, flowers and a tap to open seal" />
          <button className="cover-trigger cover-trigger--bare" onClick={openInvitation} aria-label="Open the wedding invitation" />
        </section>
      )}
    </main>
  );
}

export function Current() {
  return <InvitationPage />;
}
