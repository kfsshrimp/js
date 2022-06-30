var sec = 10;
var NextClock;
var Clock = ()=>{

    console.log(sec);
    NextClock = setInterval(()=>{

        Page(1);

    },sec*1000);
}

function Sec(set)
{
    sec = set;
    clearInterval(NextClock);
    Clock();
}


function Page(next_page)
{
    var url = document.querySelector("#picarea").src.split("/");
    var img = url.pop().split(".");
    
    var img_len = img[0].length;
    img[0] =  parseInt(img[0])+next_page;
    document.querySelector("#picarea").src = `${url.join("/")}/${img[0].toString().padStart(img_len,"0")}.${img[1]}`;
}

(()=>{
    
    document.querySelector("#header").remove();
    document.querySelector("#bread").remove();
    document.querySelector("#bodywrap").remove();
    document.querySelector(".tocaowrap").remove();
    document.querySelector(".newpagewrap").remove();
    document.querySelector(".footer.wrap").remove();

    document.querySelector("#imgarea a").removeAttribute("href");
    
    var s = document.createElement("select");
    s.style = `
    position: absolute;
    top: 0px;
    left: 0px;
    z-index: 1;
    `;
    for(var i=5;i<=15;i++)
    {
        s.innerHTML += `<option>${i}</option>`;
    }
    s.onchange = (e)=>{
        Sec( e.target.value );
    }

    document.body.prepend(s);



    document.querySelector("#picarea").style.maxHeight = `${window.innerHeight}px`;
    document.querySelector("#picarea").style.padding = `0px`;
    document.querySelector("#picarea").removeAttribute("width");


    Clock();

    window.onkeydown = (e)=>{
        
        if(e.key.toString().toLowerCase()==="z")
        {
            Page(-1);
            clearInterval(NextClock);
            Clock();
        }

        if(e.key.toString().toLowerCase()==="x")
        {
            Page(1);
            clearInterval(NextClock);
            Clock();
        }
    }

    
    
})();



//var js = document.createElement("script");js.src =  `https://kfsshrimp.github.io/js/wnacg.js?s=${new Date().getTime()}`;document.head.prepend(js);