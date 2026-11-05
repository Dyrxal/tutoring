// Optional browser acceptance: requires Playwright available to Node (e.g. NODE_PATH).
// MM_TEST_ACCOUNTS points to an untracked JSON array of {email,password} fixtures.
const {chromium,devices}=require('playwright');
const fs=require('node:fs');
const assert=require('node:assert/strict');
const base=process.env.MM_PREVIEW_URL||'https://feat-mm-cloudflare-migration-notation-education-lms.drisyantshrestha.workers.dev/';
const host=new URL(base).hostname;
assert(['127.0.0.1','localhost','feat-mm-cloudflare-migration-notation-education-lms.drisyantshrestha.workers.dev'].includes(host),'Only local or MM branch preview is allowed');
const account=JSON.parse(fs.readFileSync(process.env.MM_TEST_ACCOUNTS,'utf8'))[0];
const expectedVersion=JSON.parse(fs.readFileSync(require.resolve('pdfjs-dist/package.json'),'utf8')).version;
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,...(process.env.HTTPS_PROXY?{proxy:{server:process.env.HTTPS_PROXY,bypass:'127.0.0.1,localhost'}}:{}),args:['--no-sandbox']});
 const results=[];
 try{
  for(const viewport of [{width:1440,height:1000},{width:390,height:844}]){
   const context=await browser.newContext({...((viewport.width<600)?devices['Pixel 5']:{}),viewport});
   const page=await context.newPage();const workers=[],errors=[];
   page.on('worker',w=>workers.push(w.url()));page.on('pageerror',e=>errors.push(e.message));
   await page.route('**/*',route=>{
    const u=new URL(route.request().url());
    if(['http:','https:'].includes(u.protocol)&&![new URL(base).host,'lcddnpafrkbwsrhqexqe.supabase.co'].includes(u.host))return route.abort('blockedbyclient');
    return route.continue();
   });
   await page.goto(base);
   await page.waitForFunction(()=>{const f=document.querySelector('form');return f&&Object.keys(f).some(k=>k.startsWith('__reactProps$'))},{},{timeout:60000});
   await page.getByLabel('Email',{exact:true}).fill(account.email);
   await page.getByLabel('Password',{exact:true}).fill(account.password);
   await page.getByRole('button',{name:'Sign in',exact:true}).click();
   for(const phase of ['after-sign-in','after-reload']){
    workers.length=0;
    if(phase==='after-reload')await page.reload();
    await page.getByText('MM Preview Mathematics',{exact:false}).first().waitFor({timeout:60000});
    await page.locator('.student-dashboard-course-card').filter({has:page.getByRole('heading',{name:'MM Preview Mathematics',exact:true})}).getByRole('button',{name:'Open course'}).click();
    const moduleButton=page.getByRole('button',{name:/Algebra practice/});
    if(await moduleButton.getAttribute('aria-expanded')==='false')await moduleButton.click();
    await page.getByRole('button',{name:/Linear relationships/}).click();
    await page.getByRole('button',{name:/mm-acceptance.pdf/}).click();
    const dialog=page.getByRole('dialog',{name:'View mm-acceptance.pdf',exact:true});
    await Promise.race([dialog.getByText('Page 1 of 1',{exact:true}).waitFor({timeout:60000}),dialog.getByRole('alert').waitFor({timeout:60000})]);
    const alerts=await dialog.getByRole('alert').allTextContents();assert.deepEqual(alerts,[],'PDF viewer error: '+alerts.join(';'));
    await page.waitForFunction(()=>{
     const canvas=document.querySelector('.viewer canvas');if(!canvas||canvas.width<=300)return false;
     const pixels=canvas.getContext('2d').getImageData(0,0,canvas.width,canvas.height).data;
     let dark=0,white=0;for(let i=0;i<pixels.length;i+=4){if(pixels[i+3]&&pixels[i]<100)dark++;if(pixels[i]>240&&pixels[i+3])white++}return dark>50&&white>1000;
    },{},{timeout:30000});
    assert(workers.some(u=>u.startsWith(new URL(base).origin+'/')),'No same-origin browser worker');
    const workerUrl=workers.find(u=>u.startsWith(new URL(base).origin+'/'));
    const response=await page.request.get(workerUrl);assert.equal(response.status(),200);assert.match(response.headers()['content-type'],/javascript/);assert((await response.text()).includes(expectedVersion),'Worker/library version mismatch');
    const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);assert.equal(overflow,false,'Page overflows viewport');
    results.push({viewport,mobileEmulation:viewport.width<600,phase,passed:true,workerPath:new URL(workerUrl).pathname,version:expectedVersion,nonblankCanvas:true});
    await dialog.getByRole('button',{name:'Close document'}).click();
   }
   assert.deepEqual(errors,[]);await context.close();
  }
  console.log(JSON.stringify({base,checks:results},null,2));
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
