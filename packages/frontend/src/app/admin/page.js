'use client';
import { useState } from "react";


// ── Icons ──────────────────────────────────────────────────────────────────
const Icon = ({ d, size = 18, className = "", style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
    className={className} style={style}>
    <path d={d} />
  </svg>
);
const Icons = {
  dashboard: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10",
  journals:  "M4 19.5A2.5 2.5 0 016.5 17H20 M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z",
  announce:  "M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 01-3.46 0",
  media:     "M15 10l4.553-2.276A1 1 0 0121 8.723v6.554a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z",
  heroes:    "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  events:    "M8 2v4 M16 2v4 M3 10h18 M21 8a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2h14a2 2 0 002-2V8z",
  groups:    "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M23 21v-2a4 4 0 00-3-3.87 M9 3a4 4 0 010 8 M16 3.13a4 4 0 010 7.75",
  resources: "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8",
  prayer:    "M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z",
  about:     "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  contact:   "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6",
  plus:      "M12 5v14 M5 12h14",
  edit:      "M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7 M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z",
  trash:     "M3 6h18 M8 6V4h8v2 M19 6l-1 14H6L5 6",
  close:     "M18 6L6 18 M6 6l12 12",
  search:    "M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z",
  logout:    "M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4 M16 17l5-5-5-5 M21 12H9",
  download:  "M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4 M7 10l5 5 5-5 M12 15V3",
  reply:     "M9 17H5a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v5 M19 15l-7 7-7-7",
  check:     "M20 6L9 17l-5-5",
  eye:       "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 9a3 3 0 100 6 3 3 0 000-6z",
  chevronL:  "M15 18l-6-6 6-6",
  chevronR:  "M9 18l6-6-6-6",
};

// ── Palette ────────────────────────────────────────────────────────────────
const C = { primary: "#2E6DE7", navy: "#0F2A4A", purple: "#7C3AED", white: "#F5F7FF", border: "#E2E8F7" };

// ── Seed Data ──────────────────────────────────────────────────────────────
const seed = {
  journals: [
    { id: 1, title: "Faith and Science: Finding Harmony", author: "Dr. Michael Tembo", category: "Academic", date: "2023-08-15", status: "Published" },
    { id: 2, title: "Prayer Journaling for Students", author: "Sarah Mwanza", category: "Spiritual Growth", date: "2023-07-22", status: "Published" },
    { id: 3, title: "Biblical Principles for Academic Success", author: "Pastor James Mulenga", category: "Academic", date: "2023-06-10", status: "Draft" },
    { id: 4, title: "Finding Your Purpose at University", author: "Dr. Elizabeth Banda", category: "Personal Development", date: "2023-05-18", status: "Published" },
  ],
  announcements: [
    { id: 1, title: "Freshman Welcome Sabbath", date: "2025-09-13", type: "Worship", status: "Active", body: "A special sabbath to welcome all freshmen to our campus ministry." },
    { id: 2, title: "Semester Membership Drive", date: "2026-03-01", type: "Admin", status: "Active", body: "ZMW 50/semester. Contact treasurer Agness Bwalya on MTN 0976 123 456." },
    { id: 3, title: "Overnight Prayer Night", date: "2025-09-15", type: "Prayer", status: "Archived", body: "Talk to God in prayer for reflection and spiritual growth." },
  ],
  media: [
    { id: 1, title: "Hymns and Harmony Worship", type: "Sermon", presenter: "Inspire Love Music", date: "2025-08-27", status: "Published", url: "" },
    { id: 2, title: "Balancing Faith and Academia", type: "Sermon", presenter: "Eng. Choolwe Sitima", date: "2025-08-20", status: "Published", url: "" },
    { id: 3, title: "The Fellowship Band Lesson Summary", type: "Event Video", presenter: "Rev. Edward Phiri", date: "2025-09-13", status: "Published", url: "" },
  ],
  heroes: [
    { id: 1, name: "Victor Mutinta", role: "PCM Chairperson 2024-2025", year: "2024-25", bio: "Victor led the PCM through one of its most challenging years.", status: "Featured" },
    { id: 2, name: "Agness Bwalya", role: "Social Welfare Committee Leader", year: "2024-25", bio: "Agness organized multiple community service initiatives.", status: "Featured" },
    { id: 3, name: "Emmanuel Siasuntwe", role: "Personal Ministries", year: "2024-25", bio: "Emmanuel's innovative approach attracted many non-believers.", status: "Featured" },
    { id: 4, name: "Choolwe Sitima", role: "Choir Director", year: "2024-25", bio: "Choolwe revitalized the PCM choir.", status: "Featured" },
    { id: 5, name: "Elina Mwelwa", role: "Prayer Band Leader", year: "2024-25", bio: "Elina established the 24-hour prayer chain.", status: "Draft" },
    { id: 6, name: "Kenty Siawala", role: "MU-SASM Chairperson", year: "2024-25", bio: "Kenty pioneered the campus-wide Faith Conversations program.", status: "Featured" },
  ],
  events: [
    { id: 1, title: "Freshman Welcome Sabbath Worship", date: "2025-09-13", time: "08:00", venue: "Rockside SDA Church", description: "A special sabbath to welcome all freshmen.", status: "Past" },
    { id: 2, title: "Overnight Prayer", date: "2025-09-15", time: "19:00", venue: "Chalabesa Hall", description: "Talk to GOD in prayer for reflection.", status: "Past" },
    { id: 3, title: "Sunday Recreation", date: "2025-09-20", time: "05:00", venue: "Mulungushi Grounds", description: "Good health requires proper exercise and prayer.", status: "Past" },
    { id: 4, title: "Vespers Night", date: "2026-03-13", time: "19:00", venue: "Main Chapel", description: "Weekly Vespers service.", status: "Upcoming" },
  ],
  groups: [
    { id: 1, name: "Prayer Band", leader: "Elina Mwelwa", meetingDay: "Wednesday", time: "18:00", members: 24, description: "Weekly prayer and intercession meetings.", status: "Active" },
    { id: 2, name: "PCM Choir", leader: "Choolwe Sitima", meetingDay: "Friday", time: "17:00", members: 18, description: "Worship through music and song.", status: "Active" },
    { id: 3, name: "Bible Study Group", leader: "Emmanuel Siasuntwe", meetingDay: "Tuesday", time: "19:00", members: 31, description: "In-depth Bible study and discussions.", status: "Active" },
    { id: 4, name: "Community Service", leader: "Agness Bwalya", meetingDay: "Saturday", time: "09:00", members: 12, description: "Outreach and community service projects.", status: "Active" },
    { id: 5, name: "MU-SASM", leader: "Kenty Siawala", meetingDay: "Thursday", time: "16:00", members: 9, description: "Adventist Student Association meetings.", status: "Inactive" },
  ],
  resources: [
    { id: 1, title: "Academic Year Planner", description: "A comprehensive planner for Mulungushi University students.", category: "Planning", fileType: "PDF", status: "Published" },
    { id: 2, title: "Weekly Study Schedule Template", description: "Organize your weekly study sessions.", category: "Study", fileType: "PDF", status: "Published" },
    { id: 3, title: "Exam Preparation Guide", description: "Strategic approaches to preparing for exams.", category: "Study", fileType: "PDF", status: "Published" },
    { id: 4, title: "Task Prioritization Worksheet", description: "Learn to prioritize tasks by importance and urgency.", category: "Planning", fileType: "PDF", status: "Draft" },
  ],
  prayers: [
    { id: 1, name: "Tendai Moyo", email: "tendai@example.com", request: "Please pray for my upcoming final exams and for strength during this difficult semester.", date: "2026-03-05", status: "Unread" },
    { id: 2, name: "Grace Phiri", email: "grace@example.com", request: "Praying for healing for my mother who is in hospital.", date: "2026-03-04", status: "Prayed" },
    { id: 3, name: "Anonymous", email: "", request: "I need prayer for guidance on what course to take next semester.", date: "2026-03-03", status: "Prayed" },
    { id: 4, name: "Mwamba Chanda", email: "mwamba@example.com", request: "Please intercede for our study group — we are struggling with unity.", date: "2026-03-01", status: "Unread" },
  ],
  contacts: [
    { id: 1, name: "John Doe", email: "johndoe@example.com", subject: "Event Collaboration", message: "I wanted to reach out about a possible collaboration between our ministry and MU PCM for the upcoming semester.", date: "2026-03-06", status: "Unread" },
    { id: 2, name: "Mary Banda", email: "mary@example.com", subject: "Joining the Choir", message: "I am interested in joining the PCM choir. Could you let me know the audition requirements?", date: "2026-03-05", status: "Read" },
    { id: 3, name: "Pastor Lungu", email: "pastor.lungu@church.org", subject: "Vespers Partnership", message: "Our church would love to partner with PCM for this semester's Vespers nights.", date: "2026-03-03", status: "Replied" },
  ],
  about: {
    mission: "Mulungushi University Public Campus Ministries is dedicated to supporting students in their spiritual journey while pursuing academic excellence.",
    vision: "To raise a generation of faithful, academically excellent, and servant-hearted graduates who will transform Zambia and the world.",
    history: "MU PCM was established in 2005 by a group of dedicated Seventh-day Adventist students at Mulungushi University. Since then it has grown to become one of the most active campus ministries in Zambia.",
    address: "PCM Office, Student Center, Mulungushi University, Great North Road, Kabwe, Zambia",
    email: "info@mupcm.org",
    phone: "+260 123 456 789",
    facebook: "https://facebook.com/mupcm",
    instagram: "https://instagram.com/mupcm",
  },
};

// ── Badge ──────────────────────────────────────────────────────────────────
const Badge = ({ text }) => {
  const m = {
    Published:"bg-emerald-100 text-emerald-700", Active:"bg-blue-100 text-blue-700",
    Draft:"bg-amber-100 text-amber-700", Archived:"bg-slate-100 text-slate-500",
    Featured:"bg-purple-100 text-purple-700", Past:"bg-slate-100 text-slate-500",
    Upcoming:"bg-blue-100 text-blue-700", Inactive:"bg-red-100 text-red-500",
    Unread:"bg-orange-100 text-orange-700", Prayed:"bg-emerald-100 text-emerald-700",
    Read:"bg-slate-100 text-slate-500", Replied:"bg-blue-100 text-blue-700",
  };
  return <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${m[text]||"bg-gray-100 text-gray-600"}`}>{text}</span>;
};

// ── Modal ──────────────────────────────────────────────────────────────────
const Modal = ({ title, children, onClose, wide=false }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
    style={{ background:"rgba(15,42,74,0.6)", backdropFilter:"blur(4px)" }}>
    <div className={`bg-white rounded-2xl shadow-2xl w-full ${wide?"max-w-2xl":"max-w-lg"} max-h-screen overflow-y-auto`}>
      <div className="flex items-center justify-between px-6 py-4 border-b sticky top-0 bg-white z-10" style={{ borderColor:C.border }}>
        <h3 style={{ fontFamily:"'Playfair Display',serif", color:C.navy, fontSize:17, fontWeight:700 }}>{title}</h3>
        <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100"><Icon d={Icons.close} size={17} className="text-slate-400"/></button>
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  </div>
);

// ── Form helpers ───────────────────────────────────────────────────────────
const Field = ({ label, children }) => (
  <div className="mb-4">
    <label className="block text-xs font-semibold mb-1.5" style={{ color:C.navy, letterSpacing:"0.04em" }}>{label.toUpperCase()}</label>
    {children}
  </div>
);
const base = "w-full px-3 py-2 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-blue-300";
const iStyle = { borderColor:C.border, background:C.white, color:C.navy, fontFamily:"'Noto Sans',sans-serif" };
const Input = (p) => <input {...p} className={base} style={iStyle}/>;
const Textarea = (p) => <textarea {...p} rows={p.rows||3} className={`${base} resize-none`} style={iStyle}/>;
const Sel = ({ options, ...p }) => (
  <select {...p} className={base} style={iStyle}>
    {options.map(o => <option key={o}>{o}</option>)}
  </select>
);
const MFooter = ({ onClose, onSave }) => (
  <div className="flex justify-end gap-2 mt-4">
    <button onClick={onClose} className="px-4 py-2 rounded-xl text-sm border" style={{ borderColor:C.border, color:"#64748B" }}>Cancel</button>
    <button onClick={onSave} className="px-5 py-2 rounded-xl text-sm font-semibold text-white" style={{ background:C.primary }}>Save</button>
  </div>
);

// ── Table ──────────────────────────────────────────────────────────────────
const Table = ({ cols, rows, onEdit, onDelete, extra }) => (
  <div className="overflow-x-auto rounded-xl border" style={{ borderColor:C.border }}>
    <table className="w-full text-sm" style={{ fontFamily:"'Noto Sans',sans-serif" }}>
      <thead>
        <tr style={{ background:C.white }}>
          {cols.map(c => <th key={c.key} className="text-left px-4 py-3 text-xs font-semibold whitespace-nowrap" style={{ color:C.navy, letterSpacing:"0.04em" }}>{c.label.toUpperCase()}</th>)}
          <th className="text-right px-4 py-3 text-xs font-semibold" style={{ color:C.navy }}>ACTIONS</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={row.id} className="border-t hover:bg-blue-50 transition-colors" style={{ borderColor:C.border, background:i%2===0?"white":"#FAFBFF" }}>
            {cols.map(c => (
              <td key={c.key} className="px-4 py-3" style={{ color:"#334155" }}>
                {c.key==="status" ? <Badge text={row[c.key]}/> : c.clip ? <span className="block max-w-xs truncate">{row[c.key]}</span> : row[c.key]}
              </td>
            ))}
            <td className="px-4 py-3">
              <div className="flex justify-end gap-1.5">
                {extra && extra(row)}
                {onEdit && <button onClick={()=>onEdit(row)} className="p-1.5 rounded-lg hover:bg-blue-100 transition-colors" title="Edit"><Icon d={Icons.edit} size={14} className="text-blue-600"/></button>}
                {onDelete && <button onClick={()=>onDelete(row.id)} className="p-1.5 rounded-lg hover:bg-red-100 transition-colors" title="Delete"><Icon d={Icons.trash} size={14} className="text-red-500"/></button>}
              </div>
            </td>
          </tr>
        ))}
        {rows.length===0 && <tr><td colSpan={cols.length+1} className="px-4 py-10 text-center text-slate-400 text-sm">No records found.</td></tr>}
      </tbody>
    </table>
  </div>
);

// ── Section Header ─────────────────────────────────────────────────────────
const SHead = ({ title, sub, onAdd, search, onSearch }) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
    <div>
      <h2 style={{ fontFamily:"'Playfair Display',serif", color:C.navy, fontSize:22, fontWeight:700 }}>{title}</h2>
      {sub && <p className="text-xs mt-0.5" style={{ color:"#64748B" }}>{sub}</p>}
    </div>
    <div className="flex items-center gap-2">
      {onSearch!==undefined && (
        <div className="relative">
          <Icon d={Icons.search} size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"/>
          <input value={search} onChange={e=>onSearch(e.target.value)} placeholder="Search…"
            className="pl-8 pr-3 py-1.5 text-sm rounded-lg border outline-none"
            style={{ borderColor:C.border, background:C.white, color:C.navy, width:165 }}/>
        </div>
      )}
      {onAdd && (
        <button onClick={onAdd} className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white hover:opacity-90 active:scale-95 transition-all" style={{ background:C.primary }}>
          <Icon d={Icons.plus} size={14} className="text-white"/>Add New
        </button>
      )}
    </div>
  </div>
);

// ── Generic CRUD builder ───────────────────────────────────────────────────
function useCRUD(initial) {
  const [items, setItems] = useState(initial);
  const add    = item => setItems(p => [...p, { ...item, id: Date.now() }]);
  const update = item => setItems(p => p.map(x => x.id === item.id ? item : x));
  const remove = id   => setItems(p => p.filter(x => x.id !== id));
  return { items, add, update, remove };
}

// ═══════════════════════════════════════════════════════════════════════════
// ANNOUNCEMENTS
// ═══════════════════════════════════════════════════════════════════════════
const AnnouncementsSection = () => {
  const { items, add, update, remove } = useCRUD(seed.announcements);
  const [modal, setModal] = useState(null);
  const [search, setSearch] = useState("");
  const blank = { title:"", date:"", type:"General", status:"Active", body:"" };
  const [form, setForm] = useState(blank);
  const f = k => e => setForm(p=>({...p,[k]:e.target.value}));
  const filtered = items.filter(x=>x.title.toLowerCase().includes(search.toLowerCase()));
  const save = () => { modal==="add" ? add(form) : update({...form,id:modal.id}); setModal(null); };
  return (
    <div>
      <SHead title="Announcements" sub={`${items.length} total`} onAdd={()=>{setForm(blank);setModal("add");}} search={search} onSearch={setSearch}/>
      <Table cols={[{key:"title",label:"Title"},{key:"body",label:"Body",clip:true},{key:"date",label:"Date"},{key:"type",label:"Type"},{key:"status",label:"Status"}]}
        rows={filtered} onEdit={r=>{setForm({...r});setModal(r);}} onDelete={remove}/>
      {modal && <Modal title={modal==="add"?"New Announcement":"Edit Announcement"} onClose={()=>setModal(null)}>
        <Field label="Title"><Input value={form.title} onChange={f("title")} placeholder="Title"/></Field>
        <Field label="Body"><Textarea value={form.body} onChange={f("body")} rows={4} placeholder="Content…"/></Field>
        <div className="flex gap-3">
          <div className="flex-1"><Field label="Date"><Input type="date" value={form.date} onChange={f("date")}/></Field></div>
          <div className="flex-1"><Field label="Type"><Sel value={form.type} onChange={f("type")} options={["General","Worship","Prayer","Admin","Event"]}/></Field></div>
        </div>
        <Field label="Status"><Sel value={form.status} onChange={f("status")} options={["Active","Archived"]}/></Field>
        <MFooter onClose={()=>setModal(null)} onSave={save}/>
      </Modal>}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// JOURNALS
// ═══════════════════════════════════════════════════════════════════════════
const JournalsSection = () => {
  const { items, add, update, remove } = useCRUD(seed.journals);
  const [modal, setModal] = useState(null);
  const [search, setSearch] = useState("");
  const blank = { title:"", author:"", category:"Academic", date:"", status:"Draft" };
  const [form, setForm] = useState(blank);
  const f = k => e => setForm(p=>({...p,[k]:e.target.value}));
  const filtered = items.filter(x=>x.title.toLowerCase().includes(search.toLowerCase())||x.author.toLowerCase().includes(search.toLowerCase()));
  const save = () => { modal==="add" ? add(form) : update({...form,id:modal.id}); setModal(null); };
  return (
    <div>
      <SHead title="Journals & Articles" sub={`${items.length} entries`} onAdd={()=>{setForm(blank);setModal("add");}} search={search} onSearch={setSearch}/>
      <Table cols={[{key:"title",label:"Title",clip:true},{key:"author",label:"Author"},{key:"category",label:"Category"},{key:"date",label:"Date"},{key:"status",label:"Status"}]}
        rows={filtered} onEdit={r=>{setForm({...r});setModal(r);}} onDelete={remove}/>
      {modal && <Modal title={modal==="add"?"Add Article":"Edit Article"} onClose={()=>setModal(null)}>
        <Field label="Title"><Input value={form.title} onChange={f("title")} placeholder="Article title"/></Field>
        <Field label="Author"><Input value={form.author} onChange={f("author")} placeholder="Author name"/></Field>
        <div className="flex gap-3">
          <div className="flex-1"><Field label="Category"><Sel value={form.category} onChange={f("category")} options={["Academic","Spiritual Growth","Personal Development","Community"]}/></Field></div>
          <div className="flex-1"><Field label="Date"><Input type="date" value={form.date} onChange={f("date")}/></Field></div>
        </div>
        <Field label="Status"><Sel value={form.status} onChange={f("status")} options={["Draft","Published"]}/></Field>
        <MFooter onClose={()=>setModal(null)} onSave={save}/>
      </Modal>}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// MEDIA
// ═══════════════════════════════════════════════════════════════════════════
const MediaSection = () => {
  const { items, add, update, remove } = useCRUD(seed.media);
  const [modal, setModal] = useState(null);
  const [search, setSearch] = useState("");
  const blank = { title:"", type:"Sermon", presenter:"", date:"", status:"Draft", url:"" };
  const [form, setForm] = useState(blank);
  const f = k => e => setForm(p=>({...p,[k]:e.target.value}));
  const filtered = items.filter(x=>x.title.toLowerCase().includes(search.toLowerCase()));
  const save = () => { modal==="add" ? add(form) : update({...form,id:modal.id}); setModal(null); };
  return (
    <div>
      <SHead title="Media Library" sub={`${items.length} items`} onAdd={()=>{setForm(blank);setModal("add");}} search={search} onSearch={setSearch}/>
      <Table cols={[{key:"title",label:"Title",clip:true},{key:"type",label:"Type"},{key:"presenter",label:"Presenter"},{key:"date",label:"Date"},{key:"status",label:"Status"}]}
        rows={filtered} onEdit={r=>{setForm({...r});setModal(r);}} onDelete={remove}/>
      {modal && <Modal title={modal==="add"?"Add Media":"Edit Media"} onClose={()=>setModal(null)}>
        <Field label="Title"><Input value={form.title} onChange={f("title")} placeholder="Media title"/></Field>
        <div className="flex gap-3">
          <div className="flex-1"><Field label="Type"><Sel value={form.type} onChange={f("type")} options={["Sermon","Event Video","Photo Gallery","Music"]}/></Field></div>
          <div className="flex-1"><Field label="Presenter"><Input value={form.presenter} onChange={f("presenter")} placeholder="Name"/></Field></div>
        </div>
        <Field label="YouTube / URL"><Input value={form.url} onChange={f("url")} placeholder="https://…"/></Field>
        <div className="flex gap-3">
          <div className="flex-1"><Field label="Date"><Input type="date" value={form.date} onChange={f("date")}/></Field></div>
          <div className="flex-1"><Field label="Status"><Sel value={form.status} onChange={f("status")} options={["Draft","Published"]}/></Field></div>
        </div>
        <MFooter onClose={()=>setModal(null)} onSave={save}/>
      </Modal>}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// HEROES
// ═══════════════════════════════════════════════════════════════════════════
const HeroesSection = () => {
  const { items, add, update, remove } = useCRUD(seed.heroes);
  const [modal, setModal] = useState(null);
  const [search, setSearch] = useState("");
  const blank = { name:"", role:"", year:"2024-25", bio:"", status:"Draft" };
  const [form, setForm] = useState(blank);
  const f = k => e => setForm(p=>({...p,[k]:e.target.value}));
  const filtered = items.filter(x=>x.name.toLowerCase().includes(search.toLowerCase()));
  const save = () => { modal==="add" ? add(form) : update({...form,id:modal.id}); setModal(null); };
  return (
    <div>
      <SHead title="Campus Heroes" sub={`${items.length} heroes`} onAdd={()=>{setForm(blank);setModal("add");}} search={search} onSearch={setSearch}/>
      <Table cols={[{key:"name",label:"Name"},{key:"role",label:"Role",clip:true},{key:"year",label:"Year"},{key:"bio",label:"Bio",clip:true},{key:"status",label:"Status"}]}
        rows={filtered} onEdit={r=>{setForm({...r});setModal(r);}} onDelete={remove}/>
      {modal && <Modal title={modal==="add"?"Add Hero":"Edit Hero"} onClose={()=>setModal(null)}>
        <Field label="Full Name"><Input value={form.name} onChange={f("name")} placeholder="Full name"/></Field>
        <div className="flex gap-3">
          <div className="flex-1"><Field label="Role"><Input value={form.role} onChange={f("role")} placeholder="e.g. Choir Director"/></Field></div>
          <div className="flex-1"><Field label="Year"><Input value={form.year} onChange={f("year")} placeholder="2024-25"/></Field></div>
        </div>
        <Field label="Bio / Story"><Textarea value={form.bio} onChange={f("bio")} rows={4} placeholder="Their contribution…"/></Field>
        <Field label="Status"><Sel value={form.status} onChange={f("status")} options={["Draft","Featured"]}/></Field>
        <MFooter onClose={()=>setModal(null)} onSave={save}/>
      </Modal>}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// EVENTS
// ═══════════════════════════════════════════════════════════════════════════
const EventsSection = () => {
  const { items, add, update, remove } = useCRUD(seed.events);
  const [modal, setModal] = useState(null);
  const [search, setSearch] = useState("");
  const blank = { title:"", date:"", time:"", venue:"", description:"", status:"Upcoming" };
  const [form, setForm] = useState(blank);
  const f = k => e => setForm(p=>({...p,[k]:e.target.value}));
  const filtered = items.filter(x=>x.title.toLowerCase().includes(search.toLowerCase()));
  const save = () => { modal==="add" ? add(form) : update({...form,id:modal.id}); setModal(null); };
  return (
    <div>
      <SHead title="Events" sub={`${items.length} events`} onAdd={()=>{setForm(blank);setModal("add");}} search={search} onSearch={setSearch}/>
      <Table cols={[{key:"title",label:"Title",clip:true},{key:"date",label:"Date"},{key:"time",label:"Time"},{key:"venue",label:"Venue"},{key:"status",label:"Status"}]}
        rows={filtered} onEdit={r=>{setForm({...r});setModal(r);}} onDelete={remove}/>
      {modal && <Modal title={modal==="add"?"Create Event":"Edit Event"} onClose={()=>setModal(null)}>
        <Field label="Event Title"><Input value={form.title} onChange={f("title")} placeholder="Event name"/></Field>
        <div className="flex gap-3">
          <div className="flex-1"><Field label="Date"><Input type="date" value={form.date} onChange={f("date")}/></Field></div>
          <div className="flex-1"><Field label="Time"><Input type="time" value={form.time} onChange={f("time")}/></Field></div>
        </div>
        <Field label="Venue"><Input value={form.venue} onChange={f("venue")} placeholder="Location / Hall"/></Field>
        <Field label="Description"><Textarea value={form.description} onChange={f("description")} rows={3} placeholder="Event details…"/></Field>
        <Field label="Status"><Sel value={form.status} onChange={f("status")} options={["Upcoming","Past"]}/></Field>
        <MFooter onClose={()=>setModal(null)} onSave={save}/>
      </Modal>}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// GROUPS
// ═══════════════════════════════════════════════════════════════════════════
const GroupsSection = () => {
  const { items, add, update, remove } = useCRUD(seed.groups);
  const [modal, setModal] = useState(null);
  const [search, setSearch] = useState("");
  const blank = { name:"", leader:"", meetingDay:"Monday", time:"", members:"", description:"", status:"Active" };
  const [form, setForm] = useState(blank);
  const f = k => e => setForm(p=>({...p,[k]:e.target.value}));
  const filtered = items.filter(x=>x.name.toLowerCase().includes(search.toLowerCase()));
  const save = () => { modal==="add" ? add({...form,members:Number(form.members)||0}) : update({...form,id:modal.id,members:Number(form.members)||0}); setModal(null); };
  return (
    <div>
      <SHead title="Ministry Groups" sub={`${items.length} groups`} onAdd={()=>{setForm(blank);setModal("add");}} search={search} onSearch={setSearch}/>
      <Table cols={[{key:"name",label:"Group"},{key:"leader",label:"Leader"},{key:"meetingDay",label:"Day"},{key:"time",label:"Time"},{key:"members",label:"Members"},{key:"status",label:"Status"}]}
        rows={filtered} onEdit={r=>{setForm({...r,description:r.description||""});setModal(r);}} onDelete={remove}/>
      {modal && <Modal title={modal==="add"?"Create Group":"Edit Group"} onClose={()=>setModal(null)}>
        <Field label="Group Name"><Input value={form.name} onChange={f("name")} placeholder="e.g. Prayer Band"/></Field>
        <div className="flex gap-3">
          <div className="flex-1"><Field label="Leader"><Input value={form.leader} onChange={f("leader")} placeholder="Leader name"/></Field></div>
          <div className="flex-1"><Field label="Members"><Input type="number" value={form.members} onChange={f("members")} placeholder="0"/></Field></div>
        </div>
        <div className="flex gap-3">
          <div className="flex-1"><Field label="Meeting Day"><Sel value={form.meetingDay} onChange={f("meetingDay")} options={["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"]}/></Field></div>
          <div className="flex-1"><Field label="Time"><Input type="time" value={form.time} onChange={f("time")}/></Field></div>
        </div>
        <Field label="Description"><Textarea value={form.description} onChange={f("description")} rows={2} placeholder="Brief description…"/></Field>
        <Field label="Status"><Sel value={form.status} onChange={f("status")} options={["Active","Inactive"]}/></Field>
        <MFooter onClose={()=>setModal(null)} onSave={save}/>
      </Modal>}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// RESOURCES
// ═══════════════════════════════════════════════════════════════════════════
const ResourcesSection = () => {
  const { items, add, update, remove } = useCRUD(seed.resources);
  const [modal, setModal] = useState(null);
  const [search, setSearch] = useState("");
  const blank = { title:"", description:"", category:"Planning", fileType:"PDF", status:"Draft" };
  const [form, setForm] = useState(blank);
  const f = k => e => setForm(p=>({...p,[k]:e.target.value}));
  const filtered = items.filter(x=>x.title.toLowerCase().includes(search.toLowerCase()));
  const save = () => { modal==="add" ? add(form) : update({...form,id:modal.id}); setModal(null); };
  return (
    <div>
      <SHead title="Resources" sub="Downloadable files & guides" onAdd={()=>{setForm(blank);setModal("add");}} search={search} onSearch={setSearch}/>
      <Table cols={[{key:"title",label:"Title",clip:true},{key:"description",label:"Description",clip:true},{key:"category",label:"Category"},{key:"fileType",label:"Type"},{key:"status",label:"Status"}]}
        rows={filtered} onEdit={r=>{setForm({...r});setModal(r);}} onDelete={remove}
        extra={r=>(
          <button className="p-1.5 rounded-lg hover:bg-emerald-100 transition-colors" title="Upload file">
            <Icon d={Icons.download} size={14} className="text-emerald-600"/>
          </button>
        )}/>
      {modal && <Modal title={modal==="add"?"Add Resource":"Edit Resource"} onClose={()=>setModal(null)}>
        <Field label="Title"><Input value={form.title} onChange={f("title")} placeholder="Resource title"/></Field>
        <Field label="Description"><Textarea value={form.description} onChange={f("description")} rows={2} placeholder="Brief description…"/></Field>
        <div className="flex gap-3">
          <div className="flex-1"><Field label="Category"><Sel value={form.category} onChange={f("category")} options={["Planning","Study","Spiritual","Health","General"]}/></Field></div>
          <div className="flex-1"><Field label="File Type"><Sel value={form.fileType} onChange={f("fileType")} options={["PDF","DOCX","XLSX","Link"]}/></Field></div>
        </div>
        <Field label="File Upload">
          <div className="border-2 border-dashed rounded-xl p-4 text-center cursor-pointer hover:bg-blue-50 transition-colors" style={{ borderColor:C.border }}>
            <Icon d={Icons.download} size={20} className="mx-auto mb-1 text-slate-400"/>
            <p className="text-xs" style={{ color:"#64748B" }}>Click to upload or drag & drop</p>
            <p className="text-xs mt-0.5" style={{ color:"#94A3B8" }}>PDF, DOCX, XLSX — up to 10 MB</p>
          </div>
        </Field>
        <Field label="Status"><Sel value={form.status} onChange={f("status")} options={["Draft","Published"]}/></Field>
        <MFooter onClose={()=>setModal(null)} onSave={save}/>
      </Modal>}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// PRAYER REQUESTS
// ═══════════════════════════════════════════════════════════════════════════
const PrayerSection = () => {
  const { items, update, remove } = useCRUD(seed.prayers);
  const [viewing, setViewing] = useState(null);
  const [search, setSearch] = useState("");
  const filtered = items.filter(x=>x.name.toLowerCase().includes(search.toLowerCase())||x.request.toLowerCase().includes(search.toLowerCase()));
  const unread = items.filter(x=>x.status==="Unread").length;
  const toggle = row => update({...row, status: row.status==="Unread"?"Prayed":"Unread"});
  return (
    <div>
      <SHead title="Prayer Requests" sub={`${items.length} requests · ${unread} unread`} search={search} onSearch={setSearch}/>
      <Table cols={[{key:"name",label:"From"},{key:"request",label:"Request",clip:true},{key:"date",label:"Date"},{key:"status",label:"Status"}]}
        rows={filtered} onDelete={remove}
        extra={row=><>
          <button onClick={()=>toggle(row)} className="p-1.5 rounded-lg hover:bg-emerald-100 transition-colors" title="Toggle Prayed">
            <Icon d={Icons.check} size={14} className={row.status==="Prayed"?"text-emerald-600":"text-slate-300"}/>
          </button>
          <button onClick={()=>setViewing(row)} className="p-1.5 rounded-lg hover:bg-blue-100 transition-colors" title="View">
            <Icon d={Icons.eye} size={14} className="text-blue-500"/>
          </button>
        </>}/>
      {viewing && (
        <Modal title="Prayer Request" onClose={()=>setViewing(null)}>
          <div className="rounded-xl p-4 mb-4" style={{ background:C.white, border:`1px solid ${C.border}` }}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-sm font-semibold" style={{ color:C.navy }}>{viewing.name}</p>
                {viewing.email && <p className="text-xs" style={{ color:"#64748B" }}>{viewing.email}</p>}
              </div>
              <div className="text-right">
                <Badge text={viewing.status}/>
                <p className="text-xs mt-1" style={{ color:"#94A3B8" }}>{viewing.date}</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed" style={{ color:"#334155" }}>{viewing.request}</p>
          </div>
          <div className="flex justify-end gap-2">
            <button onClick={()=>setViewing(null)} className="px-4 py-2 rounded-xl text-sm border" style={{ borderColor:C.border, color:"#64748B" }}>Close</button>
            <button onClick={()=>{ update({...viewing,status:"Prayed"}); setViewing(null); }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white" style={{ background:"#059669" }}>
              <Icon d={Icons.check} size={14} className="text-white"/> Mark as Prayed
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// CONTACT INBOX
// ═══════════════════════════════════════════════════════════════════════════
const ContactSection = () => {
  const { items, update, remove } = useCRUD(seed.contacts);
  const [viewing, setViewing] = useState(null);
  const [search, setSearch] = useState("");
  const filtered = items.filter(x=>x.name.toLowerCase().includes(search.toLowerCase())||x.subject.toLowerCase().includes(search.toLowerCase()));
  const unread = items.filter(x=>x.status==="Unread").length;
  const open = row => { update({...row, status: row.status==="Unread"?"Read":row.status}); setViewing(row); };
  return (
    <div>
      <SHead title="Contact Inbox" sub={`${items.length} messages · ${unread} unread`} search={search} onSearch={setSearch}/>
      <Table cols={[{key:"name",label:"From"},{key:"subject",label:"Subject",clip:true},{key:"message",label:"Preview",clip:true},{key:"date",label:"Date"},{key:"status",label:"Status"}]}
        rows={filtered} onDelete={remove}
        extra={row=>(
          <button onClick={()=>open(row)} className="p-1.5 rounded-lg hover:bg-blue-100 transition-colors" title="View">
            <Icon d={Icons.eye} size={14} className="text-blue-500"/>
          </button>
        )}/>
      {viewing && (
        <Modal title="Message" onClose={()=>setViewing(null)} wide>
          <div className="rounded-xl p-4 mb-4" style={{ background:C.white, border:`1px solid ${C.border}` }}>
            <div className="grid grid-cols-2 gap-4 mb-3 pb-3 border-b" style={{ borderColor:C.border }}>
              <div>
                <p className="text-xs mb-0.5" style={{ color:"#94A3B8" }}>FROM</p>
                <p className="text-sm font-semibold" style={{ color:C.navy }}>{viewing.name}</p>
                <p className="text-xs" style={{ color:"#64748B" }}>{viewing.email}</p>
              </div>
              <div className="text-right">
                <p className="text-xs mb-0.5" style={{ color:"#94A3B8" }}>DATE</p>
                <p className="text-sm" style={{ color:C.navy }}>{viewing.date}</p>
                <Badge text={viewing.status}/>
              </div>
            </div>
            <p className="text-xs font-semibold mb-1" style={{ color:"#94A3B8" }}>SUBJECT</p>
            <p className="text-sm font-semibold mb-3" style={{ color:C.navy }}>{viewing.subject}</p>
            <p className="text-xs font-semibold mb-1" style={{ color:"#94A3B8" }}>MESSAGE</p>
            <p className="text-sm leading-relaxed" style={{ color:"#334155" }}>{viewing.message}</p>
          </div>
          {viewing.email && (
            <Field label="Reply">
              <Textarea rows={3} placeholder={`Write reply to ${viewing.name}…`}/>
            </Field>
          )}
          <div className="flex justify-end gap-2">
            <button onClick={()=>setViewing(null)} className="px-4 py-2 rounded-xl text-sm border" style={{ borderColor:C.border, color:"#64748B" }}>Close</button>
            {viewing.email && (
              <button onClick={()=>{ update({...viewing,status:"Replied"}); setViewing(null); }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white" style={{ background:C.primary }}>
                <Icon d={Icons.reply} size={14} className="text-white"/> Send Reply
              </button>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// ABOUT EDITOR
// ═══════════════════════════════════════════════════════════════════════════
const AboutSection = () => {
  const [data, setData] = useState(seed.about);
  const [saved, setSaved] = useState(false);
  const f = k => e => setData(p=>({...p,[k]:e.target.value}));
  const save = () => { setSaved(true); setTimeout(()=>setSaved(false),2500); };
  return (
    <div>
      <SHead title="About Page Editor" sub="Mission, vision, contact info & social links"/>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="rounded-2xl border p-5 bg-white" style={{ borderColor:C.border }}>
          <p className="text-xs font-semibold mb-4 tracking-widest" style={{ color:C.navy }}>CONTENT</p>
          <Field label="Mission Statement"><Textarea value={data.mission} onChange={f("mission")} rows={3}/></Field>
          <Field label="Vision"><Textarea value={data.vision} onChange={f("vision")} rows={3}/></Field>
          <Field label="History / Background"><Textarea value={data.history} onChange={f("history")} rows={4}/></Field>
        </div>
        <div className="space-y-5">
          <div className="rounded-2xl border p-5 bg-white" style={{ borderColor:C.border }}>
            <p className="text-xs font-semibold mb-4 tracking-widest" style={{ color:C.navy }}>CONTACT INFO</p>
            <Field label="Address"><Input value={data.address} onChange={f("address")}/></Field>
            <Field label="Email"><Input type="email" value={data.email} onChange={f("email")}/></Field>
            <Field label="Phone"><Input value={data.phone} onChange={f("phone")}/></Field>
          </div>
          <div className="rounded-2xl border p-5 bg-white" style={{ borderColor:C.border }}>
            <p className="text-xs font-semibold mb-4 tracking-widest" style={{ color:C.navy }}>SOCIAL LINKS</p>
            <Field label="Facebook"><Input value={data.facebook} onChange={f("facebook")} placeholder="https://facebook.com/…"/></Field>
            <Field label="Instagram"><Input value={data.instagram} onChange={f("instagram")} placeholder="https://instagram.com/…"/></Field>
          </div>
        </div>
      </div>
      <div className="flex justify-end mt-5">
        <button onClick={save} className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
          style={{ background: saved?"#059669":C.primary }}>
          {saved ? "✓ Saved!" : "Save Changes"}
        </button>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// OVERVIEW
// ═══════════════════════════════════════════════════════════════════════════
const OverviewSection = ({ setSection }) => {
  const stats = [
    { label:"Journals",       value:seed.journals.length,                                             icon:Icons.journals,   color:C.primary,   key:"journals"  },
    { label:"Announcements",  value:seed.announcements.length,                                        icon:Icons.announce,   color:C.purple,    key:"announcements" },
    { label:"Media Items",    value:seed.media.length,                                                icon:Icons.media,      color:C.navy,      key:"media"     },
    { label:"Heroes",         value:seed.heroes.length,                                               icon:Icons.heroes,     color:"#059669",   key:"heroes"    },
    { label:"Events",         value:seed.events.length,                                               icon:Icons.events,     color:"#F59E0B",   key:"events"    },
    { label:"Groups",         value:seed.groups.length,                                               icon:Icons.groups,     color:"#DC2626",   key:"groups"    },
    { label:"Resources",      value:seed.resources.length,                                            icon:Icons.resources,  color:"#0891B2",   key:"resources" },
    { label:"Unread Messages",value:seed.contacts.filter(x=>x.status==="Unread").length+seed.prayers.filter(x=>x.status==="Unread").length, icon:Icons.contact, color:C.purple, key:"contact" },
  ];
  const activity = [
    { action:"Prayer Request", detail:"Tendai Moyo submitted a new request", time:"1h ago",  color:"#DC2626" },
    { action:"Journal Published", detail:"Faith and Science: Finding Harmony", time:"2h ago", color:C.primary },
    { action:"New Message",    detail:"John Doe — Event Collaboration",       time:"5h ago", color:C.purple  },
    { action:"Event Created",  detail:"Vespers Night – Mar 13, 2026",         time:"1d ago", color:"#059669" },
    { action:"Hero Added",     detail:"Choolwe Sitima – Choir Director",      time:"2d ago", color:"#F59E0B" },
    { action:"Resource Added", detail:"Academic Year Planner (PDF)",          time:"3d ago", color:"#0891B2" },
  ];
  return (
    <div>
      <div className="mb-6">
        <h2 style={{ fontFamily:"'Playfair Display',serif", color:C.navy, fontSize:24, fontWeight:700 }}>Welcome back, Admin</h2>
        <p className="text-sm mt-0.5" style={{ color:"#64748B" }}>Here's what's happening with your MU PCM portal today.</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {stats.map(s=>(
          <div key={s.key} onClick={()=>setSection(s.key)}
            className="rounded-2xl p-4 cursor-pointer hover:shadow-md transition-all group bg-white"
            style={{ border:`1px solid ${C.border}` }}>
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background:s.color+"18" }}>
                <Icon d={s.icon} size={18} style={{ color:s.color }}/>
              </div>
              <span className="text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity" style={{ color:s.color }}>→</span>
            </div>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:26, fontWeight:700, color:C.navy }}>{s.value}</div>
            <div className="text-xs mt-0.5" style={{ color:"#64748B" }}>{s.label}</div>
          </div>
        ))}
      </div>
      <div className="rounded-2xl border p-5 bg-white" style={{ borderColor:C.border }}>
        <h3 style={{ fontFamily:"'Playfair Display',serif", color:C.navy, fontSize:16, fontWeight:700, marginBottom:14 }}>Recent Activity</h3>
        {activity.map((a,i)=>(
          <div key={i} className="flex items-start gap-3 py-2.5 border-b last:border-0" style={{ borderColor:"#F1F5F9" }}>
            <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background:a.color }}/>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold" style={{ color:C.navy }}>{a.action}</p>
              <p className="text-xs truncate" style={{ color:"#64748B" }}>{a.detail}</p>
            </div>
            <span className="text-xs flex-shrink-0" style={{ color:"#94A3B8" }}>{a.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// ROOT
// ═══════════════════════════════════════════════════════════════════════════
export default function AdminDashboard() {
  const [section, setSection] = useState("overview");
  const [open, setOpen] = useState(true);

  const nav = [
    { key:"overview",      label:"Overview",         icon:Icons.dashboard  },
    { key:"announcements", label:"Announcements",    icon:Icons.announce   },
    { key:"events",        label:"Events",           icon:Icons.events     },
    { key:"journals",      label:"Journals",         icon:Icons.journals   },
    { key:"media",         label:"Media",            icon:Icons.media      },
    { key:"heroes",        label:"Heroes",           icon:Icons.heroes     },
    { key:"groups",        label:"Groups",           icon:Icons.groups,    divider:true },
    { key:"resources",     label:"Resources",        icon:Icons.resources  },
    { key:"prayer",        label:"Prayer Requests",  icon:Icons.prayer,    badge:seed.prayers.filter(x=>x.status==="Unread").length },
    { key:"contact",       label:"Contact Inbox",    icon:Icons.contact,   badge:seed.contacts.filter(x=>x.status==="Unread").length, divider:true },
    { key:"about",         label:"About Editor",     icon:Icons.about      },
  ];

  const sectionMap = {
    overview:<OverviewSection setSection={setSection}/>, announcements:<AnnouncementsSection/>,
    events:<EventsSection/>, journals:<JournalsSection/>, media:<MediaSection/>,
    heroes:<HeroesSection/>, groups:<GroupsSection/>, resources:<ResourcesSection/>,
    prayer:<PrayerSection/>, contact:<ContactSection/>, about:<AboutSection/>,
  };
  const current = nav.find(n=>n.key===section);

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Noto+Sans:wght@400;500;600;700&display=swap" rel="stylesheet"/>
      <div className="flex h-screen overflow-hidden" style={{ background:C.white, fontFamily:"'Noto Sans',sans-serif" }}>

        {/* ── Sidebar ── */}
        <aside className="flex-shrink-0 flex flex-col" style={{ width:open?224:60, background:C.navy, transition:"width 0.22s ease" }}>
          {/* Logo */}
          <div className="flex items-center gap-2.5 px-3.5 py-4 border-b" style={{ borderColor:"rgba(255,255,255,0.07)" }}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background:C.primary }}>
              <span style={{ fontFamily:"'Playfair Display',serif", color:"white", fontSize:13, fontWeight:700 }}>M</span>
            </div>
            {open && <div className="flex-1 min-w-0">
              <div style={{ fontFamily:"'Playfair Display',serif", color:"white", fontSize:13, fontWeight:700 }}>MU PCM</div>
              <div style={{ color:"rgba(255,255,255,0.38)", fontSize:9, letterSpacing:"0.08em" }}>ADMIN PORTAL</div>
            </div>}
            <button onClick={()=>setOpen(p=>!p)} className="p-1 rounded hover:bg-white/10 transition-colors flex-shrink-0">
              <Icon d={open?Icons.chevronL:Icons.chevronR} size={15} className="text-white/40"/>
            </button>
          </div>

          {/* Nav */}
          <nav className="flex-1 py-2 overflow-y-auto overflow-x-hidden">
            {nav.map(item=>{
              const active = section===item.key;
              return (
                <div key={item.key}>
                  {item.divider && <div className="my-1.5 mx-3 border-t" style={{ borderColor:"rgba(255,255,255,0.07)" }}/>}
                  <button onClick={()=>setSection(item.key)}
                    className="w-full flex items-center gap-2.5 px-3 py-2 transition-all relative text-left"
                    style={{ color:active?"white":"rgba(255,255,255,0.46)" }}>
                    {active && <div className="absolute left-0 top-1 bottom-1 w-0.5 rounded-r" style={{ background:C.primary }}/>}
                    <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg transition-colors"
                      style={{ background:active?C.primary+"30":"transparent" }}>
                      <Icon d={item.icon} size={15}/>
                    </div>
                    {open && (
                      <div className="flex-1 flex items-center justify-between min-w-0">
                        <span className="text-sm font-medium truncate">{item.label}</span>
                        {item.badge>0 && (
                          <span className="w-4 h-4 rounded-full text-xs flex items-center justify-center flex-shrink-0 ml-1"
                            style={{ background:"#EF4444", color:"white", fontSize:9, fontWeight:700 }}>
                            {item.badge}
                          </span>
                        )}
                      </div>
                    )}
                    {!open && item.badge>0 && (
                      <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ background:"#EF4444" }}/>
                    )}
                  </button>
                </div>
              );
            })}
          </nav>

          {/* User */}
          <div className="px-3 py-3.5 border-t" style={{ borderColor:"rgba(255,255,255,0.07)" }}>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background:C.primary }}>
                <span style={{ color:"white", fontSize:12, fontWeight:700 }}>A</span>
              </div>
              {open && <>
                <div className="flex-1 min-w-0">
                  <div style={{ color:"white", fontSize:11, fontWeight:600 }}>Administrator</div>
                  <div style={{ color:"rgba(255,255,255,0.35)", fontSize:10 }}>PCM Admin</div>
                </div>
                <button className="p-1 rounded hover:bg-white/10 transition-colors">
                  <Icon d={Icons.logout} size={13} className="text-white/35"/>
                </button>
              </>}
            </div>
          </div>
        </aside>

        {/* ── Main ── */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="flex-shrink-0 flex items-center justify-between px-6 py-3 border-b bg-white" style={{ borderColor:C.border }}>
            <div className="flex items-center gap-2">
              {current && <Icon d={current.icon} size={15} className="text-blue-600"/>}
              <span style={{ fontFamily:"'Playfair Display',serif", color:C.navy, fontSize:15, fontWeight:700 }}>{current?.label}</span>
            </div>
            <div className="flex items-center gap-3">
              {(seed.prayers.some(x=>x.status==="Unread")||seed.contacts.some(x=>x.status==="Unread")) && (
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ background:"#EF4444" }}/>
                  <span className="text-xs" style={{ color:"#EF4444" }}>
                    {seed.prayers.filter(x=>x.status==="Unread").length+seed.contacts.filter(x=>x.status==="Unread").length} unread
                  </span>
                </div>
              )}
              <span className="text-xs" style={{ color:"#94A3B8" }}>mupcm.vercel.app</span>
            </div>
          </header>
          <div className="flex-1 overflow-y-auto px-6 py-6">{sectionMap[section]}</div>
        </div>
      </div>
    </>
  );
}