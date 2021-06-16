const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const multer = require("multer")
const path = require("path");
const app = express();


app.set('view engine', 'ejs');


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/courseDB", { useNewUrlParser: true });


var Storage = multer.diskStorage({
    destination: "./public/uploads/",
    filename: (req, filename, cb) => {
        cb(null, +Date.now() + '.mp4');
    }
});

var upload = multer({
    storage: Storage
}).single("file");


const uploadschema = {
    coursetitle: String,
    coursesubtitle: String,
    courseauthor:String,
    coursedescription: String,
    courseprice:Number,
    titleimage: String,
    videotitle: [String],
    coursevideo: [String],
    totalvideo:Number,
}

const fullcourse = mongoose.model("fullcourse", uploadschema);

var ctitle = "";
var csubtitle = "";
var cauthor="";
var cdescription = "";
var cprice=0;
var timage = "";
var vtitle = [];
var cvideo = [];
var tvideo=0;


const course = new fullcourse




console.log("jay swaminarayan");

app.get("/upload", function (req, res) {
    res.sendFile(__dirname + "/upload.html")
})



app.post("/upload", upload, function (req, res, next) {
    ctitle = req.body.title;
    csubtitle = req.body.subtitle;
    
    cauthor = req.body.author;
   
    cdescription = req.body.description;
    
    cprice = req.body.price;
    
    timage = req.file.filename;
    res.render(__dirname + "/views/upload.ejs")
    
});

app.post("/uploadvideos", upload, function (req, res, next) {
    tvideo++;
    if (req.body.yes === "on") {
        course.videotitle.push(req.body.title);
        course.coursevideo.push(req.file.filename);
        

        course.coursetitle = ctitle,
            course.coursesubtitle = csubtitle,
            course.courseauthor = cauthor,
            course.coursedescription = cdescription,
            course.courseprice = cprice,
            course.titleimage = timage,
            course.totalvideo=tvideo,


            course.save();
            console.log(course);
            console.log(course._id);
            res.render("onecourse",{ocourse:course});

    }


    else {
        course.videotitle.push(req.body.title);
        course.coursevideo.push(req.file.filename);
       
        res.render(__dirname + "/views/upload.ejs")

    }

});


app.get("/course", function (req, res) {

    fullcourse.find({},function(err,coursefounds){
        
        res.render("courses",{allcourse:coursefounds});
      
    })

    
    
})


app.post("/viewcourse",function(req, res){
    var id=req.body.button;
    

    
    fullcourse.find({_id:id},function(err,idfind){
       
        
        res.render("onecourse",{ocourse:idfind});

    })

})






app.listen(3000, () => {
    console.log("Server started at port 3000");
});