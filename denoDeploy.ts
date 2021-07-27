async function handleRequest(request) {

    const bscScanApiKey  = Deno.env.get("BSC_SCAN_API_KEY");
    const ethScanApiKey  = Deno.env.get("ETH_SCAN_API_KEY");
    const polScanApiKey  = Deno.env.get("POL_SCAN_API_KEY");

    const { pathname }  = new URL(request.url);
    const chain         = pathname.split("/")[1];
    const walletAddress = pathname.split("/")[2];
    
    if(chain === "bsc" || chain === "eth" || chain === "pol"){

        let apikey   = "";
        let endpoint = "";

        if( chain === "bsc" ){
            apikey   = bscScanApiKey;
            endpoint = "https://api.bscscan.com/api";
        } else if( chain === "eth" ){
            apikey = ethScanApiKey;
            endpoint = "https://api.etherscan.io/api";
        } else {
            apikey = polScanApiKey;
            endpoint = "https://api.polygonscan.com/api";
        }

        // 仮
        const reqBody: any = {
            'module':'account',
            'action':'txlist', // transaction list ?
            'address': walletAddress,
            'startblock':0,
            // 'endblock':currentBlock,
            'page':1,
            'offset':20, // 取得するトランザクションの最大数
            'sort':'desc',
            'apikey': apikey
        }
        const qs  = new URLSearchParams(reqBody);
        const response = await fetch( endpoint + "?" + qs , {
            headers: {
                accept: "application/json",
            },
        });

        if (response.ok) {        
            return new Response(JSON.stringify( await response.json() ), {
                headers: {
                    // いずれ外せ！！！！！！
                    // いずれ外せ！！！！！！
                    // いずれ外せ！！！！！！
                    // いずれ外せ！！！！！！
                    // あとでちゃんとやれ！！！！！！
                    'Access-Control-Allow-Origin': '*',
                    // いずれ外せ！！！！！！
                    "content-type": "application/json; charset=UTF-8",
                },
            });
        }

        return new Response(
            JSON.stringify({ message: "couldn't process your request" }),
            {
                status: 500,
                headers: {
                    "content-type": "application/json; charset=UTF-8",
                },
            },
        );
    } else {
        return false;
    }
}

addEventListener("fetch", (event) => {
    event.respondWith(handleRequest(event.request));
});