import { refs, projectBindings, validateScope } from './core.mjs';
export function captureSQL(kind, ref, fixtures = {}) {
    if (!Object.values(refs).includes(ref))
        throw Error('Unknown project');
    validateScope(fixtures);
    const binding = projectBindings[ref];
    if (!binding || !/^[0-9]+$/.test(binding.system_identifier) || binding.database !== 'postgres')
        throw Error('Unknown database binding');
    const wrapper = sql => `BEGIN TRANSACTION READ ONLY;\nSET LOCAL statement_timeout='30s';\nDO $mm_identity$ BEGIN IF current_database() <> 'postgres' OR (SELECT system_identifier::text FROM pg_control_system()) IS DISTINCT FROM '${binding.system_identifier}' THEN RAISE EXCEPTION 'Database identity mismatch; stop without capturing'; END IF; END; $mm_identity$;\nSELECT jsonb_build_object('format',1,'kind','${kind}','project_ref','${ref}','captured_at',now(),'database_identity',jsonb_build_object('database',current_database(),'system_identifier',(select system_identifier::text from pg_control_system())),'scope',${scope},'data',(${sql})) AS snapshot;\nROLLBACK;`;
    for (const key of Object.keys(fixtures)) {
        if (!['courses', 'modules', 'lessons', 'questions'].includes(key) || !Array.isArray(fixtures[key]) || fixtures[key].some(id => !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)))
            throw Error('Invalid fixture IDs');
    }
    const scope = "'" + JSON.stringify(fixtures).replaceAll("'", "''") + "'::jsonb";
    if (kind === 'metadata')
        return wrapper(`SELECT jsonb_build_object(
 'columns',(select jsonb_agg(jsonb_build_object('table',table_name,'column',column_name,'type',udt_name,'nullable',is_nullable,'default',column_default)) from information_schema.columns where table_schema='public'),
 'constraints',(select jsonb_agg(jsonb_build_object('table',c.conrelid::regclass::text,'name',conname,'definition',pg_get_constraintdef(c.oid))) from pg_constraint c join pg_namespace n on n.oid=c.connamespace where n.nspname='public'),
 'policies',(select jsonb_agg(to_jsonb(p)) from pg_policies p where schemaname in ('public','storage')),
 'triggers',(select jsonb_agg(jsonb_build_object('table',c.relname,'definition',pg_get_triggerdef(t.oid))) from pg_trigger t join pg_class c on c.oid=t.tgrelid join pg_namespace n on n.oid=c.relnamespace where not t.tgisinternal and n.nspname in ('public','auth')),
 'functions',(select jsonb_agg(jsonb_build_object('identity',format('%I.%I(%s)',n.nspname,p.proname,replace(oidvectortypes(p.proargtypes),', ',',')),'definition',pg_get_functiondef(p.oid),'acl',p.proacl::text,'owner',pg_get_userbyid(p.proowner))) from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname='public'),
 'effective',(select jsonb_agg(jsonb_build_object('identity',format('%I.%I(%s)',n.nspname,p.proname,replace(oidvectortypes(p.proargtypes),', ',',')),'anon',has_function_privilege('anon',p.oid,'EXECUTE'),'authenticated',has_function_privilege('authenticated',p.oid,'EXECUTE'))) from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname='public'),
 'table_grants',(select jsonb_agg(to_jsonb(t)) from information_schema.role_table_grants t where table_schema='public'),
 'rls',(select jsonb_agg(jsonb_build_object('table',c.relname,'enabled',c.relrowsecurity,'forced',c.relforcerowsecurity)) from pg_class c join pg_namespace n on n.oid=c.relnamespace where n.nspname='public' and c.relkind='r'),
 'buckets',(select jsonb_agg(jsonb_build_object('name',name,'public',public,'file_size_limit',file_size_limit,'allowed_mime_types',allowed_mime_types)) from storage.buckets))`);
    if (kind !== 'baseline')
        throw Error('Unknown capture kind');
    const branch = (table, excluded) => { const ids = fixtures[table] || []; const pred = ids.length ? `id ${excluded ? '=' : '<>'} ALL(ARRAY[${ids.map(id => "'" + id + "'").join(',')}]::uuid[])` : excluded ? 'false' : 'true'; return `SELECT '${table}' as entity,count(*) as rows,md5(coalesce(string_agg(md5(to_jsonb(c)::text),'' order by id),'')) as digest FROM public.${table} c WHERE ${pred}`; };
    // Excluded records use ANY, so multiple approved fixture IDs are classified correctly.
    const content = ['courses', 'modules', 'lessons', 'questions'].map(t => branch(t, false)).join(' UNION ALL '), excluded = ['courses', 'modules', 'lessons', 'questions'].map(t => branch(t, true).replace('= ALL', '= ANY')).join(' UNION ALL ');
    return wrapper(`SELECT jsonb_build_object('content',(select jsonb_agg(x) from (${content}) x),'excluded',(select jsonb_agg(x) from (${excluded}) x),
 'storage',(select coalesce(jsonb_agg(x),'[]'::jsonb) from (select b.id as entity,count(o.id) as rows,md5(coalesce(string_agg(md5(o.name||coalesce(o.metadata::text,'')),'' order by o.name),'')) as digest from storage.buckets b left join storage.objects o on o.bucket_id=b.id group by b.id) x),
 'missing_refs',jsonb_build_object(
 'questions',(select count(*) from questions q where nullif(image_path,'') is not null and not exists(select 1 from storage.objects o where o.bucket_id='question-images' and o.name=q.image_path)),
 'notes',(select count(*) from lessons l where nullif(notes_image_path,'') is not null and not exists(select 1 from storage.objects o where o.bucket_id='lesson-images' and o.name=l.notes_image_path)),
 'examples',(select count(*) from lessons l where nullif(example_image_path,'') is not null and not exists(select 1 from storage.objects o where o.bucket_id='lesson-images' and o.name=l.example_image_path)),
 'resources',(select count(*) from lessons l cross join lateral jsonb_array_elements(coalesce(l.resources,'[]'::jsonb)) r where nullif(r->>'path','') is not null and not exists(select 1 from storage.objects o where o.bucket_id='lesson-resources' and o.name=r->>'path'))))`);
}
