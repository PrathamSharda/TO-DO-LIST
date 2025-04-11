const express=require("express");
const jwt=require("jsonwebtoken");
const cookieparser=require("cookie-parser");
const cors=require("cors");
const fs=require("fs");
const dotenv=require("dotenv");
const path = require('path');
dotenv.config();
const secretKey=process.env.secretKey;
dotenv.config();
const app=express();
let Data=[];
app.use('/auth', express.static(path.join(__dirname, 'frontend/auth')));
app.use('/todo', express.static(path.join(__dirname, 'frontend/todo')));
app.use(express.json());
app.use(cors({

    origin:["http://127.0.0.1:5501","http://127.0.0.1:5500"],
    credentials: true 
    
}));
app.set("view engine","ejs")

app.use( function(req,res,next){
    try{

        const newData=  fs.readFileSync("backend.json","utf-8");
        console.log(newData);
        if(newData!==undefined)
        Data=JSON.parse(newData);
        
        next();
    }catch(error){
        console.log(error);
        res.status(500).send("error occured while due to backend not properly connecting");

    }
})
app.use(cookieparser());
app.get("/",function(req,res){
    const token=req.cookies.token;
    if(token){
    const verify=jwt.verify(token,secretKey);
    if(verify){
        res.redirect("/home");
    }else{
        res.redirect("/auth");
    }
}
else{
    res.redirect("/auth");
}
})
app.get("/signup", function(req, res) {
    res.render("index"); // Your signup form is in index.ejs
});

app.get("/signin", function(req, res) {
    res.render("signin");
});

app.get("/auth", function(req, res) {
    res.redirect("/signup");
});

app.post("/signup",function(req,res){
    try{
    const username=req.headers.username;
    const password=req.headers.password;

    if(username==undefined||password==undefined)
    {
        
        res.status(500).send("no username/password given");
    }else{
    if(Data!==undefined){
      
    const finder=Data.find((u)=>{
            if(u.username==username){
                return true;
            }
    })
    if(finder)throw "user already exits";
}
       Data.push({
            username:username,
            password:password,
            message:"",
            completed:""
        })
        const returnData=JSON.stringify(Data);

        fs.writeFileSync("backend.json",returnData,"utf-8");
        res.send("user has been registered");
        console.log(Data);
    
    }
}
catch(error){
    if(error=="user already exits")
    {
        console.log(error);
    res.status(400).send(error);
    }else{
        console.log(error);
        res.send(503).send("error while signin up");
    }  
}   
})
app.put("/signin",function(req,res){
    try{
    const username=req.headers.username;
    const password=req.headers.password;
    const token=req.cookies.token;
    console.log(token);
    if(token){
        const verify=jwt.verify(token,secretKey);
        const decode=jwt.decode(token);
       console.log(decode);
      
        if(verify){
            res.send("login sucess");
        }
        else{
            throw "corrupted token";
        }
    }else{
        console.log(username,password);
    const finder=Data.find((u)=>{
            if(u.username==username&&u.password!==password){
                throw "wrong password"
            }
            if(u.username==username&& u.password==password){
                return true;
            }
    })
    if(!finder) throw "cannot find user";
    else{
        const newToken=jwt.sign({
                username:finder.username
        },secretKey);
        console.log(newToken);
        res.cookie("token",newToken);
        res.send("login sucess");
        //res.redirect("/reload");
    }

}
    }
catch(error){
    console.log(error);
    if(error=="corrupted token")
    {
        
        res.status(401).send("error");

    }else if (error=="wrong password"){
        res.status(406).send(error);
    }
    else if(error=="cannot find user")
    {
        
        res.status(409).send(error);

    }else{
        
        res.status(503).send("error while signing in");
    }
}
})
app.get("/home",function(req,res){
    const token=req.cookies.token;
    if(!token)res.redirect("/auth");
    res.render("todo");
})
app.get("/reload",function(req,res){
    const token=req.cookies.token;
    console.log(token);
    const verify=jwt.verify(token,secretKey);
    try{
    if(verify){
        const decode=jwt.decode(token);
        const obj=Data.find(function(u){
            if(u.username==decode.username)
                return true;
        })
        if(obj){
            console.log({ 
                message:obj.message,
                completed:obj.completed
            });
            res.json(
                {
                    message:obj.message,
                    completed:obj.completed
                }
            );
        }else{
            throw "connot find user";
        }
    }
}catch(error){
    res.status(503).send(error);
}
    

})

