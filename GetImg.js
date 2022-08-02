class GetImg{

    constructor(config = {}){

        for(var key in config) this[key] = config[key];

        this.timer = {
            Interval:{},
            Timeout:{}
        }
        
        this.video = config.video||document.querySelector("video");
        this.GetImgDiv = config.GetImgDiv||document.querySelector("body");
        this.thumb_size = config.thumb_size||'120px';
        this.quick_key = config.quick_key||'Q';
        this.loop_sec = config.loop_sec||100;

        this.canvas_list = [];
        //this.canvas_search = [];

        this.JsCssSet = (typeof(JsCssSet)==="function")?new JsCssSet():{};


        this.watermark = {
            font:"bold 13px sans-serif",
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

            switch (e.key)
            {
                case "ArrowRight":
                case "ArrowLeft":
                    document.querySelector(`[data-keydown="${e.key}"]`).click();
                break;

                default :

                    if(e.key.toString().toUpperCase()===this.quick_key.toString().toUpperCase())
                    {
                        this.CutVideo();
                    }
                    
                break;
            }

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

        (document.querySelector("div#GetImgDiv")!==null)?document.querySelector("div#GetImgDiv").remove():'';
        (document.querySelector("div#ControlBar")!==null)?document.querySelector("div#ControlBar").remove():'';

        var GetImgDiv = document.createElement("div");
        GetImgDiv.id = "GetImgDiv";

        var ControlBarDiv = document.querySelector("div#ControlBar")||document.createElement("div");
        ControlBarDiv.id = "ControlBar";







        GetImgDiv.style.height = this.thumb_size;
        GetImgDiv.style.width = this.thumb_size;

        this.DragendRegister(GetImgDiv);


        GetImgDiv.addEventListener("click",this.ClickEvent);


        ControlBarDiv.innerHTML = `
            <input data-mode="search" value="0" type="number" max="24" min="0">
            <input data-mode="search" value="0" type="number" max="59" min="0">
            <input data-mode="search" value="0" type="number" max="59" min="0">
            <input data-mode="cut_loop" type="button" value="開始">
            <input data-mode="cut" type="button" value="截圖">
            <input data-mode="display" type="button" value="隱藏">
            <input data-mode="clear" type="button" value="清除">
            <input data-keydown="ArrowLeft" data-mode="prev" type="button" value="<<">
            <input data-keydown="ArrowRight" data-mode="next" type="button" value=">>">
        `;


        ControlBarDiv.querySelectorAll(`input[type="button"]`).forEach(o=>{
            o.addEventListener("click",this.ClickEvent);
        });

        ControlBarDiv.querySelectorAll(`input[type="number"]`).forEach(o=>{
            o.addEventListener("change",this.ChangeEvent);
        });


        this.DragendRegister(ControlBarDiv);

        document.body.prepend(GetImgDiv);
        document.body.prepend(ControlBarDiv);

        this.GetImgDiv = GetImgDiv;
        this.ControlBarDiv = ControlBarDiv;
    }


    ChangeEvent = (e)=>{

        if(e.target.dataset.mode==="search"){

            var sec = document.querySelectorAll(`[data-mode="search"][type="number"]`);

            sec = [
                sec[0].value,
                sec[1].value,
                sec[2].value
            ];

            sec = this.SecToTime(sec);


            /*
            this.canvas_search = this.canvas_list.filter(o=>{
                return (parseInt(sec)===Math.floor(o.dataset.ca_id/100) || sec===0)
            });

            this.OutPut(this.canvas_search[ this.canvas_search.length-1 ]);
            
            */

            this.OutPut(

                this.canvas_list.findLast(o=>{
                    return parseInt(sec)===Math.floor(o.dataset.ca_id/100)
                })

                );
        }


    }

    ClickEvent = (e)=>{

        if(e.path.indexOf(this.GetImgDiv)!==-1)
        {
            this.GetImgDiv.style.height = (this.GetImgDiv.style.height!==this.thumb_size)?this.thumb_size:`${this.video.clientHeight}px`;

            this.GetImgDiv.style.width = (this.GetImgDiv.style.width!==this.thumb_size)?this.thumb_size:`${this.video.clientWidth}px`;

            this.SetSecSearch();
        }

        if(e.path.indexOf(this.ControlBarDiv)!==-1) this.ControlBtnClick(e);

    }


    ControlBtnClick = (e)=>{

        switch (e.target.dataset.mode)
        {
            case "cut_loop":

                if(this.timer.Interval.cut_loop!==undefined)
                {
                    clearInterval(this.timer.Interval.cut_loop);
                    delete this.timer.Interval.cut_loop;
                    e.target.value = `開始`;
                }
                else
                {

                    this.timer.Interval.cut_loop = setInterval(()=>{

                        this.CutVideo();

                        if(this.video.paused)
                        {
                            clearInterval(this.timer.Interval.cut_loop);
                            delete this.timer.Interval.cut_loop;
                            e.target.value = `開始`;
                        }
                    },this.loop_sec);

                    e.target.value = `停止`;
                }
                
            break;

            case "cut":
                this.CutVideo();
                this.SetSecSearch();
            break;
            
            case "display":
                this.GetImgDiv.style.display = (this.GetImgDiv.style.display==="none")?"block":"none";

                e.target.value = (this.GetImgDiv.style.display==="none")?"顯示":"隱藏";
            break;

            case "clear":
                this.GetImgDiv.innerHTML = ``;
                this.canvas_list = [];
            break;

            case "next":
            case "prev":
                this.ImgNextPrev(e.target.dataset.mode);
            break;


            default:

            break;
        }
    }

    ImgNextPrev = (mode)=>{

        var next;
        this.canvas_list.forEach( (o,idx)=>{

            if(this.GetImgDiv.querySelector("canvas").dataset.ca_id===o.dataset.ca_id)
            {
                next = idx;
            }
        } );

        switch (mode)
        {
            case "next":
                next = parseInt(next)+1;
            break;
            case "prev":
                next = parseInt(next)-1;
            break;
        }

        next = (next>=this.canvas_list.length)?0:next;
        next = (next<0)?this.canvas_list.length-1:next;



        this.OutPut(this.canvas_list[next]);

        this.SetSecSearch();




        return;
        var next;
        this.canvas_search.forEach( (o,idx)=>{

            if(this.GetImgDiv.querySelector("canvas").dataset.ca_id===o.dataset.ca_id)
            {
                next = idx;
            }
        } );

        switch (mode)
        {
            case "next":
                next = parseInt(next)+1;
            break;
            case "prev":
                next = parseInt(next)-1;
            break;
        }

        next = (next>=this.canvas_search.length)?0:next;
        next = (next<0)?this.canvas_search.length-1:next;



        this.OutPut(this.canvas_search[next]);

        this.SetSecSearch();
        
    };

   

    CutVideo = ()=>{
        
        var video = this.video;
        var canvas = document.createElement("canvas");
        var c2d = canvas.getContext("2d");

        canvas.dataset.ca_id = `${Math.floor(this.video.currentTime*100)}`;

        if(
        this.canvas_list.some(o=>{
            return canvas.dataset.ca_id===o.dataset.ca_id;
        }) ) return;
        


        canvas.width = video.clientWidth;
        canvas.height = video.clientHeight;

        (canvas.width>canvas.height)?canvas.style.width = 'inherit':canvas.style.height = 'inherit'


        c2d.drawImage(video,0,0,video.clientWidth,video.clientHeight);


        
        this.WaterMark(c2d);
        this.SaveMemory(canvas);
        
        this.OutPut(canvas);
    }

    WaterMark = (c2d)=>{

        var video = this.video;

        for(var key in this.watermark) c2d[key] = this.watermark[key];

        c2d.strokeText(
            `${location.href} ~ ${this.SecToTime(Math.floor(video.currentTime))}.${video.currentTime.toString().split(".")[1].substr(0,2)} `, this.watermark.x, this.watermark.y);
        c2d.fillText(
            `${location.href} ~ ${this.SecToTime(Math.floor(video.currentTime))}.${video.currentTime.toString().split(".")[1].substr(0,2)} ` , this.watermark.x, this.watermark.y);

    }

    SaveMemory = (canvas)=>{
        
        this.canvas_list.push( canvas );
        //this.canvas_search.push( canvas );
    }
    
    OutPut = (canvas)=>{

        if(canvas===undefined || canvas===null) return;

        canvas.style.left = '0px';
        canvas.style.right = '0px';
        this.GetImgDiv.innerHTML = ``;
        this.GetImgDiv.appendChild(canvas);
    }

    SetSecSearch = ()=>{
        var sec = document.querySelectorAll(`[data-mode="search"][type="number"]`);

        var ca_id = this.GetImgDiv.querySelector("canvas").dataset.ca_id;

        sec[0].value = Math.floor(ca_id/100/3600);
        sec[1].value = Math.floor(ca_id/100%3600/60);
        sec[2].value = Math.floor(ca_id/100%60);
    }


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


    DragendRegister = (ele)=>{

        ele.setAttribute("draggable","true");
        ele.addEventListener("dragend",(e)=>{
            ele.style.left = e.clientX - this.mousedown.offsetX + "px";
            ele.style.top = e.clientY - this.mousedown.offsetY + "px";
        });
    }

    timestamp = (s = 10)=>{ return new Date().getTime().toString().substr(0,s); }




}