import { useState, useEffect, useRef, createContext, useContext } from "react";

// ─── Google Fonts ───────────────────────────────────────────────────
const FontLink = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&family=Caveat:wght@700&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --purple: #6B00F5;
      --purple-light: #8B2FFF;
      --purple-pale: #EDE0FF;
      --purple-mid: #C49DFF;
      --white: #FFFFFF;
      --off-white: #F7F3FF;
      --gray: #9B8FB0;
      --gray-light: #EAE4F5;
      --dark: #1A0533;
      --pink: #FF7EB3;
      --peach: #FFB347;
      --success: #00C48C;
      --danger: #FF4D6D;
      --font-display: 'Playfair Display', serif;
      --font-body: 'DM Sans', sans-serif;
      --font-accent: 'Caveat', cursive;
      --shadow: 0 4px 24px rgba(107,0,245,0.12);
      --shadow-lg: 0 8px 48px rgba(107,0,245,0.18);
    }
    body { font-family: var(--font-body); background: var(--off-white); color: var(--dark); }
    button { cursor: pointer; font-family: var(--font-body); }
    input, textarea, select { font-family: var(--font-body); }
    a { text-decoration: none; color: inherit; }

    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: var(--gray-light); }
    ::-webkit-scrollbar-thumb { background: var(--purple-mid); border-radius: 3px; }

    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    @keyframes pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.05); } }
    @keyframes shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }

    .fade-up { animation: fadeUp 0.5s ease forwards; }
    .fade-up-1 { animation: fadeUp 0.5s 0.1s ease both; }
    .fade-up-2 { animation: fadeUp 0.5s 0.2s ease both; }
    .fade-up-3 { animation: fadeUp 0.5s 0.3s ease both; }

    .skeleton {
      background: linear-gradient(90deg, var(--gray-light) 25%, #fff 50%, var(--gray-light) 75%);
      background-size: 200% 100%;
      animation: shimmer 1.4s infinite;
      border-radius: 8px;
    }
  `}</style>
);

// ─── App Context ────────────────────────────────────────────────────
const AppContext = createContext(null);
const useApp = () => useContext(AppContext);

// ─── Mock Data ──────────────────────────────────────────────────────
const GENRES = ["Romance","Fantasy","Action","Horror","Slice of Life","Mystery","Sci-Fi","Comedy","Drama","Thriller","Adventure","Supernatural"];

const MOCK_WORKS = [
  { id:1, title:"Crimson Throne", author:"AuroraPen", type:"Webtoon", genre:"Fantasy", cover:"https://picsum.photos/seed/ct1/200/280", rating:4.8, views:"2.1M", likes:45200, chapters:87, status:"Ongoing", description:"A young mage discovers she carries the blood of an ancient king — and the weight of a thousand year war.", tags:["Magic","Royalty","Strong FL"], approved:true, creatorId:"u2" },
  { id:2, title:"Midnight Protocol", author:"NeonWriter", type:"Manga", genre:"Sci-Fi", cover:"https://picsum.photos/seed/mp2/200/280", rating:4.6, views:"980K", likes:28100, chapters:42, status:"Ongoing", description:"In 2087, a hacker uncovers a government AI that has been quietly rewriting human memories.", tags:["Cyberpunk","AI","Thriller"], approved:true, creatorId:"u3" },
  { id:3, title:"The Last Petal", author:"RoseQuill", type:"Novel", genre:"Romance", cover:"https://picsum.photos/seed/lp3/200/280", rating:4.9, views:"3.4M", likes:91000, chapters:120, status:"Completed", description:"Two rivals forced into a fake relationship discover their feelings were never fake at all.", tags:["Enemies to Lovers","Slow Burn","College"], approved:true, creatorId:"u4" },
  { id:4, title:"Shadow Kin", author:"DarkCanvas", type:"Webtoon", genre:"Supernatural", cover:"https://picsum.photos/seed/sk4/200/280", rating:4.5, views:"1.2M", likes:33400, chapters:56, status:"Ongoing", description:"She thought she was human — until her shadow started killing for her.", tags:["Dark Fantasy","Mystery","Action"], approved:true, creatorId:"u2" },
  { id:5, title:"Café Aurora", author:"SunlitPages", type:"Novel", genre:"Slice of Life", cover:"https://picsum.photos/seed/ca5/200/280", rating:4.7, views:"870K", likes:22800, chapters:65, status:"Ongoing", description:"A grieving barista and a lost musician find comfort in morning coffee and unspoken words.", tags:["Healing","Cozy","Music"], approved:true, creatorId:"u4" },
  { id:6, title:"Iron Bloom", author:"MetalQuill", type:"Manga", genre:"Action", cover:"https://picsum.photos/seed/ib6/200/280", rating:4.4, views:"1.5M", likes:41200, chapters:98, status:"Ongoing", description:"A gladiator with mechanical arms fights for freedom in an empire built on blood sport.", tags:["Action","Steampunk","Survival"], approved:true, creatorId:"u3" },
  { id:7, title:"Hollow Hearts", author:"AuroraPen", type:"Webtoon", genre:"Horror", cover:"https://picsum.photos/seed/hh7/200/280", rating:4.3, views:"650K", likes:18900, chapters:33, status:"Hiatus", description:"A dollmaker's creations begin to move — and they remember everything their owners tried to forget.", tags:["Horror","Psychological","Dolls"], approved:false, creatorId:"u2" },
  { id:8, title:"Starfall Academy", author:"CosmicInk", type:"Novel", genre:"Fantasy", cover:"https://picsum.photos/seed/sa8/200/280", rating:4.6, views:"2.8M", likes:76000, chapters:145, status:"Ongoing", description:"Magic school meets murder mystery when students start disappearing after a meteor shower.", tags:["Magic School","Mystery","Found Family"], approved:true, creatorId:"u5" },
];

const MOCK_CHAPTERS = Array.from({length:10},(_,i)=>({
  id: i+1,
  number: i+1,
  title: `Chapter ${i+1}: ${["The Beginning","Shadows Rise","Lost Light","The Pact","Storm's Eye","Broken Mirror","New Dawn","Red Moon","The Return","Final Stand"][i]}`,
  date: new Date(Date.now() - (10-i)*7*24*60*60*1000).toLocaleDateString(),
  locked: false,
  views: Math.floor(Math.random()*50000+5000),
}));

const MOCK_COMMENTS = [
  { id:1, user:"StarReader", avatar:"https://picsum.photos/seed/u1/40/40", text:"This story literally had me up until 3am, I couldn't stop reading!!!", likes:234, date:"2 days ago" },
  { id:2, user:"MangaLover99", avatar:"https://picsum.photos/seed/u2/40/40", text:"The art style in this chapter was absolutely stunning. The color palette choices 🤌", likes:187, date:"3 days ago" },
  { id:3, user:"NightOwlReader", avatar:"https://picsum.photos/seed/u3/40/40", text:"I've been following since chapter 1 and the character development is incredible. Best story on Palixia!", likes:445, date:"1 week ago" },
  { id:4, user:"QuietBookworm", avatar:"https://picsum.photos/seed/u4/40/40", text:"Chapter 7 broke my heart. I need the next one NOW.", likes:122, date:"1 week ago" },
];

const MOCK_USERS = {
  "reader@test.com": { id:"u1", name:"Alex Reader", email:"reader@test.com", password:"123", role:"reader", avatar:"https://picsum.photos/seed/alex/60/60", library:[], history:[], following:[] },
  "creator@test.com": { id:"u2", name:"AuroraPen", email:"creator@test.com", password:"123", role:"creator", avatar:"https://picsum.photos/seed/aurora/60/60", library:[], history:[], following:[] },
  "admin@palixia.com": { id:"u0", name:"Admin", email:"admin@palixia.com", password:"admin123", role:"admin", avatar:"https://picsum.photos/seed/admin/60/60", library:[], history:[], following:[] },
};

// ─── Helpers ────────────────────────────────────────────────────────
const fmtNum = n => n >= 1000000 ? (n/1000000).toFixed(1)+"M" : n >= 1000 ? (n/1000).toFixed(1)+"K" : n;

// ─── UI Components ──────────────────────────────────────────────────
const Btn = ({ children, variant="primary", size="md", onClick, style={}, disabled=false, full=false }) => {
  const base = {
    display:"inline-flex", alignItems:"center", justifyContent:"center", gap:6,
    borderRadius:12, fontWeight:600, border:"none", transition:"all 0.2s",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.6 : 1,
    width: full ? "100%" : "auto",
    ...(size === "sm" ? { padding:"6px 14px", fontSize:13 } :
        size === "lg" ? { padding:"14px 32px", fontSize:16 } :
        { padding:"10px 22px", fontSize:14 }),
    ...(variant === "primary" ? { background:"var(--purple)", color:"#fff", boxShadow:"0 2px 12px rgba(107,0,245,0.3)" } :
        variant === "outline" ? { background:"transparent", color:"var(--purple)", border:"2px solid var(--purple)" } :
        variant === "ghost"   ? { background:"transparent", color:"var(--purple)" } :
        variant === "danger"  ? { background:"var(--danger)", color:"#fff" } :
        variant === "success" ? { background:"var(--success)", color:"#fff" } :
        variant === "white"   ? { background:"#fff", color:"var(--purple)", boxShadow:"var(--shadow)" } :
        {}),
    ...style,
  };
  return (
    <button style={base} onClick={onClick} disabled={disabled}
      onMouseEnter={e=>{ if(!disabled){ e.currentTarget.style.transform="translateY(-1px)"; e.currentTarget.style.filter="brightness(1.08)"; }}}
      onMouseLeave={e=>{ e.currentTarget.style.transform=""; e.currentTarget.style.filter=""; }}>
      {children}
    </button>
  );
};

const Badge = ({ children, color="purple" }) => {
  const colors = {
    purple: { bg:"var(--purple-pale)", color:"var(--purple)" },
    pink:   { bg:"#FFE5F1", color:"#C0006A" },
    peach:  { bg:"#FFF0DE", color:"#B36000" },
    green:  { bg:"#E0FFF5", color:"#006648" },
    red:    { bg:"#FFE5EA", color:"#B3002D" },
    gray:   { bg:"var(--gray-light)", color:"var(--gray)" },
  };
  const c = colors[color] || colors.purple;
  return (
    <span style={{ background:c.bg, color:c.color, borderRadius:20, padding:"3px 10px", fontSize:12, fontWeight:600 }}>
      {children}
    </span>
  );
};

const Star = ({ filled }) => (
  <span style={{ color: filled ? "#FFB347" : "#ddd", fontSize:14 }}>★</span>
);

const RatingStars = ({ rating }) => (
  <span style={{ display:"flex", gap:1, alignItems:"center" }}>
    {[1,2,3,4,5].map(i => <Star key={i} filled={i <= Math.round(rating)} />)}
    <span style={{ fontSize:12, color:"var(--gray)", marginLeft:4 }}>{rating}</span>
  </span>
);

const Avatar = ({ src, name, size=36 }) => (
  <img src={src || `https://picsum.photos/seed/${name}/60/60`} alt={name}
    style={{ width:size, height:size, borderRadius:"50%", objectFit:"cover", border:"2px solid var(--purple-pale)" }} />
);

