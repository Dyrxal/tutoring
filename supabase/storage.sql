-- Run once in the Supabase SQL editor after schema.sql.
-- Private lesson resource bucket. Documents are accessible only to tutors and enrolled students.
insert into storage.buckets (id,name,public,file_size_limit,allowed_mime_types)
values ('lesson-resources','lesson-resources',false,20971520,array['application/pdf'])
on conflict (id) do update set public=false,file_size_limit=excluded.file_size_limit,allowed_mime_types=excluded.allowed_mime_types;
-- Object names follow <lesson UUID>/<random UUID>-<filename>.
create policy lesson_resource_read on storage.objects for select to authenticated
using(bucket_id='lesson-resources' and public.can_read_lesson((split_part(name,'/',1))::uuid));
create policy lesson_resource_upload on storage.objects for insert to authenticated
with check(bucket_id='lesson-resources' and public.is_tutor() and public.can_read_lesson((split_part(name,'/',1))::uuid));
create policy lesson_resource_delete on storage.objects for delete to authenticated
using(bucket_id='lesson-resources' and public.is_tutor());
