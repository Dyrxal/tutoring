-- Private images for lesson notes and worked examples.
alter table public.lessons add column if not exists notes_image_path text;
alter table public.lessons add column if not exists notes_image_alt text not null default '';
alter table public.lessons add column if not exists example_image_path text;
alter table public.lessons add column if not exists example_image_alt text not null default '';

insert into storage.buckets (id,name,public,file_size_limit,allowed_mime_types)
values ('lesson-images','lesson-images',false,8388608,array['image/png','image/jpeg','image/webp'])
on conflict (id) do update set public=false,file_size_limit=8388608,allowed_mime_types=array['image/png','image/jpeg','image/webp'];

create policy lesson_images_read on storage.objects for select to authenticated
using (bucket_id='lesson-images' and exists (
 select 1 from public.lessons l where l.id=split_part(name,'/',1)::uuid and public.can_read_lesson(l.id)
));
create policy lesson_images_upload on storage.objects for insert to authenticated
with check (bucket_id='lesson-images' and public.is_tutor() and exists (
 select 1 from public.lessons l where l.id=split_part(name,'/',1)::uuid
));
create policy lesson_images_delete on storage.objects for delete to authenticated
using (bucket_id='lesson-images' and public.is_tutor());
