var cfg = {
    key:{
        get:'q',//截圖快截鍵
        clear:'w'//清除截圖快捷鍵
    },
    canvas_height:'100px',//縮圖高度
    canvas_style:{
        left:'0px',
        right:'0px',
        zIndex:'9999',
        cursor:'pointer',
        position:'absolute'
    },
    mousemove:{},
    mousedown:{},
}

document.addEventListener("mousemove",e=>cfg.mousemove = e);
document.addEventListener("mousedown",e=>cfg.mousedown = e);

function Screenshot(){
    var video = document.querySelector("video");
    var canvas = document.createElement("canvas");
    var c2d = canvas.getContext("2d");
    canvas.className = "KfsCanvas";
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    c2d.drawImage(video,0,0,video.videoWidth,video.videoHeight);
    Object.keys(cfg.canvas_style).forEach( k => {
        canvas.style[k] = cfg.canvas_style[k];
    });

    canvas.style.height = cfg.canvas_height;

    canvas.addEventListener("click",(e)=>{
        e.target.style.height = (e.target.style.height===cfg.canvas_height)?`80%`:cfg.canvas_height;
    });


    canvas.setAttribute("draggable","true");
    canvas.addEventListener("dragend",(e)=>{

        canvas.style.left = e.clientX - cfg.mousedown.offsetX + "px";
        canvas.style.top = e.clientY - cfg.mousedown.offsetY + "px";
    });



    document.body.prepend(canvas);
}



document.addEventListener("keyup",(e)=>{
    if(e.key===undefined) return;

    switch (e.key.toString().toUpperCase())
    {
        case cfg.key.get.toString().toUpperCase():

            Screenshot();
        break;

        case cfg.key.clear.toString().toUpperCase():

            document.querySelectorAll(".KfsCanvas").forEach(obj=>{
                obj.remove();
            })
        
        break;


    }


});