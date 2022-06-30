(()=>{
    
    var Ex = {
        "log":[]
    };

    /*

    var comic_div = document.querySelector("#mangaBox").parentElement.parentElement.parentElement.parentElement.parentElement;
    var comic_td = document.querySelector("#mangaBox").parentElement;
    var conic_page = document.querySelector("#mangaMoreBox");

    

    comic_div.style.position = 'absolute';
    comic_div.style.top = '0px';
    comic_div.style.zIndex = '99';

    comic_td.style.display = 'inline-flex';
    comic_td.style.direction = 'rtl';

    conic_page.style.display = 'inline-flex';
    conic_page.style.direction = 'rtl';
    */



    setInterval(()=>{

        /*
        document.querySelectorAll(".sitemaji_banner").forEach(o=>{
            o.remove();
        });
        */

        document.querySelectorAll("img").forEach(o=>{
        
            if(Ex.log.indexOf(o)===-1)
            {
                o.oncontextmenu = function(){
            
                    var n_w = window.open("",``,`width=${window.innerWidth/2},height=${window.innerHeight}`);
                    n_w.document.body.style = "margin:0px;padding:0px;";
                    n_w.document.body.innerHTML = `<img style="max-height:100%;max-width:100%;" src="${o.src}">`;
                }

                Ex.log.push(o);
            }

            //o.style.height = `${window.innerHeight-20}px`;

            
        
        });

    },500);
    
})();



//var js = document.createElement("script");js.src =  `https://kfsshrimp.github.io/js/web_comic.js?s=${new Date().getTime()}`;document.head.prepend(js);