(()=>{
    var Ex = {
        id:"Gamer",
        config:{
            
        },
        flag:{
           
            local:{},
            session:{}
        },
        func:{
          
        },
        ele:{

        },
        DB:{},
        js:(url_ary,func)=>{


            for(let i in url_ary)
            {
                setTimeout(()=>{
                    var js = document.createElement("script");
                    js.src = `${url_ary[i]}?s=${new Date().getTime()}`;
                    document.head.appendChild(js);
                },i*200);
            }

            if(typeof(func)==="function") func();

        },
        init:()=>{

            

            Ex.js(
                ['https://kfsshrimp.github.io/js/GetImg.js']
            ,()=>{
                var _t = setInterval(()=>{
                    if(typeof(GetImg)==="function")
                    {
                        Ex.GetImg = new GetImg();
                        clearInterval(_t);
                    }
                },1);
            });


        }
    }

    

    Ex.init();


})();