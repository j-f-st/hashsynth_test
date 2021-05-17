async function handleRequest(request) {

    const bscScanApiKey = Deno.env.get("BSC_SCAN_API_KEY");
    const ethScanApiKey = Deno.env.get("ETH_SCAN_API_KEY");

    const { pathname } = new URL(request.url);
    console.log(pathname);
    // pathname.split("/");
    const walletAddress = pathname.replace("/","");

    // 仮
    const reqBody: any = {
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
    const qs  = new URLSearchParams(reqBody);
    const response = await fetch(`https://api.bscscan.com/api?${qs}`, {
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
}

addEventListener("fetch", (event) => {
    event.respondWith(handleRequest(event.request));
});