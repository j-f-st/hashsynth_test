import { Application, Router, RouterContext, Status, helpers } from "https://deno.land/x/oak/mod.ts";
import { oakCors } from 'https://deno.land/x/cors/mod.ts';

import { config } from 'https://deno.land/x/dotenv/mod.ts';
import ky from 'https://deno.land/x/ky/index.js'

const app = new Application();
const router = new Router();

console.log("http://localhost:8080/");

router.get("/", async (ctx)=>{
    const file = await Deno.open('./public/index.html');
    ctx.response.status = Status.OK;
    ctx.response.type = "text/html";
    ctx.response.body = file;
});


// ---
// API
// ---
router.get("/api/:chain/transaction/:walletaddress", async ( ctx ) =>{

    const { chain, walletaddress } = helpers.getQuery(ctx, { mergeParams : true });

    // console.log(chain); | chain : eth / bsc

    const BSC_SCAN_API_KEY = config().BSC_SCAN_API_KEY;
    const ETH_SCAN_API_KEY = config().ETH_SCAN_API_KEY;

    async function getTransactionHistory( chain: string, walletAddress: string ){

        const reqBody: any = {
            'module':'account',
            'action':'txlist', // transaction list ?
            'address':walletAddress,
            'startblock':0,
            // 'endblock':currentBlock,
            'page':1,
            'offset':30, //取得するトランザクションの最大数
            'sort':'desc',
            'apikey': chain === "eth" ? `${ETH_SCAN_API_KEY}` : `${BSC_SCAN_API_KEY}`,
        };

        const qs  = new URLSearchParams(reqBody);

        const externalApiUrl = chain === "eth" ? "https://api.etherscan.io/api" : "https://api.bscscan.com/api";
        
        // @ts-ignore
        const res = await ky.post( `${externalApiUrl}?${qs}` ).json();
        return res;
    }

    ctx.response.body = await getTransactionHistory( chain, walletaddress );
});
router.get("/favicon.ico", async ( ctx ) =>{
    ctx.response.status = Status.OK;
    // ctx.response.location = "https://deno.land/favicon.ico";
});
  
app.use(router.routes());
app.use(router.allowedMethods());
app.use(oakCors()); // CORS有効化 ローカルのみ！！

await app.listen({ port: 8080 });