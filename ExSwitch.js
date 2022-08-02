(()=>{
    var url = new URL(location.href);

    var ExList = [
        "nhentai",
        "plurk",
        "youtube",
        "manhuagui",
        "wnacg",
        "chobit",
        "animeVideo"
    ];
    var src,ExName;
    

    if(url.searchParams.get("js")===null)
    {
        src = `https://kfsshrimp.github.io/js/${ExList.find(o => url.host.split(".").includes(o))}.js`;
    }
    else
    {
        src = url.searchParams.get("js");
    }

    console.log(src);
    var script = document.createElement("script");
    script.src =  `${src}?s=${new Date().getTime()}`;
    document.head.prepend(script);

    console.log(`load：${script.src}`);

})();