app.post("/add",function(req,res)
{
    try{
    let value=req.body.value;
    const token=req.cookies.token;
   console.log(value);
    console.log("add");
    const verify=jwt.verify(token,secretKey);
    if(verify){
        const decode=jwt.decode(token);
        let user=false;
        console.log (decode);

        for(let i=0;i<Data.length;i++){
            console.log(decode.username,Data[i].username);
            if(decode.username==Data[i].username){
                console.log("here");
                value=value+"[][][[]]";
                console.log(value);
                Data[i].message+=value;
                console.log(Data[i]);
                user=true;
                break;
                
            }
        }
        if(!user)
         throw "connot find user";
        else {
            const returnData=JSON.stringify(Data);
            fs.writeFileSync("backend.json",returnData,"utf-8");
            res.send("value added");
        }
    }
    else {
        throw "coruupted"
    }
    }catch(error){
        console.log(error);
        if(error=="connot find user")
            res.status(401).send("cannot find user")
        else if(error=="coruupted")
            res.status(403).send("currpted");
        else
            res.status(503).send("server error");
    }
})
app.delete("/delete",function(req,res){
    try{
        console.log("del");
    const token=req.cookies.token;
    const value=req.body.value;
    console.log(token);
    const verify=jwt.verify(token,secretKey);
    if(verify){
        const decode=jwt.decode(token);
        let userFound = false;
        for (let i = 0; i < Data.length; i++) {
            if (decode.username === Data[i].username) {
                
                let messages = Data[i].message.split("[][][[]]");
                const index = messages.indexOf(value);

                if (index !== -1) {
                    messages.splice(index, 1); 
                    Data[i].message = messages.join("[][][[]]"); 
                    userFound = true;
                }
                break; 
            }
        }

        if (userFound) {
    
            const returnData = JSON.stringify(Data);
            fs.writeFileSync("backend.json", returnData, "utf-8");
            res.send("Value deleted successfully");
        } else {
            res.status(404).send("Value not found");
        }
    } else {
        res.status(403).send("Invalid or expired token");
    }
} catch (error) {
    console.log(error);
    res.status(500).send("Server error while deleting value");
}
});
app.post("/complete",function(req,res){
    try{
        let value=req.body.value;
        const token=req.cookies.token;
        const verify=jwt.verify(token,secretKey);
        if(verify){
            const decode=jwt.decode(token);
            let user=false;
            console.log (decode);
    
            for(let i=0;i<Data.length;i++){
                console.log(decode.username,Data[i].username);
                if(decode.username==Data[i].username){
                    console.log("here");
                     value=value+"[][][[]]";
                    console.log(value);
                    Data[i].completed+=value;
                    console.log(Data[i]);
                    user=true;
                    break;             
                }
            }
            if(!user)
             throw "connot find user";
            else {
                const returnData=JSON.stringify(Data);
                fs.writeFileSync("backend.json",returnData,"utf-8");
                res.send("value added");
            }
        }
        else {
            throw "coruupted"
        }
        }catch(error){
            console.log(error);
            if(error=="connot find user")
                res.status(401).send("cannot find user")
            else if(error=="coruupted")
                res.status(403).send("currpted");
            else
                res.status(503).send("server error");
        }
})
app.delete("/deleteComp",function(req,res){
    try{
        
    const token=req.cookies.token;
    const value=req.body.value;
    console.log(token);
    const verify=jwt.verify(token,secretKey);
    if(verify){
        const decode=jwt.decode(token);
        let userFound = false;
        for (let i = 0; i < Data.length; i++) {
            if (decode.username === Data[i].username) {
                
                let messages = Data[i].completed.split("[][][[]]");
                const index = messages.indexOf(value);

                if (index !== -1) {
                    messages.splice(index, 1); 
                    Data[i].completed = messages.join("[][][[]]"); 
                    userFound = true;
                }
                break; 
            }
        }

        if (userFound) {
    
            const returnData = JSON.stringify(Data);
            fs.writeFileSync("backend.json", returnData, "utf-8");
            res.send("Value deleted successfully");
        } else {
            res.status(404).send("Value not found");
        }
    } else {
        res.status(403).send("Invalid or expired token");
    }
} catch (error) {
    console.log(error);
    res.status(500).send("Server error while deleting value");
}
});
app.delete("/logout",function(req,res){
    res.clearCookie("token");
    res.send("sucess");
})
app.listen(3001);