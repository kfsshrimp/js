(()=>{
    
    document.querySelector(".advt").remove();
    document.querySelectorAll(".reader-bar")[0].remove();
   
    setInterval(()=>{
        document.querySelector("#image-container img").style.maxHeight = `${window.innerHeight}px`;
        document.querySelector("#image-container img").removeAttribute("width");
    },1);

    setInterval(()=>{
        document.querySelector("#image-container img").click();
    },5000);
    
})();



//var js = document.createElement("script");js.src =  `https://kfsshrimp.github.io/js/web_comic.js?s=${new Date().getTime()}`;document.head.prepend(js);