class PlurkEx_Pet {
    
    constructor(P_Ex){

        var Ex = {
            "P_Ex":P_Ex,
            "id":"PlurkEx_Pet",
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

                    /*
                    <div class="pop-view pop-menu" style="display: block; left: 899.271px; top: 295.885px; z-index: 999999;">
                    <ul>
                    <li>
                    <a>複製網址</a>
                    </li>
                    </ul>
                    </div>
                    */


                    Ex.P_Ex.Clock.setInterval.PLurkEx_Pet_Clock = setInterval(()=>{

                        var menu = document.querySelector(".pop-menu .pop-view-content ul");
                        if(menu!==null && menu.querySelector(`[data-event="ClickEvent"]`)===null)
                        {
                            var li = document.createElement("li");
                            li.innerHTML = `<li><a data-event="ClickEvent" data-mode="pet_food" class="">餵寵物</a></li>`;

                            menu.appendChild(li);
                        }

                    },1000);

                    

                }
            }
        };

        Ex.f.default();


        return Ex;
    }

};

var pet = new PlurkEx_Pet({"Clock":{"setInterval":{}}});
//var pet = new PlurkEx_pet();