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
   
    setInterval(()=>{
        document.querySelector("#image-container img").style.maxHeight = `${window.innerHeight}px`;
        document.querySelector("#image-container img").removeAttribute("width");
    },1);


    Clock();

    
    
})();



//var js = document.createElement("script");js.src =  `https://kfsshrimp.github.io/js/web_comic.js?s=${new Date().getTime()}`;document.head.prepend(js);