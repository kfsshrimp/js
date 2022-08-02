class JsCssSet {

    constructor( url ,config = {} ){

        this.url = url;

    }

    init = ()=>{

        if( Array.isArray(this.url) )
        {
            for(var u of this.url)
            {

                this.Set( new URL(u) );
            }
        }
        else
        {
            this.Set( new URL(this.url) );
        }
    }

    Set = (url)=>{

        var obj;
        var type = url.pathname.split("/").pop().split(".").pop();

        switch (type)
        {
            case "js":
                obj = document.createElement("script");
                obj.src = `${url}?s=${new Date().getTime()}`;

            break;

            case "css":
                obj = document.createElement("link");
                obj.href = `${url}?s=${new Date().getTime()}`;
                obj.rel = 'stylesheet';
                obj.type = 'text/css';
            break;
        }

        console.log(obj);
       
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