import {mkdirSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
process.chdir(root);
process.env.CLOUDFLARE_CF_FETCH_ENABLED??='false';
process.env.WRANGLER_SEND_METRICS??='false';
process.env.WRANGLER_WRITE_LOGS??='false';
for(const [key,relative] of Object.entries({WRANGLER_LOG_PATH:'.wrangler/logs',WRANGLER_REGISTRY_PATH:'.wrangler/dev-registry',MINIFLARE_REGISTRY_PATH:'.wrangler/registry'})){
 process.env[key]??=path.join(root,relative);
 mkdirSync(process.env[key],{recursive:true});
}
