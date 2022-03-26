(()=>{
    
    var Ex = {
        "log":[]
    };
    setInterval(()=>{

        document.querySelectorAll("img").forEach(o=>{
        
            if(Ex.log.indexOf(o)===-1)
            {
                o.oncontextmenu = function(){
            
                    var n_w = window.open("",``,`width=${window.innerWidth/2},height=${window.innerHeight}`);
                    n_w.document.body.style = "margin:0px;padding:0px;";
                    n_w.document.body.innerHTML = `<img style="max-height:100%;max-width:100%;" src="${o.src}">`;
                }
            }
            
            Ex.log.push(o);
        
        });

    },1000);
    
})();



//var js = document.createElement("script");js.src =  `https://kfsshrimp.github.io/plurk/youtube.js?s=${new Date().getTime()}`;document.head.prepend(js);