const Input = ({ label, type="text", value, onChange, placeholder, icon }) => (
  <div style={{ marginBottom:16 }}>
    {label && <label style={{ display:"block", fontSize:13, fontWeight:600, color:"var(--dark)", marginBottom:6 }}>{label}</label>}
    <div style={{ position:"relative" }}>
      {icon && <span style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", fontSize:16 }}>{icon}</span>}
      <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
        style={{
          width:"100%", padding: icon ? "11px 14px 11px 38px" : "11px 14px",
          border:"2px solid var(--gray-light)", borderRadius:10, fontSize:14,
          outline:"none", transition:"border-color 0.2s",
          background:"#fff", color:"var(--dark)",
        }}
        onFocus={e=>e.target.style.borderColor="var(--purple)"}
        onBlur={e=>e.target.style.borderColor="var(--gray-light)"}
      />
    </div>
  </div>
);

const Modal = ({ open, onClose, children, title }) => {
  if (!open) return null;
  return (
    <div style={{ position:"fixed", inset:0, zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}
      onClick={onClose}>
      <div style={{ position:"absolute", inset:0, background:"rgba(26,5,51,0.6)", backdropFilter:"blur(4px)" }} />
      <div style={{ position:"relative", background:"#fff", borderRadius:20, padding:32, width:"100%", maxWidth:480, boxShadow:"var(--shadow-lg)", animation:"fadeUp 0.3s ease" }}
        onClick={e=>e.stopPropagation()}>
        <button onClick={onClose} style={{ position:"absolute", top:16, right:16, background:"var(--gray-light)", border:"none", borderRadius:8, width:32, height:32, fontSize:18, cursor:"pointer", color:"var(--gray)" }}>×</button>
        {title && <h2 style={{ fontFamily:"var(--font-display)", fontSize:22, marginBottom:20, color:"var(--dark)" }}>{title}</h2>}
        {children}
      </div>
    </div>
  );
};

const Toast = ({ message, type="success", onClose }) => (
  <div style={{
    position:"fixed", bottom:24, right:24, zIndex:2000,
    background: type==="success" ? "var(--success)" : type==="error" ? "var(--danger)" : "var(--purple)",
    color:"#fff", borderRadius:12, padding:"12px 20px", fontSize:14, fontWeight:600,
    boxShadow:"var(--shadow-lg)", animation:"fadeUp 0.3s ease",
    display:"flex", alignItems:"center", gap:10,
  }}>
    <span>{type==="success"?"✓":type==="error"?"✕":"ℹ"}</span>
    {message}
    <button onClick={onClose} style={{ background:"none", border:"none", color:"#fff", cursor:"pointer", fontSize:16, marginLeft:8 }}>×</button>
  </div>
);

// ─── Work Card ───────────────────────────────────────────────────────
const WorkCard = ({ work, onClick }) => (
  <div onClick={()=>onClick(work)}
    style={{ cursor:"pointer", borderRadius:16, overflow:"hidden", background:"#fff",
      boxShadow:"var(--shadow)", transition:"all 0.25s", flexShrink:0 }}
    onMouseEnter={e=>{ e.currentTarget.style.transform="translateY(-4px)"; e.currentTarget.style.boxShadow="var(--shadow-lg)"; }}
    onMouseLeave={e=>{ e.currentTarget.style.transform=""; e.currentTarget.style.boxShadow="var(--shadow)"; }}>
    <div style={{ position:"relative", overflow:"hidden" }}>
      <img src={work.cover} alt={work.title} style={{ width:"100%", aspectRatio:"200/280", objectFit:"cover", display:"block" }} />
      <div style={{ position:"absolute", top:8, left:8, display:"flex", gap:4 }}>
        <Badge color={work.type==="Webtoon"?"purple":work.type==="Manga"?"pink":"peach"}>{work.type}</Badge>
      </div>
      {work.status === "Completed" && (
        <div style={{ position:"absolute", top:8, right:8 }}>
          <Badge color="green">Done</Badge>
        </div>
      )}
    </div>
    <div style={{ padding:"12px" }}>
      <p style={{ fontWeight:700, fontSize:14, color:"var(--dark)", marginBottom:2, lineHeight:1.3,
        overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{work.title}</p>
      <p style={{ fontSize:12, color:"var(--gray)", marginBottom:6 }}>{work.author}</p>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <RatingStars rating={work.rating} />
        <span style={{ fontSize:11, color:"var(--gray)" }}>👁 {work.views}</span>
      </div>
    </div>
  </div>
);

// ─── PAGES ──────────────────────────────────────────────────────────

// Home Page
const HomePage = ({ onWorkClick }) => {
  const { user } = useApp();
  const featured = MOCK_WORKS.filter(w=>w.approved).slice(0,3);
  const trending = MOCK_WORKS.filter(w=>w.approved);
  const newArrivals = [...MOCK_WORKS].filter(w=>w.approved).reverse().slice(0,6);

  return (
    <div>
      {/* Hero */}
      <div style={{
        background:"linear-gradient(135deg, var(--purple) 0%, var(--purple-light) 60%, #B57BFF 100%)",
        borderRadius:24, padding:"48px 40px", marginBottom:40, position:"relative", overflow:"hidden",
      }}>
        <div style={{ position:"absolute", top:-40, right:-40, width:200, height:200, borderRadius:"50%", background:"rgba(255,255,255,0.06)" }} />
        <div style={{ position:"absolute", bottom:-60, right:80, width:280, height:280, borderRadius:"50%", background:"rgba(255,255,255,0.04)" }} />
        <div className="fade-up" style={{ position:"relative", zIndex:1, maxWidth:520 }}>
          <p style={{ fontFamily:"var(--font-accent)", fontSize:18, color:"var(--purple-pale)", marginBottom:8 }}>Welcome to Palixia</p>
          <h1 style={{ fontFamily:"var(--font-display)", fontSize:"clamp(28px,4vw,48px)", color:"#fff", lineHeight:1.15, marginBottom:16 }}>
            Stories that<br/>move your world.
          </h1>
          <p style={{ color:"rgba(255,255,255,0.8)", fontSize:16, marginBottom:28, lineHeight:1.6 }}>
            Discover webtoons, manga, and novels from creators around the globe. Free, forever.
          </p>
          <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
            <Btn variant="white" size="lg">🔥 Start Reading</Btn>
            <Btn variant="outline" size="lg" style={{ borderColor:"rgba(255,255,255,0.5)", color:"#fff" }}>✏️ Start Creating</Btn>
          </div>
        </div>
      </div>

      {/* Featured */}
      <Section title="✨ Featured" subtitle="Hand-picked by our editors">
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))", gap:16 }}>
          {featured.map(w => <WorkCard key={w.id} work={w} onClick={onWorkClick} />)}
        </div>
      </Section>

      {/* Genres Quick */}
      <div style={{ marginBottom:40 }}>
        <h2 style={{ fontFamily:"var(--font-display)", fontSize:22, marginBottom:16 }}>Browse by Genre</h2>
        <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
          {GENRES.map(g => (
            <button key={g} style={{
              padding:"8px 18px", borderRadius:20, border:"2px solid var(--purple-pale)",
              background:"#fff", color:"var(--purple)", fontWeight:600, fontSize:13, cursor:"pointer",
              transition:"all 0.2s",
            }}
              onMouseEnter={e=>{ e.currentTarget.style.background="var(--purple)"; e.currentTarget.style.color="#fff"; e.currentTarget.style.borderColor="var(--purple)"; }}
              onMouseLeave={e=>{ e.currentTarget.style.background="#fff"; e.currentTarget.style.color="var(--purple)"; e.currentTarget.style.borderColor="var(--purple-pale)"; }}>
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Trending */}
      <Section title="🔥 Trending Now" subtitle="Most read this week">
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))", gap:16 }}>
          {trending.map(w => <WorkCard key={w.id} work={w} onClick={onWorkClick} />)}
        </div>
      </Section>

      {/* New */}
      <Section title="🆕 New Arrivals" subtitle="Fresh off the press">
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))", gap:16 }}>
          {newArrivals.map(w => <WorkCard key={w.id} work={w} onClick={onWorkClick} />)}
        </div>
      </Section>
    </div>
  );
};

