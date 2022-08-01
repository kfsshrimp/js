class GetImg{

    constructor(config = {}){

        for(var key in config) this[key] = config[key];

        this.timer = {
            Interval:{},
            Timeout:{}
        }
        
        
        this.video = config.video||document.querySelector("video");
        this.GetImgDiv = config.GetImgDiv||document.querySelector("body");
        this.thumbnail_height = config.thumbnail_height||'80px';
        this.quick_key = config.quick_key||'Q';
        this.cut_loop_sec = config.cut_loop_sec||200;


        this.watermark = {
            font:"bold 12px sans-serif",
            textAlign:"start",
            textBaseline:"top",
            x:5,
            y:5,
            fillStyle:"#fff",
            strokeStyle:"#000"
        }

        document.addEventListener("mousedown",(e)=>{
            this.mousedown = e;
        });

        document.addEventListener("keydown",(e)=>{

            if(e.key.toString().toUpperCase()===this.quick_key.toString().toUpperCase())
            this.CutVideo();

        });

        this.ControlBar();
        this.Style();

    }
    
    Style = ()=>{
        var link = document.createElement('link');
        link.href = `https://kfsshrimp.github.io/css/GetImg.css?s=${new Date().getTime()}`;
        link.rel = 'stylesheet';
        link.type = 'text/css';
        document.head.prepend(link);
    }

    ControlBar = ()=>{

        var GetImgDiv = document.querySelector("div#GetImgDiv")||document.createElement("div");
        GetImgDiv.id = "GetImgDiv";

        var ControlBarDiv = document.querySelector("div#ControlBar")||document.createElement("div");
        ControlBarDiv.id = "ControlBar";


        ControlBarDiv.innerHTML = `
            <input data-mode="cut_loop" type="button" value="開始">
            <input data-mode="cut" type="button" value="截圖">
            <input data-mode="zoom" type="button" value="放大">
            <input data-mode="display" type="button" value="隱藏">
            <input data-mode="clear" type="button" value="清除">
        `;

        ControlBarDiv.querySelectorAll("input").forEach(o=>{
            o.addEventListener("click",this.ControlBtnClick);
        });


        this.DragendRegister(ControlBarDiv);

        document.body.prepend(GetImgDiv);
        document.body.prepend(ControlBarDiv);

        this.GetImgDiv = GetImgDiv;
        this.ControlBarDiv = ControlBarDiv;
    }

    ControlBtnClick = (e)=>{

        switch (e.target.dataset.mode)
        {
            case "cut_loop":
                if(this.timer.Interval.cut_loop!==undefined)
                {
                    clearInterval(this.timer.Interval.cut_loop);
                    e.target.value = `開始`;  
                }
                else
                {
                    this.timer.Interval.cut_loop = setInterval(()=>{this.CutVideo()},this.cut_loop_sec);
                    e.target.value = `停止`;
                }
                
            break;

            case "cut":
                this.CutVideo();
            break;

            case "zoom":
                this.OpenWindow();
            break;

            case "display":
                this.GetImgDiv.style.display = (this.GetImgDiv.style.display==="none")?"block":"none";

                e.target.value = (this.GetImgDiv.style.display==="none")?"顯示":"隱藏";
            break;

            case "clear":
                this.GetImgDiv.innerHTML = ``;
            break;

            case "next":
            case "prev":
            case "delete":
                this.ImgNextPrev(e.target.dataset.mode);
            break;


            default:

            break;
        }
    }

    ImgNextPrev = (mode)=>{

        var img = this.n_w.document.querySelector("img"),
            next;

        this.GetImgDiv.querySelectorAll("canvas").forEach((o,idx)=>{
            if(o.dataset.ca_id===img.dataset.ca_id)
            {
                next = idx;
            }
        });

        switch (mode)
        {
            case "next":
                next = parseInt(next)+1;
            break;
            case "prev":
                next = parseInt(next)-1;
            break;
            case "delete":
                this.GetImgDiv.querySelector(`canvas[data-ca_id='${img.dataset.ca_id}']`).remove();
                next = parseInt(next);
            break;
        }

        if(this.GetImgDiv.querySelectorAll("canvas").length===0)
        {
            this.n_w.close();
            return;            
        }

        next = (next>=this.GetImgDiv.querySelectorAll("canvas").length)?0:next;
        next = (next<0)?this.GetImgDiv.querySelectorAll("canvas").length-1:next;

        img.src = this.GetImgDiv.querySelectorAll("canvas")[next].toDataURL();
        img.dataset.ca_id = this.GetImgDiv.querySelectorAll("canvas")[next].dataset.ca_id;

    };

    OpenWindow = ()=>{

        

        this.n_w = window.open(``,``,`width=${this.video.clientWidth+5},height=${this.video.clientHeight+5}`);
        
        var img = this.GetImgDiv.querySelectorAll("canvas");
        if(img.length===0) return;

        img = img[0];


        this.n_w.document.body.style = "margin:0px;padding:0px;";

        this.n_w.document.body.innerHTML = `
        <div style="
        left:40%;
        position: absolute;
        z-index: 9999;
        opacity: 0.5;
        ">
        <input data-mode="prev" type="button" value="PREV">
        <input data-mode="delete" type="button" value="DELETE">
        <input data-mode="next" type="button" value="NEXT">
        </div>
        <img data-ca_id="${img.dataset.ca_id}" src=${img.toDataURL()}>
        `;

        this.n_w.document.querySelectorAll("input").forEach(o=>{
            o.addEventListener("click",this.ControlBtnClick);
        });
    }
    

    CutVideo = ()=>{
        
        var video = this.video;
        var canvas = document.createElement("canvas");
        var c2d = canvas.getContext("2d");

        canvas.dataset.ca_id = `${this.timestamp()}`;

        

        canvas.style.height = this.thumbnail_height;

        canvas.width = video.clientWidth;
        canvas.height = video.clientHeight;

        c2d.drawImage(video,0,0,video.clientWidth,video.clientHeight);


        this.DragendRegister(canvas);
        this.WaterMark(c2d);
        this.OutPut(canvas);
    }

    WaterMark = (c2d)=>{

        var video = this.video;

        for(var key in this.watermark) c2d[key] = this.watermark[key];

       
        c2d.strokeText(
            `${location.href} ~ ${this.SecToTime(Math.floor(video.currentTime))} `, this.watermark.x, this.watermark.y);
        c2d.fillText(
            `${location.href} ~ ${this.SecToTime(Math.floor(video.currentTime))} ` , this.watermark.x, this.watermark.y);

    }
    
    OutPut = (canvas)=>{

        this.GetImgDiv.appendChild(canvas);
    }


    SecToTime = (sec)=>{
        return `${ Math.floor(sec/3600).toString().padStart(2,"0") }:${ Math.floor(sec%3600/60).toString().padStart(2,"0") }:${ Math.floor(sec%60).toString().padStart(2,"0") }`
    }


    DragendRegister = (ele)=>{

        ele.setAttribute("draggable","true");
        ele.addEventListener("dragend",(e)=>{
            ele.style.left = e.clientX - this.mousedown.offsetX + "px";
            ele.style.top = e.clientY - this.mousedown.offsetY + "px";
        });
    }

    timestamp = (s = 10)=>{ return new Date().getTime().toString().substr(0,s); }


}