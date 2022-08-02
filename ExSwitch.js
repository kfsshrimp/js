class JsCssSet {

    constructor( config = {}){
        this.url = config.url;
        this.type = config.type||'js';
    }

    Set = ()=>{

        var obj;
        switch (this.type)
        {
            case "js":
                obj = document.createElement("script");
                obj.src = `${this.url}?s=${new Date().getTime()}`;

            break;

            case "css":
                obj = document.createElement("link");
                obj.href = `${this.url}?s=${new Date().getTime()}`;
                obj.rel = 'stylesheet';
                obj.type = 'text/css';
                
            break;
        }
       
        document.head.prepend(obj);
    }



}


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
    var src;
    

    src = `https://kfsshrimp.github.io/js/${ExList.find(o => url.host.split(".").includes(o))}.js`;


    var script = document.createElement("script");
    script.src =  `${src}?s=${new Date().getTime()}`;
    document.head.prepend(script);

    console.log(`load：${script.src}`);

})();