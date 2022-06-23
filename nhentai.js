var sec = 7;
var NextClock;
var Clock = ()=>{

    console.log(sec);
    NextClock = setInterval(()=>{

        document.querySelector(".next").click();

    },sec*1000);
}

function Sec(set)
{
    sec = set;
    clearInterval(NextClock);
    Clock();
}
(()=>{
    
    document.querySelector(".advt").remove();
    document.querySelectorAll(".reader-bar")[0].remove();
    document.querySelector(`[role="navigation"]`).remove();
    document.querySelector(`#messages`).remove();
    document.body.style.paddingTop = '0px';

    window.scrollTo(0,0)
    document.onkeyup = ()=>{
        console.log('test');
        clearInterval(NextClock);
        Clock();
    }

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


   
    setInterval(()=>{
        document.querySelector("#image-container img").style.maxHeight = `${window.innerHeight}px`;
        document.querySelector("#image-container img").removeAttribute("width");
    },1);


    Clock();

    
    
})();



//var js = document.createElement("script");js.src =  `https://kfsshrimp.github.io/js/web_comic.js?s=${new Date().getTime()}`;document.head.prepend(js);