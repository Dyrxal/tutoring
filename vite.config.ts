import vinext from "vinext";
import {defineConfig,loadEnv} from "vite";
import {resolveBackendConfig} from "./lib/backend-config";
import previewPublic from "./config/preview-public.json";

export default defineConfig(async ({mode})=>{
 const backend=resolveBackendConfig({...previewPublic,...loadEnv(mode,process.cwd(),""),...process.env});
 process.env.CLOUDFLARE_CF_FETCH_ENABLED??="false";
 process.env.WRANGLER_SEND_METRICS??="false";
 process.env.WRANGLER_WRITE_LOGS??="false";
 process.env.WRANGLER_LOG_PATH??=".wrangler/logs";
 process.env.WRANGLER_REGISTRY_PATH??=".wrangler/dev-registry";
 process.env.MINIFLARE_REGISTRY_PATH??=".wrangler/registry";
 const {cloudflare}=await import("@cloudflare/vite-plugin");
 return {
  define:{
   "process.env.NEXT_PUBLIC_LMS_TARGET":JSON.stringify(backend.target),
   "process.env.NEXT_PUBLIC_SUPABASE_URL":JSON.stringify(backend.url),
   "process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY":JSON.stringify(backend.publicKey),
  },
  plugins:[vinext(),cloudflare({viteEnvironment:{name:"rsc",childEnvironments:["ssr"]},inspectorPort:false})],
 };
});
