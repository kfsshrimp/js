class PlurkEx_pet {
    
    constructor(){

        var Ex = {
            "id":"PlurkEx_pet",
            "config":{},
            "obj":{},
            "f":{
                "style_set":function(){

                    var link = document.createElement('link');
                    link.href = `https://kfsshrimp.github.io/css/${Ex.id}.css?s=${new Date().getTime()}`;
                    link.rel = 'stylesheet';
                    link.type = 'text/css';
                    document.head.prepend(link);
                },
                pet:(mode,opt)=>{

                    switch(mode){
                        case "move":
                            Ex.obj.petDiv.style.left = `${opt.x}px`;
                            Ex.obj.petDiv.style.top = `${opt.y}px`;
                        break;

                        default:

                            Ex.obj.petDiv = document.querySelector("#dynamic_logo");

                            setTimeout(()=>{
                                Ex.obj.petDiv.style = `opacity: 0;`;
        
                                setTimeout(()=>{
        
                                    Ex.obj.petDiv.querySelector("img").src = "https://s.plurk.com/creatures/big/72e28d113423eccdc548.png";
                                    Ex.obj.petDiv.style = `
                                        opacity:1;
                                        top: 0px;
                                        left: 0px;
                                        z-index: 999999;
                                        cursor: grab;
                                    `;
                                },1000);
        
                            },100);
        

                        break;
                    }
                },
                default:()=>{


                    Ex.f.style_set();
                    Ex.f.pet();

                }
            }
        };

        Ex.f.default();

        return Ex;
    }

};


var pet = new PlurkEx_pet();