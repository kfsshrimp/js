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
        js:(url_ary)=>{


            for(let i in url_ary)
            {
                setTimeout(()=>{
                    var js = document.createElement("script");
                    js.src = `${url_ary[i]}?s=${new Date().getTime()}`;
                    document.head.appendChild(js);
                },i*200);
            }


            var _t = setInterval(()=>{
                if(typeof(PlurkApi)==="function")
                {
                    Ex.PlurkApi = new PlurkApi();
                    clearInterval(_t);
                }
            },100);
        },
        init:()=>{

            

            Ex.js(
                ['https://kfsshrimp.github.io/js/GetImg.js']
            );


        }
    }

    

    window.onload = ()=>{

        Ex.init();


    }
    

})();