class ClassEx {

    constructor(){

        this.ExId = "kfsshrimpEx";

        this.Style = {
            all:`
                #MsgPop{
                    position:fixed;
                    z-index: 9999;
                    padding: 10px;
                    border-radius: 5px;
                    background: #000;
                    color: #fff;
                    text-align: center;
                    font-size: 10px;
                    border: 2px #0a0 solid;
                    top: 30%;
                    left: 30%;
                }
                canvas.Screenshot{
                    top: 0px;
                    left: 0px;
                    position: absolute;
                    z-index: 9999;
                    cursor: pointer;
                }                
            `,
            plurk:`
                .img-holder{
                    overflow:hidden !important;
                }
                .cbox_img{
                    width:auto !important;
                    max-height:100%;
                }
            `,
            nicovideo:`
                button[data-href]{
                    border: solid 2px #f00;
                    border-radius: 5px;
                    height: 25px;
                }
                button[data-href]:hover{
                    border: solid 2px #000;
                    background: #000;
                    color: #fff;
                }
            `,
            youtube:`
                yt-emoji-picker-renderer{
                    height:280px !IMPORTANT;
                    max-height:280px !IMPORTANT;
                }
            `,
            nhentai:`
                #image-container img{
                    position: absolute;
                    left:0px;
                    top:0px;
                    width:auto;
                    height:${window.innerHeight}px !IMPORTANT;
                    z-index: 9999;
                }
            ` ,
            wnacg:`
                #photo_body{
                    position: absolute;
                    left:0px;
                    top:0px;
                    z-index: 9999;
                }
                #photo_body .photo{
                    padding:0px;
                    border:none;
                }
                #picarea{
                    height: ${window.innerHeight}px;
                }
                #imgarea img{
                    margin:0px;
                    padding:0px;
                }
            `
        }
        this.Func = {
            plurk:()=>{

            },
            twitter:()=>{
                var _run = false;
                document.addEventListener("mousemove",()=>{
        
                    if(_run) return;
        
                    _run = true;
        
                    document.querySelectorAll(`li[role="listitem"] div[role="button"],div[data-testid="cellInnerDiv"] div[aria-labelledby] div[role="button"]`).forEach(btn=>{
        
        
                        if(btn.querySelector("span")!==null){
        
                            if(btn.querySelector("span").innerHTML==="顯示")btn.click();
        
                            if(btn.querySelector("span").lastChild!==null)
                            if(btn.querySelector("span").lastChild.innerHTML==="顯示")btn.click();
                        }
                        
                    });
        
        
                    setTimeout(()=>{ _run = false;},this.mousemove_time_cfg.sec*1000);
        
                });                    
            },
            nicovideo:()=>{

                console.log('nicovideo')
        
        
                var _run = false;
                document.addEventListener("mousemove",()=>{
        
                    if(_run) return;
        
                    _run = true;
        
                    document.querySelectorAll(`.VideoMediaObjectList a[href*="watch"],.videoList01 a[href*="watch"],.contents_list .item_right a[href*="watch"]`).forEach(link=>{
        
                        if(
                            document.querySelector(`[data-href="${link.getAttribute("href")}"]`)!==null || 
                            document.querySelector(`[data-href="https://www.nicovideo.jp${link.getAttribute("href")}"]`)!==null) return;
                        
        
                        let btn = document.createElement("button");
                        btn.innerHTML = "YTDL";
        
                        btn.dataset.href = (link.getAttribute("href").indexOf("http")===-1)?`https://www.nicovideo.jp${link.getAttribute("href")}`:link.getAttribute("href");
        
        
                        btn.addEventListener("click",this.YTDL);
                        link.parentElement.appendChild(btn);
                    });
        
                    setTimeout(()=>{ _run = false;},this.mousemove_time_cfg.sec*1000);
        
                });        
            },
            youtube:()=>{


                var video = document.querySelector("video");
                var owner = document.querySelector("div#owner");
        
                if(location.pathname==='/live_chat') return;
        
                if(video===null || owner===null){
                    console.log('no video');
                    setTimeout(()=>{
        
                        this.youtube();
        
                    },100);
                    return;
                }
        
                var div = document.createElement("div");
                div.id = `${this.ExId}-Timer`;
                div.style = `
                    margin: 0px 10px;
                    padding: 2px 10px;
                    background: #fff;
                    color: #000;
                    height: 30px;
                    border-radius: 5px;
                    font-size: 20px;
                `;
                div.innerHTML = `${this.SecToTime(Math.floor(video.currentTime))}`;
        
                document.querySelector("div#owner").appendChild(div);
        
        
                var _run = false;
                document.addEventListener("mousemove",()=>{
        
                    if(_run) return;
        
                    _run = true;
        
        
                    video = document.querySelector("video")
        
                    div.innerHTML = `${this.SecToTime(Math.floor(video.currentTime))}`;
        
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
                        btn.addEventListener("click",this.YTDL);
                        link.parentElement.appendChild(btn);
                    });
        
                    setTimeout(()=>{ _run = false;},this.mousemove_time_cfg.sec*1000);
                    
                });
        
            },
            nhentai:()=>{

                if(
                    document.querySelector(".next")!==null && 
                document.querySelector("#image-container")!==null){
        
                    /*
                    setInterval(()=>{
                        console.log('next');
                        document.querySelector(".next").click()
                    },1000 * 10);
                    */
        
                }
                
        
            },
            wnacg:()=>{
        
                if(document.querySelectorAll(`.newpage .btntuzao`).length!==0){
        
                    setTimeout(()=>{
                        console.log('next');
                        document.querySelectorAll(`.newpage .btntuzao`)[1].click()
                    },1000 * 10);
        
                }
        
        
            },
            manhuagui:()=>{

                var _run = false;
        
                document.addEventListener("mousemove",()=>{
        
                    if(_run) return;
        
                    _run = true;
        
                    document.querySelectorAll("img").forEach(o=>{
                
                        if(o.dataset.oncontextmenu!=="register")
                        {
                            o.oncontextmenu = function(){
                        
                                var n_w = window.open("",``,`width=${window.innerWidth/2},height=${window.innerHeight}`);
                                n_w.document.body.style = "margin:0px;padding:0px;";
                                n_w.document.body.innerHTML = `<img style="max-height:100%;max-width:100%;" src="${o.src}">`;
                            }
            
                            o.dataset.oncontextmenu = "register";
                        }
            
                    });
        
                    setTimeout(()=>{ _run = false;},this.mousemove_time_cfg.sec*1000);
        
                })
        
            },
            chobit:()=>{
        
        
                var list_div = document.createElement("div");
                document.querySelectorAll(".track-list li").forEach(o=>{ 
                    list_div.innerHTML += `<a target="_blank" href="${o.dataset.src}">${o.dataset.title}</a><BR>`;
                });
                
                document.querySelector(".file-info-box").prepend(list_div);
            }



        }


        this.WebCfg =  {
            
        };

        this.Web = "";

        this.clipboard_txt = "";


        this.key_cfg = {   
            click:"`",
            url:"F2",
            copy:'c',
            style_cls:'Escape',
            ytdl_all:'y'
        }
        this.screenshot_cfg = {
            size:'100px',
            screenshot:'q',
            clear:'w'
        }

        this.msgpop_cfg = {
            sec:2,
            d_sec:2,
        }
        this.ytdl_cfg = {
            flag:{
                format:"",
                clipboard_txt:""
            }
        }

        this.mousemove_time_cfg = {
            sec:2
        }


        this.mousemove = {};
        this.mousedown = {};
        document.addEventListener("mousemove",e=>this.mousemove = e);
        document.addEventListener("mousedown",e=>this.mousedown = e);


        document.addEventListener("keydown",this.KeyBordEvent);

        this.MsgPop( `LOAD Class ${this.ExId}` );


        location.host.split(".").every(url=>{


            if(Object.keys(this.Func).find(list=>list===url)!==undefined)
                this.Web = Object.keys(this.Func).find(list=>list===url);


                console.log(this.Web);

            if(this.Func[ this.Web ]!==undefined){

                console.log(this.Web);

                this.Func[ this.Web ]();
                return false;
            }

            return true;

        });


        this.StyleSet();


        console.log(this);
       
    }



    StyleSet = ()=>{

        console.log('StyleSet');


        var styleSheet = document.createElement("style");
        styleSheet.id = `${this.ExId}_${this.Web}`;
        styleSheet.innerText = this.Style.all + (this.Style[ this.Web ]||``);

        console.log(styleSheet.innerText);

        document.head.appendChild( styleSheet );
    }

   

    KeyBordEvent = (e)=>{

        switch (e.key.toString().toUpperCase())
        {
            case this.key_cfg.style_cls.toString().toUpperCase():


                (document.querySelector(`style#${this.ExId}`))?document.querySelector(`style#${this.ExId}`).remove():this.StyleSet();
            
            break;

            case this.key_cfg.url.toString().toUpperCase():

                this.Cliboard(location.href);

            break;

            case this.screenshot_cfg.screenshot.toString().toUpperCase():

                console.log("screenshot_cfg.screenshot")
                this.Screenshot.Get();

            break;

            case this.screenshot_cfg.clear.toString().toUpperCase():

                this.Screenshot.Clear();

            break;

            case this.key_cfg.ytdl_all.toString().toUpperCase():

                this.ytdl_cfg.flag.clipboard_txt = "";
                var _f = prompt("輸入YTDL下載格式(批次大量下載)");
                var video_count = 0;

                this.ytdl_cfg.flag.clipboard_txt = "";
                this.ytdl_cfg.flag.format = "";

                if(_f==="" || _f===null) return;

                document.querySelectorAll(`[data-href]`).forEach(button=>{

                    this.ytdl_cfg.flag.clipboard_txt += `yt-dlp --cookies-from-browser firefox -f ${_f} --write-thumbnail ${button.dataset.href}\n`;

                    video_count++;

                });

                setTimeout(()=>{
                    navigator.clipboard.writeText(this.ytdl_cfg.flag.clipboard_txt);


                    this.MsgPop(`${video_count}個YTDL語法已複製`);
                },100);

            break;

            /*
            case key_cfg.click:
                if(e.altKey===false) return;
                
                (typeof(this.mousemove.target.click)==="function")?this.mousemove.target.click():'';
                this.mousemove.target.focus();
            break;

            case key_cfg.copy:
                if(e.altKey===false) return;

                console.log(this.mousemove);

                if( this.mousemove.path.find(o=>{return o.tagName==="IMG"})!=undefined )
                {
                    this.msgpop_cfg.url = this.mousemove.path.find(o=>{return o.tagName==="IMG"}).src;
                    this.CopyImg(this.mousemove.path.find(o=>{return o.tagName==="IMG"}).src);

                }
                else if( this.mousemove.path.find(o=>{return o.tagName==="CANVAS"})!=undefined )
                {
                    console.log("CANVAS");
                    this.msgpop_cfg.url = location.href;

                    this.mousemove.path.find(o=>{return o.tagName==="CANVAS"}).toBlob( (blob)=>{
                
                        this.Cliboard(blob);
                            
                    });

                }
                else if( this.mousemove.path.find(o=>{return o.tagName==="A"})!=undefined )
                {
                    this.msgpop_cfg.url = this.mousemove.path.find(o=>{return o.tagName==="A"}).href;

                    this.Cliboard(this.mousemove.path.find(o=>{return o.tagName==="A"}).href);
                }
                else
                {
                    this.Cliboard(this.mousemove.path[0].value||this.mousemove.path[0].innerHTML);
                }
            break;
            */

        }
    }

    Cliboard = async(data)=>{

        var msg = `已複製:${data}`;

        if( typeof(data)==="object" )
        {
            await navigator.clipboard.write([
                new ClipboardItem({[data.type]:data})
            ]);
            msg += ` [圖片]`;
        }
        else
        {
            navigator.clipboard.writeText(data);
        }

        this.MsgPop( msg );
    }


    Screenshot = {
        Get:()=>{

            

            var video = document.querySelector("video");
            var canvas = document.createElement("canvas");
            var c2d = canvas.getContext("2d");
            canvas.id = this.ExId;
            canvas.className = "Screenshot";
    
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
    
            (canvas.width>canvas.height)?canvas.style.width = 'inherit':canvas.style.height = 'inherit';
    
            c2d.drawImage(video,0,0,video.videoWidth,video.videoHeight);
    
            canvas.style.left = '0px';
            canvas.style.right = '0px';
            canvas.style.height = this.screenshot_cfg.size;
            canvas.addEventListener("click",(e)=>{
                e.target.style.height = (e.target.style.height===this.screenshot_cfg.size)?`60%`:this.screenshot_cfg.size;
            });
    
            this.DragendRegister(canvas);
    
    
            document.body.appendChild(canvas);
        },
        Clear:()=>{

            document.querySelectorAll(`canvas#${this.ExId}`).forEach(o=>o.remove());

        }

    }


    DragendRegister = (ele)=>{

        ele.setAttribute("draggable","true");
        ele.addEventListener("dragend",(e)=>{
            ele.style.left = e.clientX - this.mousedown.offsetX + "px";
            ele.style.top = e.clientY - this.mousedown.offsetY + "px";
        });
    }


    /*
    CopyImg = (url)=>{


        var img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = url;
        img.style.display = "none";
        document.body.prepend(img);

        setTimeout(()=>{

            var canvas = document.createElement("canvas");
            var c2d = canvas.getContext("2d");
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            c2d.drawImage(img,0,0,img.naturalWidth,img.naturalHeight);
    
            canvas.toBlob( (blob)=>{
                
                this.Cliboard(blob);
                    
            });

            img.remove();

        },500);
    }
    */

    SecToTime = (sec)=>{

        var _return;

        if(Array.isArray(sec))
        {
            _return = parseInt(sec[0]*60*60) + parseInt(sec[1]*60) + parseInt(sec[2]);
        }
        else
        {
            _return = `${ Math.floor(sec/3600).toString().padStart(2,"0") }:${ Math.floor(sec%3600/60).toString().padStart(2,"0") }:${ Math.floor(sec%60).toString().padStart(2,"0") }`;
        }


        return _return;
    }


    MsgPop = (html,sec = this.msgpop_cfg.sec,d_sec = this.msgpop_cfg.d_sec)=>{

        var div = document.createElement("div");
        div.id = "MsgPop";
        div.innerHTML = html;
        div.style.transitionDuration = `${d_sec}s`;
        div.style.opacity = 1;

        document.body.prepend(div);

        setTimeout(()=>{
            div.style.opacity = 0;

            setTimeout(()=>{
                div.remove();
            },sec * 1000);

        },d_sec * 1000);
        
    }



    YTDL = (e)=>{

        if(this.ytdl_cfg.flag.clipboard_txt===""){

            this.ytdl_cfg.flag.clipboard_txt = `yt-dlp --cookies-from-browser firefox -F --write-thumbnail ${e.target.dataset.href}\n`;
    
            setTimeout(()=>{
                navigator.clipboard.writeText(this.ytdl_cfg.flag.clipboard_txt);
                
                this.MsgPop(`已複製指令：${this.ytdl_cfg.flag.clipboard_txt}`);
            },100);

            return;
        }

        if(this.ytdl_cfg.flag.format===""){

            this.ytdl_cfg.flag.format = prompt("輸入YTDL下載格式");

            if(this.ytdl_cfg.flag.format==="" || this.ytdl_cfg.flag.format===null) return;

            this.ytdl_cfg.flag.clipboard_txt = "";
            
        }

        this.ytdl_cfg.flag.clipboard_txt += `yt-dlp --cookies-from-browser firefox -f ${this.ytdl_cfg.flag.format} --write-thumbnail ${e.target.dataset.href}\n`;

        setTimeout(()=>{
            navigator.clipboard.writeText(this.ytdl_cfg.flag.clipboard_txt);
            
            this.MsgPop(`已複製指令：${this.ytdl_cfg.flag.clipboard_txt}`);
        },100);

        

    }

}
new ClassEx();

