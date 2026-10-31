// Optional real PostgreSQL-engine check: install @electric-sql/pglite in a temporary
// directory and set STUDENT_THEME_PGLITE_MODULE to its dist/index.js absolute path.
// Uses an isolated in-memory database, never a Supabase endpoint or real records.
import fs from 'node:fs';
import assert from 'node:assert/strict';
const {PGlite}=await import(process.env.STUDENT_THEME_PGLITE_MODULE || '@electric-sql/pglite');
const db=new PGlite();
const a='00000000-0000-0000-0000-000000000001',b='00000000-0000-0000-0000-000000000002',t='00000000-0000-0000-0000-000000000003',missing='00000000-0000-0000-0000-000000000004';
await db.exec(`
 create role anon; create role authenticated;
 create schema auth;
 create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;
 grant usage on schema public,auth to authenticated,anon;
 create table public.profiles(id uuid primary key,role text not null,full_name text not null default '');
 alter table public.profiles enable row level security;
 create policy profiles_read on public.profiles for select to authenticated using(id=auth.uid());
 create policy profiles_update_own on public.profiles for update to authenticated using(id=auth.uid() and role='student') with check(id=auth.uid() and role='student');
 grant select on public.profiles to authenticated;
 grant update(full_name) on public.profiles to authenticated;
 insert into public.profiles(id,role) values ('${a}','student'),('${b}','student'),('${t}','tutor');
`);
const privileges=()=>db.query("select grantee,column_name,privilege_type from information_schema.column_privileges where table_schema='public' and table_name='profiles' and grantee='authenticated' and privilege_type='UPDATE' order by column_name");
const before=(await privileges()).rows;
const sql=fs.readFileSync('supabase/migrations/20261029_student_theme.sql','utf8');
await db.exec(sql);await db.exec(sql);
assert.deepEqual((await privileges()).rows,before,'migration preserves column update grants');
assert.equal((await db.query("select count(*)::integer n from public.profiles where student_theme is null")).rows[0].n,3);
assert.equal((await db.query("select count(*)::integer n from pg_policies where schemaname='public' and tablename='profiles'")).rows[0].n,2);
async function actor(id,role='authenticated') {await db.exec(`reset role;set role ${role};select set_config('request.jwt.claim.sub','${id??''}',false)`)}
const rpc=async(expression)=>(await db.query(`select ${expression} result`)).rows[0].result;
await actor(a);assert.deepEqual(await rpc('public.get_student_theme()'),{theme:null});
assert.deepEqual(await rpc("public.save_student_theme('midnight')"),{theme:'midnight'});
assert.deepEqual(await rpc('public.get_student_theme()'),{theme:'midnight'});
await assert.rejects(db.query("select public.save_student_theme('dark')"),e=>e.code==='22023');
await assert.rejects(db.query('select public.save_student_theme(null)'),e=>e.code==='22023');
await assert.rejects(db.query("update public.profiles set student_theme='light'"),e=>e.code==='42501');
await assert.rejects(db.query("update public.profiles set role='tutor'"),e=>e.code==='42501');
await db.query("update public.profiles set full_name='Synthetic student' where id=auth.uid()");
await actor(b);assert.deepEqual(await rpc('public.get_student_theme()'),{theme:null});assert.deepEqual(await rpc("public.save_student_theme('light')"),{theme:'light'});
await actor(a);assert.deepEqual(await rpc('public.get_student_theme()'),{theme:'midnight'});
for(const id of [t,missing,null]){await actor(id);await assert.rejects(db.query('select public.get_student_theme()'),e=>e.code==='42501');await assert.rejects(db.query("select public.save_student_theme('light')"),e=>e.code==='42501')}
await actor(a,'anon');await assert.rejects(db.query('select public.get_student_theme()'),e=>e.code==='42501');await assert.rejects(db.query("select public.save_student_theme('light')"),e=>e.code==='42501');
await db.exec('reset role');
await assert.rejects(db.query("update public.profiles set student_theme='dark'"),e=>e.code==='23514');
for(const name of ['get_student_theme','save_student_theme']){
 const row=(await db.query(`select proconfig from pg_proc where pronamespace='public'::regnamespace and proname='${name}'`)).rows[0];assert.deepEqual(row.proconfig,['search_path=""']);
}
await db.close();
console.log('PASS: in-memory PostgreSQL migration twice; constraints, self/student/anonymous checks, account isolation, profile grants and safe search paths. No staging/live writes.');