const Section = ({ title, subtitle, children }) => (
  <div style={{ marginBottom:40 }}>
    <div style={{ marginBottom:16 }}>
      <h2 style={{ fontFamily:"var(--font-display)", fontSize:22, color:"var(--dark)" }}>{title}</h2>
      {subtitle && <p style={{ fontSize:13, color:"var(--gray)", marginTop:2 }}>{subtitle}</p>}
    </div>
    {children}
  </div>
);

// Browse Page
const BrowsePage = ({ onWorkClick }) => {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("All");
  const [genre, setGenre] = useState("All");
  const [sort, setSort] = useState("Popular");

  const types = ["All","Webtoon","Manga","Novel"];
  const sorts = ["Popular","Rating","Newest","Most Chapters"];

  const filtered = MOCK_WORKS.filter(w => {
    if (!w.approved) return false;
    if (type !== "All" && w.type !== type) return false;
    if (genre !== "All" && w.genre !== genre) return false;
    if (search && !w.title.toLowerCase().includes(search.toLowerCase()) && !w.author.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }).sort((a,b) => {
    if (sort === "Rating") return b.rating - a.rating;
    if (sort === "Most Chapters") return b.chapters - a.chapters;
    return b.likes - a.likes;
  });

  return (
    <div>
      <h1 style={{ fontFamily:"var(--font-display)", fontSize:28, marginBottom:20 }}>Browse</h1>

      {/* Search */}
      <div style={{ position:"relative", marginBottom:20 }}>
        <span style={{ position:"absolute", left:14, top:"50%", transform:"translateY(-50%)", fontSize:18 }}>🔍</span>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search titles, authors..."
          style={{ width:"100%", padding:"13px 14px 13px 44px", border:"2px solid var(--gray-light)", borderRadius:14,
            fontSize:15, outline:"none", background:"#fff", color:"var(--dark)" }}
          onFocus={e=>e.target.style.borderColor="var(--purple)"}
          onBlur={e=>e.target.style.borderColor="var(--gray-light)"} />
      </div>

      {/* Filters */}
      <div style={{ display:"flex", gap:12, flexWrap:"wrap", marginBottom:24 }}>
        <FilterGroup label="Type" options={types} value={type} onChange={setType} />
        <FilterGroup label="Sort" options={sorts} value={sort} onChange={setSort} />
        <div>
          <select value={genre} onChange={e=>setGenre(e.target.value)}
            style={{ padding:"8px 14px", borderRadius:10, border:"2px solid var(--gray-light)",
              fontSize:13, fontWeight:600, background:"#fff", color: genre!=="All" ? "var(--purple)" : "var(--gray)", outline:"none" }}>
            <option value="All">All Genres</option>
            {GENRES.map(g=><option key={g} value={g}>{g}</option>)}
          </select>
        </div>
      </div>

      <p style={{ fontSize:13, color:"var(--gray)", marginBottom:16 }}>{filtered.length} results</p>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))", gap:16 }}>
        {filtered.map(w => <WorkCard key={w.id} work={w} onClick={onWorkClick} />)}
        {filtered.length === 0 && (
          <div style={{ gridColumn:"1/-1", textAlign:"center", padding:"60px 20px", color:"var(--gray)" }}>
            <p style={{ fontSize:48, marginBottom:12 }}>📚</p>
            <p style={{ fontSize:18, fontWeight:600 }}>No results found</p>
            <p style={{ fontSize:14, marginTop:4 }}>Try a different search or filter</p>
          </div>
        )}
      </div>
    </div>
  );
};

const FilterGroup = ({ options, value, onChange }) => (
  <div style={{ display:"flex", gap:6, background:"var(--gray-light)", borderRadius:10, padding:4 }}>
    {options.map(o => (
      <button key={o} onClick={()=>onChange(o)}
        style={{
          padding:"6px 14px", borderRadius:8, border:"none", fontSize:13, fontWeight:600, cursor:"pointer",
          background: value===o ? "var(--purple)" : "transparent",
          color: value===o ? "#fff" : "var(--gray)",
          transition:"all 0.2s",
        }}>{o}</button>
    ))}
  </div>
);

