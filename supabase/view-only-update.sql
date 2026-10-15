-- Run if the earlier storage.sql was already applied. This limits future uploads to PDF.
update storage.buckets set public=false,allowed_mime_types=array['application/pdf'],file_size_limit=20971520 where id='lesson-resources';
-- Existing external links and non-PDF files must be replaced manually with PDFs.
