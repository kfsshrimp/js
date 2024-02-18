(()=>{

    var _run = false;
    document.addEventListener("mousemove",()=>{

        if(_run) return;

        _run = true;

        video = document.querySelector("video")


        if(document.querySelector("iframe").contentDocument.querySelector("yt-emoji-picker-renderer")!==null){
            document.querySelector("iframe").contentDocument.querySelector("yt-emoji-picker-renderer").style = `
                    height:320px !IMPORTANT;
                    max-height:320px !IMPORTANT;
                `;
        }

        document.querySelectorAll(`a#video-title[href*="watch"][title],
        a#video-title-link[href*="watch"][title],
        a.yt-simple-endpoint[href*="shorts"][title]`).forEach(link=>{

            

            if( link.parentElement.querySelector("button")!==null){

                if( link.parentElement.querySelector("button").dataset.href===`https://www.youtube.com${link.getAttribute("href")}` ){

                    return;

                }else{
                    
                    link.parentElement.querySelector("button").remove();

                }

            }
            
            

            let btn = document.createElement("button");
            btn.innerHTML = "YTDL";
            btn.dataset.href = `https://www.youtube.com${link.getAttribute("href")}`;
            btn.addEventListener("click",YTDL);
            link.parentElement.appendChild(btn);
        });

        setTimeout(()=>{ _run = false;},1*1000);
        
    });


    function YTDL(){

    }

})();

