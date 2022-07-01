(()=>{
    
    var list_div = document.createElement("div");
    document.querySelectorAll(".track-list li").forEach(o=>{ 
        list_div.innerHTML += `<a target="_blank" href="${o.dataset.src}">${o.dataset.title}</a><BR>`;
    });
    
    document.querySelector(".file-info-box").prepend(list_div);

})();



//var js = document.createElement("script");js.src =  `https://kfsshrimp.github.io/js/web_comic.js?s=${new Date().getTime()}`;document.head.prepend(js);