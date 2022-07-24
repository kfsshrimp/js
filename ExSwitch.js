(()=>{
    var ExAry = [
        "nhentai",
        "plurk",
        "youtube",
        "manhuagui",
        "wnacg",
        "chobit",
        "gamer"
    ];

    var domain = location.host.split(".");

    var name = ExAry.filter(ele => domain.includes(ele));

    if(name==="gamer") name = "youtube";

    var js = document.createElement("script");
    js.src =  `https://kfsshrimp.github.io/js/${name}.js?s=${new Date().getTime()}`;
    document.head.prepend(js);


    console.log(`load：${js.src}`);

})();