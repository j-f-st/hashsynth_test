async function handleRequest(request) {

    const bscScanApiKey = Deno.env.get("BSC_SCAN_API_KEY");

    const { pathname } = new URL(request.url);
    if( pathname ){ 
        console.log(pathname);
        console.log(bscScanApiKey);
    }
    // 仮
    const walletAddress = pathname.replace("/","").replace("?","");

    const response = await fetch("https://api.bscscan.com/api", {
        headers: {
            // Servers use this header to decide on response body format.
            // "application/json" implies that we accept the data in JSON format.
            accept: "application/json",
        },
        body: {
            'module':'account',
            'action':'txlist', // transaction list ?
            'address':walletAddress,
            'startblock':0,
            // 'endblock':currentBlock,
            'page':1,
            'offset':30, // 取得するトランザクションの最大数
            'sort':'desc',
            'apikey': bscScanApiKey
        }
    });

    // The .ok property of response indicates that the request is
    // successful (status is in range of 200-299).
    if (response.ok) {
        
        return new Response(JSON.stringify( await response.json() ), {
            headers: {
                "content-type": "application/json; charset=UTF-8",
            },
        });
    }
    // fetch() doesn't throw for bad status codes. You need to handle them
    // by checking if the response.ok is true or false.
    // In this example we're just returning a generic error for simplicity but
    // you might want to handle different cases based on response status code.
    return new Response(
        JSON.stringify({ message: "couldn't process your request" }),
        {
            status: 500,
            headers: {
                "content-type": "application/json; charset=UTF-8",
            },
        },
    );
}

addEventListener("fetch", (event) => {
    event.respondWith(handleRequest(event.request));
});

// async function handleRequest(request) {

//     const response = await fetch("https://post.deno.dev", {
//         method: "POST",
//         headers: {
//             // This headers implies to the server that the content of
//             // body is JSON and is encoded using UTF-8.
//             "content-type": "application/json; charset=UTF-8",
//         },
//         body: JSON.stringify({
//             message: "Hello from Deno Deploy.",
//         }),
//     });

//     if (response.ok) {
//         // The echo server returns the data back in
//         const {
//             json: { message },
//         } = await response.json();
//         return new Response(JSON.stringify({ message }), {
//             headers: {
//                 "content-type": "application/json; charset=UTF-8",
//             },
//         });
//     }

//     return new Response(
//         JSON.stringify({ message: "couldn't process your request" }),
//         {
//             status: 500,
//             headers: {
//                 "content-type": "application/json; charset=UTF-8",
//             },
//         },
//     );
// }

// addEventListener("fetch", (event) => {
//     event.respondWith(handleRequest(event.request));
// });

// import { Application, Router, RouterContext, Status, helpers } from "https://deno.land/x/oak/mod.ts";
// import { oakCors } from 'https://deno.land/x/cors/mod.ts';

// import { config } from 'https://deno.land/x/dotenv/mod.ts';
// import ky from 'https://deno.land/x/ky/index.js'

// const app = new Application();
// const router = new Router();

// console.log("http://localhost:8080/");

// router.get("/", async (ctx)=>{
//     const file = await Deno.open('./public/index.html');
//     ctx.response.status = Status.OK;
//     ctx.response.type = "text/html";
//     ctx.response.body = file;
// });


// // ---
// // API
// // ---
// router.get("/api/transaction/:walletaddress", async ( ctx ) =>{

//     const { walletaddress } = helpers.getQuery(ctx, { mergeParams : true });

//     const BSC_SCAN_API_KEY = config().BSC_SCAN_API_KEY;

//     async function getTransactionHistory( walletAddress: string ){

//         const reqBody: any = {
//             'module':'account',
//             'action':'txlist', // transaction list ?
//             'address':walletAddress,
//             'startblock':0,
//             // 'endblock':currentBlock,
//             'page':1,
//             'offset':30, //取得するトランザクションの最大数
//             'sort':'desc',
//             'apikey':`${BSC_SCAN_API_KEY}`
//         };

//         const qs  = new URLSearchParams(reqBody);

//         const externalApiUrl = "https://api.bscscan.com/api";
//         // @ts-ignore
//         const res = await ky.post( `${externalApiUrl}?${qs}` ).json();
//         return res;
//     }

//     ctx.response.body = await getTransactionHistory(walletaddress);
//     // ctx.response.body = `入力したwalletaddressは: ${walletaddress} ${currentblock} ${BSC_SCAN_API_KEY}`;
// });
// router.get("/favicon.ico", async ( ctx ) =>{
//     ctx.response.status = Status.OK;
//     // ctx.response.location = "https://deno.land/favicon.ico";
// });

// app.use(router.routes());
// app.use(router.allowedMethods());
// app.use(oakCors()); // CORS有効化 ローカルのみ！！

// await app.listen({ port: 8080 });