// Work Detail Page
const WorkDetailPage = ({ work, onBack, onRead }) => {
  const { user, showToast } = useApp();
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [localLikes, setLocalLikes] = useState(work.likes);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState(MOCK_COMMENTS);
  const [tab, setTab] = useState("chapters");

  const handleLike = () => {
    if (!user) { showToast("Please log in to like!", "error"); return; }
    setLiked(!liked);
    setLocalLikes(l => liked ? l-1 : l+1);
  };
  const handleBookmark = () => {
    if (!user) { showToast("Please log in to bookmark!", "error"); return; }
    setBookmarked(!bookmarked);
    showToast(bookmarked ? "Removed from library" : "Added to library! 📚", "success");
  };
  const handleComment = () => {
    if (!user) { showToast("Please log in to comment!", "error"); return; }
    if (!commentText.trim()) return;
    setComments([{ id:Date.now(), user:user.name, avatar:user.avatar, text:commentText, likes:0, date:"Just now" }, ...comments]);
    setCommentText("");
    showToast("Comment posted!", "success");
  };

  return (
    <div>
      <button onClick={onBack} style={{ background:"none", border:"none", color:"var(--purple)", fontWeight:700, fontSize:14, cursor:"pointer", marginBottom:20, display:"flex", alignItems:"center", gap:6 }}>
        ← Back
      </button>

      {/* Header */}
      <div style={{ display:"flex", gap:24, marginBottom:32, flexWrap:"wrap" }}>
        <img src={work.cover} alt={work.title}
          style={{ width:160, borderRadius:16, objectFit:"cover", flexShrink:0, boxShadow:"var(--shadow-lg)" }} />
        <div style={{ flex:1, minWidth:220 }}>
          <div style={{ display:"flex", gap:8, marginBottom:10, flexWrap:"wrap" }}>
            <Badge color={work.type==="Webtoon"?"purple":work.type==="Manga"?"pink":"peach"}>{work.type}</Badge>
            <Badge color="gray">{work.genre}</Badge>
            <Badge color={work.status==="Completed"?"green":work.status==="Hiatus"?"red":"purple"}>{work.status}</Badge>
          </div>
          <h1 style={{ fontFamily:"var(--font-display)", fontSize:26, color:"var(--dark)", marginBottom:6 }}>{work.title}</h1>
          <p style={{ fontSize:14, color:"var(--gray)", marginBottom:12 }}>by <strong style={{ color:"var(--purple)" }}>{work.author}</strong></p>
          <RatingStars rating={work.rating} />
          <div style={{ display:"flex", gap:20, marginTop:12, marginBottom:16 }}>
            <Stat icon="👁" value={work.views} label="Views" />
            <Stat icon="❤️" value={fmtNum(localLikes)} label="Likes" />
            <Stat icon="📖" value={work.chapters} label="Chapters" />
          </div>
          <p style={{ fontSize:14, color:"var(--gray)", lineHeight:1.6, marginBottom:16 }}>{work.description}</p>
          <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:16 }}>
            {work.tags.map(t=><Badge key={t} color="gray">{t}</Badge>)}
          </div>
          <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
            <Btn size="lg" onClick={()=>onRead(work, MOCK_CHAPTERS[0])}>📖 Start Reading</Btn>
            <Btn variant="outline" onClick={handleLike}>{liked?"❤️":"🤍"} {fmtNum(localLikes)}</Btn>
            <Btn variant="outline" onClick={handleBookmark}>{bookmarked?"🔖":"📌"} {bookmarked?"Saved":"Save"}</Btn>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display:"flex", gap:0, borderBottom:"2px solid var(--gray-light)", marginBottom:20 }}>
        {["chapters","comments"].map(t=>(
          <button key={t} onClick={()=>setTab(t)}
            style={{ padding:"10px 24px", border:"none", background:"none", fontWeight:700, fontSize:14, cursor:"pointer",
              color: tab===t ? "var(--purple)" : "var(--gray)",
              borderBottom: tab===t ? "2px solid var(--purple)" : "2px solid transparent",
              marginBottom:-2, textTransform:"capitalize" }}>
            {t} {t==="chapters"?`(${work.chapters})`:`(${comments.length})`}
          </button>
        ))}
      </div>

      {tab==="chapters" && (
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          {MOCK_CHAPTERS.map(ch=>(
            <div key={ch.id} onClick={()=>onRead(work, ch)}
              style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 16px",
                background:"#fff", borderRadius:12, cursor:"pointer", border:"2px solid transparent",
                boxShadow:"var(--shadow)", transition:"all 0.2s" }}
              onMouseEnter={e=>{ e.currentTarget.style.borderColor="var(--purple)"; e.currentTarget.style.background="var(--off-white)"; }}
              onMouseLeave={e=>{ e.currentTarget.style.borderColor="transparent"; e.currentTarget.style.background="#fff"; }}>
              <div>
                <p style={{ fontWeight:600, fontSize:14, color:"var(--dark)" }}>{ch.title}</p>
                <p style={{ fontSize:12, color:"var(--gray)", marginTop:2 }}>{ch.date} · 👁 {fmtNum(ch.views)}</p>
              </div>
              <span style={{ fontSize:18 }}>▶</span>
            </div>
          ))}
        </div>
      )}

      {tab==="comments" && (
        <div>
          {user && (
            <div style={{ marginBottom:20, background:"#fff", borderRadius:14, padding:16, boxShadow:"var(--shadow)" }}>
              <textarea value={commentText} onChange={e=>setCommentText(e.target.value)}
                placeholder="Share your thoughts..."
                style={{ width:"100%", minHeight:80, border:"2px solid var(--gray-light)", borderRadius:10,
                  padding:12, fontSize:14, resize:"vertical", outline:"none", fontFamily:"var(--font-body)" }}
                onFocus={e=>e.target.style.borderColor="var(--purple)"}
                onBlur={e=>e.target.style.borderColor="var(--gray-light)"} />
              <div style={{ display:"flex", justifyContent:"flex-end", marginTop:8 }}>
                <Btn onClick={handleComment} disabled={!commentText.trim()}>Post Comment</Btn>
              </div>
            </div>
          )}
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            {comments.map(c=>(
              <div key={c.id} style={{ background:"#fff", borderRadius:14, padding:16, boxShadow:"var(--shadow)" }}>
                <div style={{ display:"flex", gap:10, alignItems:"center", marginBottom:8 }}>
                  <Avatar src={c.avatar} name={c.user} size={36} />
                  <div>
                    <p style={{ fontWeight:700, fontSize:13 }}>{c.user}</p>
                    <p style={{ fontSize:11, color:"var(--gray)" }}>{c.date}</p>
                  </div>
                </div>
                <p style={{ fontSize:14, lineHeight:1.6, color:"var(--dark)" }}>{c.text}</p>
                <button style={{ marginTop:8, background:"none", border:"none", color:"var(--gray)", fontSize:12, cursor:"pointer", fontWeight:600 }}>
                  ❤️ {c.likes}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const Stat = ({ icon, value, label }) => (
  <div style={{ textAlign:"center" }}>
    <p style={{ fontWeight:700, fontSize:15, color:"var(--dark)" }}>{icon} {value}</p>
    <p style={{ fontSize:11, color:"var(--gray)" }}>{label}</p>
  </div>
);

// Reader Page
const ReaderPage = ({ work, chapter, onBack, onNextChapter }) => {
  const idx = MOCK_CHAPTERS.findIndex(c=>c.id===chapter.id);
  const hasNext = idx < MOCK_CHAPTERS.length-1;
  const hasPrev = idx > 0;

  const panels = Array.from({length:8},(_,i)=>({
    id:i, src:`https://picsum.photos/seed/${work.id*100+i}/700/500`, alt:`Panel ${i+1}`
  }));

  const novelParagraphs = [
    `The morning light filtered through dusty curtains, painting gold across the worn floorboards of the small apartment. ${work.author} had always said the best stories began not with a bang, but with a breath — the kind that fills your lungs just before everything changes.`,
    `She stood at the window, fingers pressed against cold glass, watching the city below pretend it hadn't seen her cry. Three years in this building, and she still hadn't learned the names of her neighbors. That felt important somehow, though she couldn't say why.`,
    `The letter had arrived yesterday. She hadn't opened it. It sat now on the kitchen counter, pristine white against the cracked tile, accusatory in its silence. She knew the handwriting without needing to check the return address.`,
    `"You can't avoid it forever," said a voice from the doorway. She didn't turn around. She didn't need to — she'd memorized the sound of his footsteps years ago, memorized the way he always paused one beat too long before speaking.`,
    `"Watch me," she said, and meant it. Or tried to mean it. The letter seemed to pulse from across the room, insistent as a heartbeat.`,
  ];

  return (
    <div style={{ maxWidth:720, margin:"0 auto" }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20, background:"#fff", borderRadius:14, padding:"12px 16px", boxShadow:"var(--shadow)" }}>
        <button onClick={onBack} style={{ background:"none", border:"none", color:"var(--purple)", fontWeight:700, cursor:"pointer" }}>← Back</button>
        <div style={{ textAlign:"center" }}>
          <p style={{ fontWeight:700, fontSize:14 }}>{work.title}</p>
          <p style={{ fontSize:12, color:"var(--gray)" }}>{chapter.title}</p>
        </div>
        <div style={{ display:"flex", gap:8 }}>
          {hasPrev && <Btn size="sm" variant="outline" onClick={()=>onNextChapter(MOCK_CHAPTERS[idx-1])}>‹</Btn>}
          {hasNext && <Btn size="sm" onClick={()=>onNextChapter(MOCK_CHAPTERS[idx+1])}>›</Btn>}
        </div>
      </div>

      {work.type === "Novel" ? (
        <div style={{ background:"#fff", borderRadius:16, padding:"32px 36px", boxShadow:"var(--shadow)", lineHeight:1.9, fontSize:16, color:"var(--dark)" }}>
          <h2 style={{ fontFamily:"var(--font-display)", fontSize:24, marginBottom:24, color:"var(--purple)" }}>{chapter.title}</h2>
          {novelParagraphs.map((p,i)=><p key={i} style={{ marginBottom:20 }}>{p}</p>)}
          <p style={{ color:"var(--gray)", textAlign:"center", marginTop:32 }}>— End of {chapter.title} —</p>
        </div>
      ) : (
        <div style={{ display:"flex", flexDirection:"column", gap:2 }}>
          {panels.map(p=>(
            <img key={p.id} src={p.src} alt={p.alt}
              style={{ width:"100%", display:"block", borderRadius: p.id===0?"16px 16px 0 0":p.id===panels.length-1?"0 0 16px 16px":"0" }} />
          ))}
        </div>
      )}

      <div style={{ display:"flex", justifyContent:"center", gap:12, marginTop:24 }}>
        {hasPrev && <Btn variant="outline" onClick={()=>onNextChapter(MOCK_CHAPTERS[idx-1])}>← Previous Chapter</Btn>}
        {hasNext && <Btn onClick={()=>onNextChapter(MOCK_CHAPTERS[idx+1])}>Next Chapter →</Btn>}
      </div>
    </div>
  );
};

// Library Page
const LibraryPage = ({ onWorkClick }) => {
  const { user } = useApp();
  const saved = MOCK_WORKS.filter(w=>w.approved).slice(0,4);

  return (
    <div>
      <h1 style={{ fontFamily:"var(--font-display)", fontSize:28, marginBottom:8 }}>My Library</h1>
      <p style={{ color:"var(--gray)", marginBottom:24 }}>Your bookmarked stories</p>

      <div style={{ display:"flex", gap:8, marginBottom:24 }}>
        {["All","Webtoon","Manga","Novel"].map(t=>(
          <button key={t} style={{ padding:"6px 16px", borderRadius:20, border:"2px solid var(--purple-pale)",
            background:"#fff", color:"var(--purple)", fontWeight:600, fontSize:13, cursor:"pointer" }}>{t}</button>
        ))}
      </div>

      {user ? (
        saved.length > 0 ? (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))", gap:16 }}>
            {saved.map(w=><WorkCard key={w.id} work={w} onClick={onWorkClick} />)}
          </div>
        ) : (
          <Empty icon="📚" title="Your library is empty" sub="Bookmark stories to save them here" />
        )
      ) : (
        <Empty icon="🔒" title="Log in to view your library" sub="Save your favorite stories across devices" />
      )}
    </div>
  );
};

const Empty = ({ icon, title, sub }) => (
  <div style={{ textAlign:"center", padding:"80px 20px", color:"var(--gray)" }}>
    <p style={{ fontSize:56, marginBottom:16 }}>{icon}</p>
    <p style={{ fontSize:20, fontWeight:700, color:"var(--dark)", marginBottom:8 }}>{title}</p>
    <p style={{ fontSize:14 }}>{sub}</p>
  </div>
);

// Auth Page
const AuthPage = ({ mode, onAuth }) => {
  const { showToast } = useApp();
  const [tab, setTab] = useState(mode || "login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("reader");

  const handleSubmit = () => {
    if (tab === "login") {
      const u = MOCK_USERS[email];
      if (u && u.password === password) {
        onAuth(u);
        showToast(`Welcome back, ${u.name}! 👋`, "success");
      } else {
        showToast("Invalid email or password", "error");
      }
    } else {
      if (!name || !email || !password) { showToast("Please fill all fields", "error"); return; }
      const newUser = { id:"u_"+Date.now(), name, email, password, role, avatar:`https://picsum.photos/seed/${email}/60/60`, library:[], history:[], following:[] };
      MOCK_USERS[email] = newUser;
      onAuth(newUser);
      showToast(`Welcome to Palixia, ${name}! 🎉`, "success");
    }
  };

  const demoLogin = (email, pw) => { setEmail(email); setPassword(pw); };

  return (
    <div style={{ maxWidth:440, margin:"0 auto" }}>
      <div style={{ textAlign:"center", marginBottom:32 }}>
        <div style={{ fontSize:48, marginBottom:8 }}>📖</div>
        <h1 style={{ fontFamily:"var(--font-display)", fontSize:28, color:"var(--dark)" }}>
          {tab==="login"?"Welcome back":"Join Palixia"}
        </h1>
        <p style={{ color:"var(--gray)", marginTop:4 }}>
          {tab==="login"?"Sign in to continue your story":"Create your free account"}
        </p>
      </div>

      <div style={{ background:"#fff", borderRadius:20, padding:32, boxShadow:"var(--shadow-lg)" }}>
        <div style={{ display:"flex", background:"var(--gray-light)", borderRadius:12, padding:4, marginBottom:24 }}>
          {["login","signup"].map(t=>(
            <button key={t} onClick={()=>setTab(t)}
              style={{ flex:1, padding:"9px", borderRadius:9, border:"none", fontWeight:700, fontSize:14, cursor:"pointer",
                background: tab===t ? "var(--purple)" : "transparent",
                color: tab===t ? "#fff" : "var(--gray)", transition:"all 0.2s", textTransform:"capitalize" }}>
              {t==="login"?"Log In":"Sign Up"}
            </button>
          ))}
        </div>

        <button style={{ width:"100%", padding:"12px", borderRadius:12, border:"2px solid var(--gray-light)",
          background:"#fff", fontWeight:600, fontSize:14, cursor:"pointer", display:"flex", alignItems:"center",
          justifyContent:"center", gap:10, marginBottom:16, transition:"border-color 0.2s" }}
          onMouseEnter={e=>e.currentTarget.style.borderColor="var(--purple)"}
          onMouseLeave={e=>e.currentTarget.style.borderColor="var(--gray-light)"}>
          <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          Continue with Google
        </button>

        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
          <div style={{ flex:1, height:1, background:"var(--gray-light)" }} />
          <span style={{ fontSize:12, color:"var(--gray)" }}>or</span>
          <div style={{ flex:1, height:1, background:"var(--gray-light)" }} />
        </div>

        {tab==="signup" && (
          <>
            <Input label="Display Name" value={name} onChange={setName} placeholder="Your name" icon="👤" />
            <div style={{ marginBottom:16 }}>
              <label style={{ display:"block", fontSize:13, fontWeight:600, marginBottom:6 }}>I want to</label>
              <div style={{ display:"flex", gap:8 }}>
                {[{v:"reader",label:"📖 Read stories"},{v:"creator",label:"✏️ Create content"}].map(r=>(
                  <button key={r.v} onClick={()=>setRole(r.v)}
                    style={{ flex:1, padding:"10px", borderRadius:10, border:`2px solid ${role===r.v?"var(--purple)":"var(--gray-light)"}`,
                      background: role===r.v ? "var(--purple-pale)" : "#fff",
                      color: role===r.v ? "var(--purple)" : "var(--gray)", fontWeight:600, fontSize:13, cursor:"pointer", transition:"all 0.2s" }}>
                    {r.label}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        <Input label="Email" type="email" value={email} onChange={setEmail} placeholder="you@example.com" icon="✉️" />
        <Input label="Password" type="password" value={password} onChange={setPassword} placeholder="••••••••" icon="🔒" />

        <Btn full size="lg" onClick={handleSubmit} style={{ marginTop:4 }}>
          {tab==="login"?"Log In":"Create Account"}
        </Btn>

        {/* Demo accounts */}
        <div style={{ marginTop:20, padding:14, background:"var(--off-white)", borderRadius:12 }}>
          <p style={{ fontSize:12, fontWeight:700, color:"var(--gray)", marginBottom:8 }}>🧪 Demo Accounts</p>
          <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
            {[
              { label:"Reader", e:"reader@test.com", p:"123" },
              { label:"Creator", e:"creator@test.com", p:"123" },
              { label:"Admin", e:"admin@palixia.com", p:"admin123" },
            ].map(d=>(
              <button key={d.e} onClick={()=>{ setTab("login"); demoLogin(d.e,d.p); }}
                style={{ padding:"7px 12px", borderRadius:8, border:"1px solid var(--gray-light)", background:"#fff",
                  fontSize:12, cursor:"pointer", fontWeight:600, color:"var(--purple)", textAlign:"left" }}>
                {d.label}: {d.e} / {d.p}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Creator Dashboard
const CreatorDashboard = () => {
  const { user, showToast } = useApp();
  const [tab, setTab] = useState("overview");
  const myWorks = MOCK_WORKS.filter(w=>w.creatorId===user?.id);
  const [showUpload, setShowUpload] = useState(false);
  const [newWork, setNewWork] = useState({ title:"", type:"Webtoon", genre:"Fantasy", description:"" });

  const totalViews = myWorks.reduce((s,w)=>s+(parseInt(w.views)*1000||0),0);
  const totalLikes = myWorks.reduce((s,w)=>s+w.likes,0);

  const handlePublish = () => {
    if (!newWork.title || !newWork.description) { showToast("Fill in all fields!", "error"); return; }
    showToast("Story submitted for review! ✅", "success");
    setShowUpload(false);
    setNewWork({ title:"", type:"Webtoon", genre:"Fantasy", description:"" });
  };

  const tabs = ["overview","my works","analytics","upload"];

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24, flexWrap:"wrap", gap:12 }}>
        <div>
          <h1 style={{ fontFamily:"var(--font-display)", fontSize:28 }}>Creator Studio</h1>
          <p style={{ color:"var(--gray)", marginTop:2 }}>Welcome back, {user?.name}</p>
        </div>
        <Btn onClick={()=>setTab("upload")}>+ New Story</Btn>
      </div>

      <div style={{ display:"flex", gap:8, marginBottom:24, borderBottom:"2px solid var(--gray-light)" }}>
        {tabs.map(t=>(
          <button key={t} onClick={()=>setTab(t)}
            style={{ padding:"10px 18px", border:"none", background:"none", fontWeight:700, fontSize:13, cursor:"pointer", textTransform:"capitalize",
              color: tab===t ? "var(--purple)" : "var(--gray)",
              borderBottom: tab===t ? "2px solid var(--purple)" : "2px solid transparent", marginBottom:-2 }}>
            {t}
          </button>
        ))}
      </div>

      {tab==="overview" && (
        <div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))", gap:16, marginBottom:32 }}>
            {[
              { icon:"📚", label:"My Stories", val:myWorks.length },
              { icon:"👁", label:"Total Views", val:fmtNum(totalViews) },
              { icon:"❤️", label:"Total Likes", val:fmtNum(totalLikes) },
              { icon:"⭐", label:"Avg Rating", val:(myWorks.reduce((s,w)=>s+w.rating,0)/myWorks.length||0).toFixed(1) },
            ].map(s=>(
              <div key={s.label} style={{ background:"#fff", borderRadius:16, padding:20, boxShadow:"var(--shadow)" }}>
                <p style={{ fontSize:28, marginBottom:6 }}>{s.icon}</p>
                <p style={{ fontSize:24, fontWeight:800, color:"var(--purple)" }}>{s.val}</p>
                <p style={{ fontSize:13, color:"var(--gray)" }}>{s.label}</p>
              </div>
            ))}
          </div>
          <h2 style={{ fontFamily:"var(--font-display)", fontSize:20, marginBottom:16 }}>My Stories</h2>
          {myWorks.length===0 ? <Empty icon="✏️" title="No stories yet" sub="Start creating your first story!" /> : (
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              {myWorks.map(w=>(
                <div key={w.id} style={{ background:"#fff", borderRadius:14, padding:16, boxShadow:"var(--shadow)", display:"flex", gap:14, alignItems:"center" }}>
                  <img src={w.cover} style={{ width:56, height:72, objectFit:"cover", borderRadius:10 }} alt="" />
                  <div style={{ flex:1 }}>
                    <p style={{ fontWeight:700, fontSize:15 }}>{w.title}</p>
                    <p style={{ fontSize:12, color:"var(--gray)" }}>{w.chapters} chapters · {w.views} views</p>
                    <div style={{ marginTop:4 }}>
                      <Badge color={w.approved?"green":"peach"}>{w.approved?"Published":"Pending Review"}</Badge>
                    </div>
                  </div>
                  <div style={{ textAlign:"right" }}>
                    <RatingStars rating={w.rating} />
                    <p style={{ fontSize:12, color:"var(--gray)", marginTop:4 }}>❤️ {fmtNum(w.likes)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab==="analytics" && (
        <div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))", gap:16, marginBottom:24 }}>
            {myWorks.map(w=>(
              <div key={w.id} style={{ background:"#fff", borderRadius:16, padding:16, boxShadow:"var(--shadow)" }}>
                <p style={{ fontWeight:700, fontSize:14, marginBottom:4 }}>{w.title}</p>
                <p style={{ color:"var(--purple)", fontWeight:800, fontSize:20 }}>{w.views}</p>
                <p style={{ fontSize:12, color:"var(--gray)" }}>total views</p>
                <div style={{ marginTop:8, background:"var(--purple-pale)", borderRadius:6, padding:"6px 10px" }}>
                  <p style={{ fontSize:12, color:"var(--purple)", fontWeight:600 }}>❤️ {fmtNum(w.likes)} likes</p>
                </div>
                <div style={{ marginTop:12 }}>
                  {[85,70,90,60,95,80,88].map((v,i)=>(
                    <div key={i} style={{ display:"inline-block", width:"calc(14% - 2px)", marginRight:2,
                      height:v*0.4, background:"var(--purple-light)", borderRadius:3, opacity:0.6+i*0.05, verticalAlign:"bottom" }} />
                  ))}
                  <p style={{ fontSize:10, color:"var(--gray)", marginTop:4 }}>Last 7 days</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab==="upload" && (
        <div style={{ maxWidth:560 }}>
          <h2 style={{ fontFamily:"var(--font-display)", fontSize:22, marginBottom:20 }}>Publish New Story</h2>
          <div style={{ background:"#fff", borderRadius:20, padding:28, boxShadow:"var(--shadow)" }}>
            <Input label="Story Title" value={newWork.title} onChange={v=>setNewWork({...newWork,title:v})} placeholder="Give your story a title..." />
            <div style={{ marginBottom:16 }}>
              <label style={{ display:"block", fontSize:13, fontWeight:600, marginBottom:6 }}>Content Type</label>
              <div style={{ display:"flex", gap:8 }}>
                {["Webtoon","Manga","Novel"].map(t=>(
                  <button key={t} onClick={()=>setNewWork({...newWork,type:t})}
                    style={{ flex:1, padding:10, borderRadius:10, border:`2px solid ${newWork.type===t?"var(--purple)":"var(--gray-light)"}`,
                      background: newWork.type===t ? "var(--purple-pale)":"#fff",
                      color: newWork.type===t ? "var(--purple)":"var(--gray)", fontWeight:700, fontSize:13, cursor:"pointer" }}>
                    {t==="Webtoon"?"🖼 ":"📕 "}{t}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ marginBottom:16 }}>
              <label style={{ display:"block", fontSize:13, fontWeight:600, marginBottom:6 }}>Genre</label>
              <select value={newWork.genre} onChange={e=>setNewWork({...newWork,genre:e.target.value})}
                style={{ width:"100%", padding:"11px 14px", border:"2px solid var(--gray-light)", borderRadius:10, fontSize:14, outline:"none" }}>
                {GENRES.map(g=><option key={g}>{g}</option>)}
              </select>
            </div>
            <div style={{ marginBottom:16 }}>
              <label style={{ display:"block", fontSize:13, fontWeight:600, marginBottom:6 }}>Description</label>
              <textarea value={newWork.description} onChange={e=>setNewWork({...newWork,description:e.target.value})}
                placeholder="What is your story about?"
                style={{ width:"100%", minHeight:100, border:"2px solid var(--gray-light)", borderRadius:10, padding:12, fontSize:14, resize:"vertical", outline:"none", fontFamily:"var(--font-body)" }}
                onFocus={e=>e.target.style.borderColor="var(--purple)"}
                onBlur={e=>e.target.style.borderColor="var(--gray-light)"} />
            </div>
            <div style={{ border:"2px dashed var(--purple-mid)", borderRadius:12, padding:"28px", textAlign:"center", marginBottom:20, cursor:"pointer", background:"var(--off-white)" }}>
              <p style={{ fontSize:32, marginBottom:8 }}>🖼</p>
              <p style={{ fontWeight:600, color:"var(--purple)" }}>Upload Cover Image</p>
              <p style={{ fontSize:12, color:"var(--gray)", marginTop:4 }}>JPG, PNG · Max 5MB</p>
            </div>
            <div style={{ border:"2px dashed var(--purple-mid)", borderRadius:12, padding:"28px", textAlign:"center", marginBottom:20, cursor:"pointer", background:"var(--off-white)" }}>
              <p style={{ fontSize:32, marginBottom:8 }}>📁</p>
              <p style={{ fontWeight:600, color:"var(--purple)" }}>Upload Chapter Files</p>
              <p style={{ fontSize:12, color:"var(--gray)", marginTop:4 }}>Images for webtoon/manga · TXT for novels</p>
            </div>
            <div style={{ background:"var(--purple-pale)", borderRadius:10, padding:12, marginBottom:20 }}>
              <p style={{ fontSize:13, color:"var(--purple)", fontWeight:600 }}>ℹ️ Review Process</p>
              <p style={{ fontSize:12, color:"var(--purple)", marginTop:4 }}>Your story will be reviewed by our team within 24-48 hours before going live.</p>
            </div>
            <Btn full size="lg" onClick={handlePublish}>Submit for Review</Btn>
          </div>
        </div>
      )}

      {tab==="my works" && (
        <div>
          {myWorks.length===0 ? <Empty icon="✏️" title="No stories yet" sub="Click '+ New Story' to get started" /> : (
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))", gap:16 }}>
              {myWorks.map(w=>(
                <div key={w.id} style={{ borderRadius:16, overflow:"hidden", background:"#fff", boxShadow:"var(--shadow)" }}>
                  <img src={w.cover} style={{ width:"100%", aspectRatio:"200/280", objectFit:"cover" }} alt="" />
                  <div style={{ padding:12 }}>
                    <p style={{ fontWeight:700, fontSize:13 }}>{w.title}</p>
                    <Badge color={w.approved?"green":"peach"}>{w.approved?"Live":"Pending"}</Badge>
                    <p style={{ fontSize:11, color:"var(--gray)", marginTop:6 }}>{w.chapters} chapters</p>
                    <Btn full size="sm" variant="outline" style={{ marginTop:8 }}>+ Add Chapter</Btn>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Admin Panel
const AdminPanel = ({ onWorkClick }) => {
  const { showToast } = useApp();
  const [works, setWorks] = useState(MOCK_WORKS);
  const [tab, setTab] = useState("pending");

  const pending = works.filter(w=>!w.approved);
  const approved = works.filter(w=>w.approved);

  const approve = (id) => {
    setWorks(w=>w.map(x=>x.id===id?{...x,approved:true}:x));
    showToast("Story approved and published! ✅", "success");
  };
  const reject = (id) => {
    setWorks(w=>w.filter(x=>x.id!==id));
    showToast("Story rejected and removed", "error");
  };

  return (
    <div>
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:24 }}>
        <div style={{ background:"var(--danger)", borderRadius:10, padding:"6px 12px" }}>
          <span style={{ color:"#fff", fontWeight:700, fontSize:12 }}>🔐 ADMIN</span>
        </div>
        <h1 style={{ fontFamily:"var(--font-display)", fontSize:28 }}>Moderation Panel</h1>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))", gap:16, marginBottom:32 }}>
        {[
          { icon:"⏳", label:"Pending Review", val:pending.length, color:"var(--peach)" },
          { icon:"✅", label:"Published", val:approved.length, color:"var(--success)" },
          { icon:"📚", label:"Total Stories", val:works.length, color:"var(--purple)" },
          { icon:"👥", label:"Creators", val:Object.values(MOCK_USERS).filter(u=>u.role==="creator").length, color:"var(--pink)" },
        ].map(s=>(
          <div key={s.label} style={{ background:"#fff", borderRadius:16, padding:20, boxShadow:"var(--shadow)", borderLeft:`4px solid ${s.color}` }}>
            <p style={{ fontSize:24 }}>{s.icon}</p>
            <p style={{ fontSize:26, fontWeight:800, color:s.color, marginTop:4 }}>{s.val}</p>
            <p style={{ fontSize:12, color:"var(--gray)" }}>{s.label}</p>
          </div>
        ))}
      </div>

      <div style={{ display:"flex", gap:8, marginBottom:20, borderBottom:"2px solid var(--gray-light)" }}>
        {["pending","approved"].map(t=>(
          <button key={t} onClick={()=>setTab(t)}
            style={{ padding:"10px 20px", border:"none", background:"none", fontWeight:700, fontSize:14, cursor:"pointer", textTransform:"capitalize",
              color: tab===t ? "var(--purple)" : "var(--gray)",
              borderBottom: tab===t ? "2px solid var(--purple)" : "2px solid transparent", marginBottom:-2 }}>
            {t} {t==="pending"?`(${pending.length})`:`(${approved.length})`}
          </button>
        ))}
      </div>

      {tab==="pending" && (
        pending.length===0 ? <Empty icon="🎉" title="All clear!" sub="No stories pending review" /> : (
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            {pending.map(w=>(
              <div key={w.id} style={{ background:"#fff", borderRadius:16, padding:20, boxShadow:"var(--shadow)", display:"flex", gap:16, flexWrap:"wrap" }}>
                <img src={w.cover} style={{ width:70, height:90, objectFit:"cover", borderRadius:10, flexShrink:0 }} alt="" />
                <div style={{ flex:1, minWidth:180 }}>
                  <div style={{ display:"flex", gap:8, marginBottom:6, flexWrap:"wrap" }}>
                    <Badge color={w.type==="Webtoon"?"purple":w.type==="Manga"?"pink":"peach"}>{w.type}</Badge>
                    <Badge color="gray">{w.genre}</Badge>
                  </div>
                  <p style={{ fontWeight:700, fontSize:16 }}>{w.title}</p>
                  <p style={{ fontSize:13, color:"var(--gray)", margin:"4px 0 8px" }}>by {w.author}</p>
                  <p style={{ fontSize:13, color:"var(--dark)", lineHeight:1.5 }}>{w.description}</p>
                </div>
                <div style={{ display:"flex", gap:8, alignItems:"flex-start", flexShrink:0 }}>
                  <Btn variant="success" onClick={()=>approve(w.id)}>✓ Approve</Btn>
                  <Btn variant="danger" onClick={()=>reject(w.id)}>✕ Reject</Btn>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {tab==="approved" && (
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          {approved.map(w=>(
            <div key={w.id} style={{ background:"#fff", borderRadius:14, padding:16, boxShadow:"var(--shadow)", display:"flex", gap:14, alignItems:"center" }}>
              <img src={w.cover} style={{ width:50, height:65, objectFit:"cover", borderRadius:8 }} alt="" />
              <div style={{ flex:1 }}>
                <p style={{ fontWeight:700 }}>{w.title}</p>
                <p style={{ fontSize:12, color:"var(--gray)" }}>by {w.author} · {w.views} views</p>
              </div>
              <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                <RatingStars rating={w.rating} />
                <Btn size="sm" variant="danger" onClick={()=>reject(w.id)}>Remove</Btn>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Profile Page
const ProfilePage = ({ onWorkClick }) => {
  const { user, showToast } = useApp();
  if (!user) return <Empty icon="🔒" title="Please log in" sub="To view your profile" />;

  const myWork = MOCK_WORKS.filter(w=>w.approved).slice(0,3);

  return (
    <div>
      <div style={{ background:"linear-gradient(135deg, var(--purple), var(--purple-light))", borderRadius:20, padding:"32px 28px", marginBottom:28, color:"#fff" }}>
        <div style={{ display:"flex", gap:20, alignItems:"center" }}>
          <Avatar src={user.avatar} name={user.name} size={72} />
          <div>
            <h2 style={{ fontFamily:"var(--font-display)", fontSize:24 }}>{user.name}</h2>
            <p style={{ opacity:0.8, fontSize:14, marginTop:2 }}>{user.email}</p>
            <div style={{ marginTop:8 }}>
              <Badge color="purple" style={{ background:"rgba(255,255,255,0.2)", color:"#fff" }}>
                {user.role === "admin" ? "🔐 Admin" : user.role === "creator" ? "✏️ Creator" : "📖 Reader"}
              </Badge>
            </div>
          </div>
        </div>
        <div style={{ display:"flex", gap:24, marginTop:20 }}>
          {[{ label:"Following", val:0 },{ label:"Followers", val:0 },{ label:"Saved", val:0 }].map(s=>(
            <div key={s.label}>
              <p style={{ fontWeight:800, fontSize:20 }}>{s.val}</p>
              <p style={{ fontSize:12, opacity:0.75 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:28 }}>
        {[
          { icon:"📚", label:"Reading History", sub:"Stories you've read" },
          { icon:"🔖", label:"Bookmarks", sub:"Your saved stories" },
          { icon:"❤️", label:"Liked Stories", sub:"Stories you've liked" },
          { icon:"⚙️", label:"Settings", sub:"Account & preferences" },
        ].map(item=>(
          <div key={item.label} style={{ background:"#fff", borderRadius:14, padding:16, boxShadow:"var(--shadow)", cursor:"pointer" }}
            onMouseEnter={e=>e.currentTarget.style.boxShadow="var(--shadow-lg)"}
            onMouseLeave={e=>e.currentTarget.style.boxShadow="var(--shadow)"}>
            <p style={{ fontSize:28, marginBottom:6 }}>{item.icon}</p>
            <p style={{ fontWeight:700, fontSize:14 }}>{item.label}</p>
            <p style={{ fontSize:12, color:"var(--gray)", marginTop:2 }}>{item.sub}</p>
          </div>
        ))}
      </div>

      {user.role !== "admin" && (
        <Section title="Continue Reading" subtitle="Pick up where you left off">
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))", gap:14 }}>
            {myWork.map(w=><WorkCard key={w.id} work={w} onClick={onWorkClick} />)}
          </div>
        </Section>
      )}
    </div>
  );
};

// ─── Navbar ──────────────────────────────────────────────────────────
const Navbar = ({ page, setPage, user, onLogout }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navItems = [
    { id:"home", label:"Home", icon:"🏠" },
    { id:"browse", label:"Browse", icon:"🔍" },
    { id:"library", label:"Library", icon:"📚" },
    ...(user?.role==="creator"||user?.role==="admin" ? [{ id:"creator", label: user?.role==="admin"?"Admin":"Studio", icon: user?.role==="admin"?"🔐":"✏️" }] : []),
  ];

  return (
    <>
      <nav style={{
        position:"sticky", top:0, zIndex:100,
        background:"rgba(255,255,255,0.96)", backdropFilter:"blur(12px)",
        borderBottom:"1px solid var(--gray-light)", padding:"0 16px",
        display:"flex", alignItems:"center", justifyContent:"space-between", height:60,
      }}>
        <button onClick={()=>setPage("home")} style={{ background:"none", border:"none", cursor:"pointer", display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:36, height:36, borderRadius:10, background:"var(--purple)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>📖</div>
          <span style={{ fontFamily:"var(--font-display)", fontWeight:900, fontSize:20, color:"var(--purple)" }}>Palixia</span>
        </button>

        {/* Desktop Nav */}
        <div style={{ display:"flex", gap:4, alignItems:"center" }}>
          {navItems.map(n=>(
            <button key={n.id} onClick={()=>setPage(n.id)}
              style={{ padding:"7px 14px", borderRadius:10, border:"none", fontWeight:600, fontSize:13, cursor:"pointer",
                background: page===n.id ? "var(--purple-pale)" : "transparent",
                color: page===n.id ? "var(--purple)" : "var(--gray)", transition:"all 0.2s" }}>
              {n.label}
            </button>
          ))}
        </div>

        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
          {user ? (
            <div style={{ display:"flex", alignItems:"center", gap:8, cursor:"pointer" }} onClick={()=>setPage("profile")}>
              <Avatar src={user.avatar} name={user.name} size={34} />
              <button onClick={e=>{ e.stopPropagation(); onLogout(); }}
                style={{ background:"var(--gray-light)", border:"none", borderRadius:8, padding:"6px 12px", fontSize:12, fontWeight:700, cursor:"pointer", color:"var(--gray)" }}>
                Out
              </button>
            </div>
          ) : (
            <Btn size="sm" onClick={()=>setPage("auth")}>Log In</Btn>
          )}
        </div>
      </nav>

      {/* Bottom Mobile Nav */}
      <div style={{
        position:"fixed", bottom:0, left:0, right:0, zIndex:100,
        background:"rgba(255,255,255,0.97)", backdropFilter:"blur(12px)",
        borderTop:"1px solid var(--gray-light)", display:"flex", justifyContent:"space-around",
        padding:"8px 0 env(safe-area-inset-bottom)", boxShadow:"0 -4px 20px rgba(107,0,245,0.08)",
      }}>
        {[...navItems, { id:"profile", label: user?"Profile":"Login", icon: user?"👤":"🔐" }].map(n=>(
          <button key={n.id} onClick={()=>setPage(n.id==="profile" && !user ? "auth" : n.id)}
            style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:2, background:"none", border:"none",
              cursor:"pointer", padding:"4px 12px", borderRadius:10,
              color: page===n.id ? "var(--purple)" : "var(--gray)" }}>
            <span style={{ fontSize:20 }}>{n.icon}</span>
            <span style={{ fontSize:10, fontWeight:700 }}>{n.label}</span>
          </button>
        ))}
      </div>
    </>
  );
};

// ─── Main App ────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("home");
  const [user, setUser] = useState(null);
  const [selectedWork, setSelectedWork] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [toast, setToast] = useState(null);
  const [reading, setReading] = useState(false);

  const showToast = (message, type="success") => {
    setToast({ message, type });
    setTimeout(()=>setToast(null), 3000);
  };

  const handleWorkClick = (work) => {
    setSelectedWork(work);
    setSelectedChapter(null);
    setReading(false);
    setPage("detail");
  };

  const handleRead = (work, chapter) => {
    setSelectedWork(work);
    setSelectedChapter(chapter);
    setReading(true);
    setPage("reader");
  };

  const handleAuth = (u) => {
    setUser(u);
    setPage("home");
  };

  const handleLogout = () => {
    setUser(null);
    setPage("home");
    showToast("Logged out successfully", "success");
  };

  const handlePageSet = (p) => {
    setPage(p);
    window.scrollTo({ top:0, behavior:"smooth" });
  };

  const renderPage = () => {
    if (page === "reader" && selectedWork && selectedChapter) {
      return <ReaderPage work={selectedWork} chapter={selectedChapter}
        onBack={()=>{ setPage("detail"); setReading(false); }}
        onNextChapter={(ch)=>{ setSelectedChapter(ch); }} />;
    }
    if (page === "detail" && selectedWork) {
      return <WorkDetailPage work={selectedWork} onBack={()=>setPage("browse")} onRead={handleRead} />;
    }
    switch(page) {
      case "home":    return <HomePage onWorkClick={handleWorkClick} />;
      case "browse":  return <BrowsePage onWorkClick={handleWorkClick} />;
      case "library": return <LibraryPage onWorkClick={handleWorkClick} />;
      case "creator": return user?.role==="admin" ? <AdminPanel onWorkClick={handleWorkClick} /> : <CreatorDashboard />;
      case "auth":    return <AuthPage onAuth={handleAuth} />;
      case "profile": return <ProfilePage onWorkClick={handleWorkClick} />;
      default:        return <HomePage onWorkClick={handleWorkClick} />;
    }
  };

  return (
    <AppContext.Provider value={{ user, showToast }}>
      <FontLink />
      <div style={{ minHeight:"100vh", background:"var(--off-white)" }}>
        {page !== "reader" && (
          <Navbar page={page} setPage={handlePageSet} user={user} onLogout={handleLogout} />
        )}
        <main style={{ maxWidth:960, margin:"0 auto", padding: page==="reader" ? "24px 16px 80px" : "28px 16px 100px" }}>
          {renderPage()}
        </main>
        {toast && <Toast message={toast.message} type={toast.type} onClose={()=>setToast(null)} />}
      </div>
    </AppContext.Provider>
  );
}
