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

                            Ex.P_Ex.Storage.local.Pet = Ex.P_Ex.Storage.local.Pet||{
                                "weight":5.0,
                                "happy":50,
                                "hungry":50,
                                "time":Ex.P_Ex.f.Num36( new Date().getTime() )
                            };
                            Ex.P_Ex.f.StorageUpd();
                            

                            Ex.obj.petDiv = document.querySelector("#dynamic_logo");
                            Ex.obj.petImg = Ex.obj.petDiv.querySelector("img");

                            setTimeout(()=>{
                                Ex.obj.petDiv.style = `opacity: 0;`;
        
                                setTimeout(()=>{
        
                                    Ex.obj.petImg.src = "https://s.plurk.com/creatures/big/72e28d113423eccdc548.png";

                                    Ex.obj.petDiv.style = `
                                        opacity:1;
                                        top: 0px;
                                        left: 0px;
                                        z-index: 999999;
                                        cursor: grab;
                                    `;

                                    //Ex.obj.petImg.dataset.event = "ClickEvent";
                                    Ex.obj.petImg.dataset.r_event = "ClickEvent";
                                    Ex.obj.petImg.dataset.mode = "PetStatus";

                                },1000);
        
                            },100);
        

                        break;
                    }
                },
                "PetClock":()=>{

                    Ex.P_Ex.flag.PetWeight = Ex.P_Ex.Storage.local.Pet.weight+'kg';
                    Ex.P_Ex.flag.PetHappy = Ex.P_Ex.Storage.local.Pet.happy;
                    Ex.P_Ex.flag.PetHungry = Ex.P_Ex.Storage.local.Pet.hungry;

                    var time = Ex.P_Ex.f.Num36(Ex.P_Ex.Storage.local.Pet.time);
                    

                    var pass_time = (new Date().getTime() - time) / 1000;
                    if( pass_time >= 60 * 6 )
                    {
                        var count = Math.floor( pass_time  / 60 * 6 );

                        Ex.P_Ex.Storage.local.Pet.happy-=count;
                        Ex.P_Ex.Storage.local.Pet.hungry-=count;

                        Ex.P_Ex.Storage.local.Pet.time = Ex.P_Ex.f.Num36( new Date().getTime() );

                        

                        Ex.P_Ex.f.StorageUpd();
                    }

                    if(document.querySelector("#PetStatus")!==null)
                    {
                        document.querySelector("#PetStatus #Weight").style = `background:linear-gradient(to right, #0f0 ${Ex.P_Ex.Storage.local.Pet.weight}% , #fff 0%);`;

                        document.querySelector("#PetStatus #Happy").style = `background:linear-gradient(to right, #0f0 ${Ex.P_Ex.Storage.local.Pet.happy}% , #fff 0%);`;

                        document.querySelector("#PetStatus #Hungry").style = `background:linear-gradient(to right, #0f0 ${Ex.P_Ex.Storage.local.Pet.hungry}% , #fff 0%);`;

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
                            var pid = Ex.P_Ex.f.PlurkId(menu.querySelector("a[href]").toString().split("/").pop());
                            
                            var plurk = PlurksManager.getPlurkById(pid);
                            console.log(plurk);

                            if(plurk.owner_id===GLOBAL.session_user.uid)
                            {
                                var li = document.createElement("li");
                                li.innerHTML = `<li><a data-event="ClickEvent" data-mode="PetFood" data-pid="${pid}" class="">餵寵物</a></li>`;
    
                                menu.prepend(li);
                            }
                        }

                    },1000);

                    

                }
            }
        };

        Ex.f.default();


        return Ex;
    }

};

//var pet = new PlurkEx_Pet({"Clock":{"setInterval":{}}});
//var pet = new PlurkEx_pet();
Ex.OtherEx.PlurkEx_Pet = new PlurkEx_Pet(Ex);