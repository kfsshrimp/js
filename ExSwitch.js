(()=>{

    var domain = location.host.split(".");

    var js = document.createElement("script");
    js.src =  `https://kfsshrimp.github.io/js/${domain[1]}.js?s=${new Date().getTime()}`;
    document.head.prepend(js);


    console.log(`load：${js.src}`);

})();