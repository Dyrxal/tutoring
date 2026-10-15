-- Run once in the existing Supabase project. Images remain in a private bucket.
alter table public.questions add column if not exists image_path text;
alter table public.questions add column if not exists image_alt text not null default '';

insert into storage.buckets (id,name,public,file_size_limit,allowed_mime_types)
values ('question-images','question-images',false,8388608,array['image/png','image/jpeg','image/webp'])
on conflict (id) do update set public=false,file_size_limit=8388608,allowed_mime_types=array['image/png','image/jpeg','image/webp'];

create policy question_image_read on storage.objects for select to authenticated
using (bucket_id='question-images' and exists (
  select 1 from public.questions q
  where q.id=split_part(name,'/',1)::uuid and public.can_read_lesson(q.lesson_id)
));
create policy question_image_upload on storage.objects for insert to authenticated
with check (bucket_id='question-images' and public.is_tutor() and exists (
  select 1 from public.questions q where q.id=split_part(name,'/',1)::uuid
));
create policy question_image_delete on storage.objects for delete to authenticated
using (bucket_id='question-images' and public.is_tutor());
