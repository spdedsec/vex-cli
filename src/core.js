import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

export const now = () => new Date().toISOString();
export const id = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
export const clamp = (n, min = 0, max = 100) => Math.max(min, Math.min(max, Number(n) || 0));
export const dateOnly = (d = new Date()) => d.toISOString().slice(0, 10);
export const daysBetween = (a, b) => Math.round((new Date(b) - new Date(a)) / 86400000);
export const titleCase = s => s.replace(/\w\S*/g, x => x[0].toUpperCase() + x.slice(1).toLowerCase());
export const seed = () => ({ version: 1, createdAt: now(), subjects: [], topics: [], sessions: [], mistakes: [], inbox: [], settings: { theme: 'midnight', animations: true } });
export function createStore(root) { const dbPath = path.join(root, 'data.json'); const notes = path.join(root, 'notes'); return { root, dbPath, notes }; }
export function ensure(store) { fs.mkdirSync(store.root, { recursive: true }); fs.mkdirSync(store.notes, { recursive: true }); if (!fs.existsSync(store.dbPath)) fs.writeFileSync(store.dbPath, JSON.stringify(seed(), null, 2) + '\n'); }
export function load(store) { ensure(store); return JSON.parse(fs.readFileSync(store.dbPath, 'utf8')); }
export function save(store, db) { fs.writeFileSync(store.dbPath, JSON.stringify(db, null, 2) + '\n'); }
export function getSubject(db, name) { return db.subjects.find(s => s.name.toLowerCase() === name.toLowerCase()); }
export function topicBy(db, query = '') { const q = query.toLowerCase(); return db.topics.find(t => t.id === query || t.title.toLowerCase() === q || t.title.toLowerCase().includes(q)); }
export function topicSubject(db, t) { return db.subjects.find(s => s.id === t.subjectId)?.name ?? 'Unassigned'; }
export function average(values) { return values.length ? Math.round(values.reduce((a,b) => a + b, 0) / values.length) : 0; }
export function subjectProgress(db, subject) { return average(db.topics.filter(t => t.subjectId === subject.id).map(t => t.completion)); }
export function dueStatus(t) { const due = t.nextReview ? daysBetween(dateOnly(), t.nextReview) : 999; if (due <= 0) return ['Due today', 'red']; if (due === 1) return ['Due tomorrow', 'yellow']; return [`Due in ${due} days`, 'green']; }
export function writeNote(store, title, subject, chapter, completion) { const filename = `${title.replace(/[^a-z0-9]+/gi, '_')}.md`; fs.writeFileSync(path.join(store.notes, filename), `# ${title}\n\n- Subject: ${subject}\n- Chapter: ${chapter}\n- Completion: ${completion}%\n\n## Notes\n\n`); }
export function git(args, cwd = process.cwd(), quiet = false) { try { return execFileSync('git', args, { cwd, encoding:'utf8', stdio: quiet ? ['ignore','pipe','pipe'] : 'pipe' }); } catch (e) { return e.stdout || e.stderr || e.message; } }
export function gitSetup(url, cwd = process.cwd()) { git(['init'], cwd); git(['remote','remove','origin'], cwd, true); git(['remote','add','origin',url], cwd); git(['add','.'], cwd); const commit = git(['commit','-m','Initialize VEX study data'], cwd); return { commit, message: 'GitHub remote configured.' }; }
export function gitStatus(cwd = process.cwd()) { return { files: git(['status','--short'], cwd), remote: git(['remote','-v'], cwd).split('\n')[0] || 'not configured' }; }
export function gitPull(cwd = process.cwd()) { return git(['pull','--rebase','origin','main'], cwd); }
export function gitPush(cwd = process.cwd()) { return git(['add','.'], cwd) + git(['commit','-m',`study: update ${dateOnly()}`], cwd) + git(['push','-u','origin','main'], cwd); }
