# Resend sending-domain DNS proposal — not applied

Domain: auth.notationeducation.online. User supplied the following public DNS values after adding the domain to their Resend account. These are proposed email-verification additions, not website routing changes. No DNS mutations or broad OAuth connection are authorized/executed at this stage. Owner Cloudflare screenshot shows 2 of 2 zone records, an apex Worker and a www CNAME; no proposed email names exist. Conflict check passed against that screenshot; local dig/nslookup and DNS Python library are unavailable, and no authenticated Cloudflare DNS interface is configured.

Zone: notationeducation.online. Cloudflare names below are relative to that zone. TTL Auto for all three; both CNAMEs must be DNS only (not proxied).

| Type | Name | Content / target |
|---|---|---|
| TXT | resend._domainkey.auth | p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDjw3/Rqlj16sPl7GOl3i9nx96UbUed9M+4ok40xeD1wrHnCn2N+5CnUVCaxmvLLquKkam0kgS/xLeaOdANl1vUJIIFAyy9PhpTnZgDVlY2Z56AStduGDgoU7u2mSmioP6lDiEcBCYADHuTWXnmeU5ArRJ31O31XMvcD5K4fZoqdQIDAQAB |
| CNAME | rsend.auth | rsend-apne1.forge.rmta.net |
| CNAME | send.auth | send.forge.rmta.net |

Preserve `rsend.auth` exactly as supplied; do not silently substitute `resend.auth`. DKIM TXT is a public key, not an API/SMTP secret. Do not invent or shorten values. Keep receiving disabled. Do not add or overwrite the optional root _dmarc record or existing SPF/MX/website records.

Owner screenshot confirms zone notationeducation.online and all 2 existing records; none matches resend._domainkey.auth, rsend.auth or send.auth. Recheck if DNS changes before execution. Do not overwrite any collision. Once specifically approved, add only missing exact records, record their IDs/original state, then ask Resend to verify. Remove only records created by this change if rollback is needed, and only if no other sender has begun depending on them.

Actual verified sending status, SMTP key/configuration, production callback settings and sender tests remain pending. Manual SMTP avoids granting Resend broad Supabase OAuth access. Production email requests and any production settings/DNS changes remain in the explicit final approval gate; DNS values alone do not grant that approval.

## Approval boundary

Conflict check is now complete; DNS additions remain unapplied. Original migration instructions require final approval before DNS changes. Any earlier email-verification setup needs an explicit exception limited to these three additions; this must not be interpreted as approval for website changes, production SMTP/DB writes, merging or deployment. The apex Worker record and www CNAME remain untouched. Cloudflare's root-MX warning is not a reason to enable receiving or add root MX/DMARC records to this sending-only setup. The www target is truncated in the screenshot; validate full www routing/redirect behavior before final website launch.
