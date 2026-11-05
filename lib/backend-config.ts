export type BackendConfig = {target:'preview'|'production';url:string;publicKey:string};
const PRODUCTION_REF='lmuwsjjrqmmmtmxjvqln';

/** Build-time backend selection. A preview never falls back to live credentials. */
export function resolveBackendConfig(env:Record<string,string|undefined>):BackendConfig {
 const target=env.NEXT_PUBLIC_LMS_TARGET||'preview';
 if(target!=='preview'&&target!=='production')throw new Error('LMS target must be preview or production.');
 if(env.NEXT_PUBLIC_DESIGN_PREVIEW==='true'&&target==='production')throw new Error('A preview build cannot select production.');
 const prefix=target==='preview'?'NEXT_PUBLIC_PREVIEW_SUPABASE_':'NEXT_PUBLIC_SUPABASE_';
 const input=env[prefix+'URL']?.trim(),publicKey=env[prefix+'ANON_KEY']?.trim();
 if(!input||!publicKey)throw new Error(`Missing ${target} backend configuration: provide ${prefix}URL and ${prefix}ANON_KEY.`);
 let url:URL;
 try{url=new URL(input);}catch{throw new Error('Supabase URL is invalid.');}
 if(url.protocol!=='https:'||url.username||url.password||url.port||url.search||url.hash||!['','/'].includes(url.pathname)||!/^([a-z0-9]+)\.supabase\.co$/.test(url.hostname))throw new Error('Use a plain HTTPS Supabase project URL without credentials or paths.');
 const ref=url.hostname.split('.')[0];
 if(target==='preview'&&ref===PRODUCTION_REF)throw new Error('The production project cannot be used for a preview.');
 if(target==='production'&&ref!==PRODUCTION_REF)throw new Error('Production configuration must select the established production project.');
 if(!publicKey.startsWith('sb_publishable_')){
  let payload:{role?:string;ref?:string}|undefined;
  try{payload=JSON.parse(Buffer.from(publicKey.split('.')[1]||'','base64url').toString('utf8'));}catch{}
  if(payload?.role!=='anon')throw new Error('Only a publishable key or legacy anon key may be bundled.');
  if(payload.ref!==ref)throw new Error('Legacy anon key must match the selected project.');
 }
 return {target,url:url.origin,publicKey};
}
