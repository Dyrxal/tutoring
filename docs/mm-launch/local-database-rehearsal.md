# Repeatable local database rehearsal

This is an integration test of the committed SQL and recovery mechanics. It accepts no database URL, production credential or hosted preview data. Run on Linux with Node and the existing local Docker socket, from the review checkout root.

```sh
env -u DOCKER_HOST -u DOCKER_CONTEXT -u DOCKER_TLS -u DOCKER_TLS_VERIFY -u DOCKER_CERT_PATH docker --host=unix:///var/run/docker.sock pull postgres@sha256:665dc7b37ac52a17e298511414c21d23ffa4e6a6ef6225b3e5d59c7afb35e994
mkdir -p /workspace/work/mm-rehearsal
pnpm test:database-local --out /workspace/work/mm-rehearsal/new-result.json
```

Use a new output filename; existing evidence/public asset output paths and unsupported flags fail before containers are created. The runner does not automatically pull images. It fixes the Docker endpoint to `/var/run/docker.sock`, clears remote endpoint/TLS selectors, and creates two randomly named labelled containers with **network none, no published ports and no mounted input directories**. Only containers created and owned by that run are removed. No production password or key is required. Local trust authentication is confined to the isolated containers.

The runner uses the committed preview bootstrap/seed against a fresh local synthetic database, with minimal Auth/Storage schema stubs and four synthetic identities at `synthetic.invalid`. It exercises original, exact prepared-forward and restored permission states; anonymous/unenrolled restrictions; actor/role/enrolment escalation; direct review writes; tutor edit availability; expected missing-schedule SQLSTATEs; exact guarded rollback and drift rejection; local role/schema/data dumps and restored schema/count/digest equality; trigger replay; and separate synthetic object-byte checksums/corruption detection.

[Recorded result](../mm-acceptance/local-database-rehearsal.json): **37 passing, 0 failing**. The JSON includes source-file SHA-256 values, image digest, cleanup outcome and limitations. Its repository_head is the starting checkout at the time of the exercise; source hashes identify the exact tested inputs subsequently committed in candidate `f21dabf2e021a0dcef439bc1329bb51ebc043081`. Three ordinary unit tests cover refusal of remote arguments, evidence overwrite and public-output paths without requiring Docker. The full unit suite passes 144 tests.

Harness corrections discovered during preparation: a fresh target must retain its standard public schema because pg_dump expects it, and readiness must wait for the entrypoint's final Postgres process rather than its temporary initdb server. Neither correction changes the application or weakens its assertions. The normal-trigger restore is a deliberate failing control and must remain failing/transactionally rolled back; success there would invalidate that test's fixture assumption.

This raw-pg_dump exercise includes complete synthetic Auth/Storage stubs, unlike the Supabase CLI's managed-schema filtering. It does **not** verify real dump completeness, managed service reconstruction, real password sign-in, live email, real object decoding, encryption/vault recovery or production restore. Do not apply these stubs to any real Supabase project. Use [the separate manual backup procedure](manual-backup-plan.md) and [managed customization inventory](managed-recovery-inventory.json) only within a later specifically approved recovery scope. Real backup and restore gates remain blocked.
