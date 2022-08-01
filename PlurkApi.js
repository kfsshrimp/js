function PlurkApi( opt = {} )
{
    var config = {
        //"CORS":"https://cors-anywhere.herokuapp.com/",
        //"CORS":"https://api.allorigins.win/get?url=",
        "CORS":"https://us-central1-kfs-plurk.cloudfunctions.net/corsAnyWhere?",
        "XmlAsync":false

    };

    var x = [
        "PjKhvBiudHOl",
        "xdNl7fNTBMISKOCPzY1RM49mJXK8fwOG",
        "TDVM8Q8iwq6O",
        "K7TtXccPALzfCVrtohLffJOjCc63XauX"
    ];

    var timestamp = (s = 10)=>{ return new Date().getTime().toString().substr(0,s); }
    var nonce = ()=>{ return new Date().getTime().toString().substr(-8); }



    this.func = opt.func||function(){};
    this.arg = opt.arg||{};
    this.mode = "CORS";
    this.debug = false;

    for(var key in opt) this[key] = opt[key]||"";
    

    var api_row = [
        "content&",
        "limited_to&",
        "limit&",
        "no_comments&",
        "&plurk_id",
        "count&",
        "from_response&",
        "&response_id",
        "filter&",
        "nick_name&",
        "&offset",
        "minimal_data&",
        "minimal_user&",
        "&only_user"
    ];

    this.Send = ()=>{

        for(var key of api_row)
        {
            var word = key.split("&").filter(a=>a!=="")[0]||"";

            this.arg[word] = this.arg[word]||"";

            
            this.arg[word] = (this.arg[word]).toString();

           

            if(key.indexOf("limited_to")!==-1)
            {
                this.arg[word] = 
                (!this.arg[word])?"":word+"="+encodeURIComponent("["+this.arg[word]+"]");
            }
            else
            {
                this.arg[word] = 
                (!this.arg[word])?"":word+"="+encodeURIComponent(this.arg[word]);
            }


            if(key.substr(0,1)==="&" && !!this.arg[word]) this.arg[word] = "&"+this.arg[word];
            if(key.substr(-1,1)==="&" && !!this.arg[word]) this.arg[word] = this.arg[word]+"&";
        }
        

        switch (this.act)
        {
            case "Timeline/getPlurk":

                this.SBS = 
                "oauth_consumer_key="+x[0]+"&oauth_nonce="+nonce()+"&oauth_signature_method=HMAC-SHA1&oauth_timestamp="+timestamp()+"&oauth_token="+x[2]+"&oauth_version=1.0"+this.arg.plurk_id;
            break;

            case "Timeline/getPublicPlurks":

                this.SBS = 
                this.arg.limit + 
                this.arg.minimal_data +
                this.arg.minimal_user +
                this.arg.nick_name + 
                "oauth_consumer_key="+x[0]+"&oauth_nonce="+nonce()+"&oauth_signature_method=HMAC-SHA1&oauth_timestamp="+timestamp()+"&oauth_token="+x[2]+"&oauth_version=1.0" + 
                this.arg.offset + 
                this.arg.only_user;

            break;

            case "Responses/get":

                this.SBS = 
                this.arg.count + 
                this.arg.from_response + 
                "oauth_consumer_key="+x[0]+"&oauth_nonce="+nonce()+"&oauth_signature_method=HMAC-SHA1&oauth_timestamp="+timestamp()+"&oauth_token="+x[2]+"&oauth_version=1.0"+this.arg.plurk_id;
            break;

            case "Timeline/plurkAdd":

                this.SBS = 
                this.arg.content+
                this.arg.limited_to+
                this.arg.no_comments+"oauth_consumer_key="+x[0]+"&oauth_nonce="+nonce()+"&oauth_signature_method=HMAC-SHA1&oauth_timestamp="+timestamp()+"&oauth_token="+x[2]+"&oauth_version=1.0&qualifier="+encodeURIComponent(":");

            break;

            case "Timeline/plurkDelete":
                this.SBS = 
                "oauth_consumer_key="+x[0]+"&oauth_nonce="+nonce()+"&oauth_signature_method=HMAC-SHA1&oauth_timestamp="+timestamp()+"&oauth_token="+x[2]+"&oauth_version=1.0"+this.arg.plurk_id;
            break;

            case "Timeline/plurkEdit":

                this.SBS = 
                this.arg.content + 
                this.arg.no_comments+
                "oauth_consumer_key="+x[0]+"&oauth_nonce="+nonce()+"&oauth_signature_method=HMAC-SHA1&oauth_timestamp="+timestamp()+"&oauth_token="+x[2]+"&oauth_version=1.0"+this.arg.plurk_id;
            break;


            case "Responses/responseAdd":
                this.SBS = 
                this.arg.content + "oauth_consumer_key="+x[0]+"&oauth_nonce="+nonce()+"&oauth_signature_method=HMAC-SHA1&oauth_timestamp="+timestamp()+"&oauth_token="+x[2]+"&oauth_version=1.0"+this.arg.plurk_id+"&qualifier="+encodeURIComponent(":");
            break;

            case "Responses/responseDelete":
                this.SBS = 
                "oauth_consumer_key="+x[0]+"&oauth_nonce="+nonce()+"&oauth_signature_method=HMAC-SHA1&oauth_timestamp="+timestamp()+"&oauth_token="+x[2]+"&oauth_version=1.0"+this.arg.plurk_id+this.arg.response_id;
            break;

            case "Timeline/getPlurks":
                this.SBS = 
                this.arg.filter + 
                "oauth_consumer_key="+x[0]+"&oauth_nonce="+nonce()+"&oauth_signature_method=HMAC-SHA1&oauth_timestamp="+timestamp()+"&oauth_token="+x[2]+"&oauth_version=1.0";
            break;

            case "Profile/getPublicProfile":

                this.SBS = 
                this.arg.nick_name +
                "oauth_consumer_key="+x[0]+"&oauth_nonce="+nonce()+"&oauth_signature_method=HMAC-SHA1&oauth_timestamp="+timestamp()+"&oauth_token="+x[2]+"&oauth_version=1.0";

            break;


            case "checkTime":
                this.SBS = 
                "oauth_consumer_key="+x[0]+"&oauth_nonce="+nonce()+"&oauth_signature_method=HMAC-SHA1&oauth_timestamp="+timestamp()+"&oauth_token="+x[2]+"&oauth_version=1.0";
            break;


            default:
            break;
        }


        if(this.debug) console.log(this.SBS);



        var STR = "GET&";
        STR += encodeURIComponent("https://www.plurk.com/APP/"+this.act)+"&";
        STR += encodeURIComponent(this.SBS);

        var oauth_signature = encodeURIComponent( CryptoJS.HmacSHA1(STR,x[1] + "&" + x[3]).toString( CryptoJS.enc.Base64 ) );

        //Data url 順序隨意
        var url = (this.mode==="CORS")?config.CORS + ("app="+this.act+"&oauth_signature="+oauth_signature +"&"+ this.SBS):"https://www.plurk.com/APP/"+this.act+"?oauth_signature="+oauth_signature +"&"+ this.SBS;
        
        var xml;
        xml = new XMLHttpRequest();
        xml.open("GET",url, config.XmlAsync );
        xml.setRequestHeader('Content-type','application/x-www-form-urlencoded;');

        if( typeof(this.func)==="function" )
            xml.onreadystatechange = ()=>{ this.func(xml); }

        xml.send();





        for(var key in this.arg )
        {
            this.arg[key] = this.arg[key]||"";
            
            this.arg[key] = this.arg[key].split("&").filter(a=>a!=="")[0]||"";

            this.arg[key] = decodeURIComponent( this.arg[key].split("=")[1]||"" );
        }

    }
}








