const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const multer = require("multer")
const path = require("path");
const app = express();
const pdf = require('html-pdf');
var options = { format: 'A4' };


app.set('view engine', 'ejs');




app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/courseDB", { useNewUrlParser: true });


var studentuser1 = "";
var teacheruser1 = "";
var loginuser = "";

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
    courseauthor: String,
    coursedescription: String,
    courseprice: Number,
    titleimage: String,
    videotitle: [String],
    coursevideo: [String],
    totalvideo: Number,
    category: String,
    examid: [String],
    review: [{
        userid: String,
        username: String,
        feedback: String
    }],
    rating: [Number],
    finalrating: Number,
    totaluser:Number,
}

const fullcourse = mongoose.model("fullcourse", uploadschema);

var ctitle = "";
var csubtitle = "";
var cauthor = "";
var cdescription = "";
var cprice = 0;
var timage = "";
var vtitle = [];
var cvideo = [];
var tvideo = 0;
var courses1 = "";
var ccategory = "";
var eid = [];
var examid1 = "";
var courseid1 = "";
var achivemarks = 0;
var totalmarks = 0;
var loginid = "";
var ccourse = "";
var buy = 0;
var coursebuy = 0;
var buyid1 = 0;


const course = new fullcourse



const studentschema = {
    firstname: String,
    lastname: String,
    email: String,
    number: Number,
    password: String,
    mycourse: [{
        courseid: String,
        responseid: String,
    }],
}

const student = mongoose.model("student", studentschema);


const teacherschema = {
    firstname: String,
    lastname: String,
    email: String,
    number: Number,
    password: String,
    mycourse: [String],
}

const examschema = {
    title: String,
    description: String,
    question: [String],
    marks: [String],
    option: [[String]],
    answer: [String],
    totalscore: Number,
}



const responseschema = {
    examid: String,
    courseid: String,
    userid: String,
    userresponse: [String],
    score: Number,

}


const response = mongoose.model("response", responseschema);

const exam = mongoose.model("exam", examschema);

const teacher = mongoose.model("teacher", teacherschema);

console.log("jay swaminarayan");













//For payment
//const express = require("express");

const https = require("https");
const qs = require("querystring");

//const app = express();

const parseUrl = express.urlencoded({ extended: false });
const parseJson = express.json({ extended: false });

//const PORT = process.env.PORT || 4000;

app.post("/payment", (req, res) => {
    if (studentuser1 == '') {
        var success = 1;
        res.render("frontpage", { smsg: success });
    }

    else {
        var payid = req.body.buy;
        
        console.log(req.body.buy);


        studentuser1[0].mycourse.push({ courseid: req.body.buy, responseid: "" });

        buy = 1;
        console.log(studentuser1[0].mycourse);

        studentuser1[0].save();


        fullcourse.find({ _id: payid }, function (err, coursefind) {
            
            coursefind[0].totaluser=coursefind[0].totaluser+1;
            console.log(coursefind[0].totaluser);
            coursefind[0].save();
            res.render("payment", { pay: coursefind })
        })


    }
});


app.post("/paynow", [parseUrl, parseJson], (req, res) => {
    // Route for making payment

    var paymentDetails = {
        amount: req.body.amount,
        customerId: req.body.name,
        customerEmail: req.body.email,
        customerPhone: req.body.phone
    }
    if (!paymentDetails.amount || !paymentDetails.customerId || !paymentDetails.customerEmail || !paymentDetails.customerPhone) {
        res.status(400).send('Payment failed')
    } else {
        var params = {};
        params['MID'] = config.PaytmConfig.mid;
        params['WEBSITE'] = config.PaytmConfig.website;
        params['CHANNEL_ID'] = 'WEB';
        params['INDUSTRY_TYPE_ID'] = 'Retail';
        params['ORDER_ID'] = 'TEST_' + new Date().getTime();
        params['CUST_ID'] = paymentDetails.customerId;
        params['TXN_AMOUNT'] = paymentDetails.amount;
        params['CALLBACK_URL'] = 'http://localhost:3000/callback';
        params['EMAIL'] = paymentDetails.customerEmail;
        params['MOBILE_NO'] = paymentDetails.customerPhone;


        checksum_lib.genchecksum(params, config.PaytmConfig.key, function (err, checksum) {
            var txn_url = "https://securegw-stage.paytm.in/theia/processTransaction"; // for staging
            // var txn_url = "https://securegw.paytm.in/theia/processTransaction"; // for production

            var form_fields = "";
            for (var x in params) {
                form_fields += "<input type='hidden' name='" + x + "' value='" + params[x] + "' >";
            }
            form_fields += "<input type='hidden' name='CHECKSUMHASH' value='" + checksum + "' >";

            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write('<html><head><title>Merchant Checkout Page</title></head><body><center><h1>Please do not refresh this page...</h1></center><form method="post" action="' + txn_url + '" name="f1">' + form_fields + '</form><script type="text/javascript">document.f1.submit();</script></body></html>');
            res.end();
        });
    }
});

app.post("/callback", (req, res) => {
    // Route for verifiying payment

    var body = '';

    req.on('data', function (data) {
        body += data;
    });

    req.on('end', function () {
        var html = "";
        var post_data = qs.parse(body);

        // received params in callback
        console.log('Callback Response: ', post_data, "\n");


        // verify the checksum
        var checksumhash = post_data.CHECKSUMHASH;
        // delete post_data.CHECKSUMHASH;
        var result = checksum_lib.verifychecksum(post_data, config.PaytmConfig.key, checksumhash);
        console.log("Checksum Result => ", result, "\n");


        // Send Server-to-Server request to verify Order Status
        var params = { "MID": config.PaytmConfig.mid, "ORDERID": post_data.ORDERID };

        checksum_lib.genchecksum(params, config.PaytmConfig.key, function (err, checksum) {

            params.CHECKSUMHASH = checksum;
            post_data = 'JsonData=' + JSON.stringify(params);

            var options = {
                hostname: 'securegw-stage.paytm.in', // for staging
                // hostname: 'securegw.paytm.in', // for production
                port: 443,
                path: '/merchant-status/getTxnStatus',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Content-Length': post_data.length
                }
            };


            // Set up the request
            var response = "";
            var post_req = https.request(options, function (post_res) {
                post_res.on('data', function (chunk) {
                    response += chunk;
                });

                post_res.on('end', function () {
                    console.log('S2S Response: ', response, "\n");

                    var _result = JSON.parse(response);
                    if (_result.STATUS == 'TXN_SUCCESS') {
                        fullcourse.find({ _id: courseid1 }, function (err, idfind) {
                            coursebuy = 0;
                            res.render("onecourse", { ocourse: idfind, diff: loginid, user: studentuser1, done: buy, again: coursebuy });
                        })
                    } else {
                        res.render("payment failed")
                    }
                });
            });

            // post the data
            post_req.write(post_data);
            post_req.end();
        });
    });
});

const checksum_lib = require("./payment/checksum");
const config = require("./payment/config");


/*app.listen(PORT, () => {
  console.log(`App is listening on Port ${PORT}`);
});*/




app.get("/", function (req, res) {
    var success = 0;
    res.render("frontpage", { smsg: success });
})


app.get("/login", function (req, res) {
    var a = "";
    res.render("login", { incorrect: a });
})

app.post("/login", function (req, res) {
    var name = req.body.email;
    var lpassword = req.body.password;
    var type = req.body.type;
    var a = "";

    if (type === "student") {
        student.find({ email: name }, function (err, userfounds) {

            studentuser1 = userfounds;
            loginuser = userfounds;
            loginid = "student";
            console.log(loginid);


            if (userfounds.length === 0 || err) {
                a = "incorrect username!!";
                res.render("login", { incorrect: a });
            }

            else if (userfounds[0].password === lpassword) {
                var success = 0;
                res.render("frontpage", { smsg: success });
            }
            else {
                a = "incorrect password!!";
                res.render("login", { incorrect: a });
            }


        })

    }


    if (type === "teacher") {
        teacher.find({ email: name }, function (err, userfounds) {

            teacheruser1 = userfounds;
            loginuser = userfounds;
            loginid = "teacher";
            if (err || userfounds.length === 0) {
                a = "incorrect username!!";
                res.render("login", { incorrect: a });
            }

            else if (userfounds[0].password === lpassword) {
                res.render(__dirname + "/views/teacher.ejs")
            }
            else {
                a = "incorrect password!!";
                res.render("login", { incorrect: a });
            }


        })

    }



})


app.get("/register", function (req, res) {
    res.sendFile(__dirname + "/Register.html");
})


app.post("/register", function (req, res) {



    var fname = req.body.fname;
    var lname = req.body.lname;
    var email = req.body.email;
    var phno = req.body.phno;
    var password = req.body.password;
    var type = req.body.type;
    var wrong = 1;


    if (type === "teacher") {

        var tempuser = req.body.email;

        teacher.find({ email: tempuser }, function (err, teacherfound) {

            if (teacherfound != '') {

                res.render("register", { incorrect: wrong });
            }
            else {
                const user = new teacher({
                    firstname: req.body.fname,
                    lastname: req.body.lname,
                    email: req.body.email,
                    number: req.body.phno,
                    password: req.body.password,
                })
                console.log(user);
                user.save();
                res.sendFile(__dirname + "/login.html")

            }



        })




    }

    if (type === "student") {


        var tempuser = req.body.email;

        student.find({ email: tempuser }, function (err, teacherfound) {

            if (teacherfound != '') {

                res.render("register", { incorrect: wrong });
            }
            else {
                const user = new student({
                    firstname: req.body.fname,
                    lastname: req.body.lname,
                    email: req.body.email,
                    number: req.body.phno,
                    password: req.body.password,
                })
                console.log(user);
                user.save();
                res.sendFile(__dirname + "/login.html")

            }



        })




    }

    console.log(req.body);




})


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


    ccategory = req.body.categoryname;



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
            course.totalvideo = tvideo,
            course.category = ccategory,
            course.totaluser=0,


            course.save();
        console.log(course);
        console.log(course._id);
        var cid = course._id;
        var fid = teacheruser1[0]._id;
        console.log(teacheruser1);
        console.log(fid)
        teacher.findById(fid, function (err, finduser) {
            finduser.mycourse.push(course._id);
            finduser.save();

        });




        res.render(__dirname + "/views/teacher.ejs")



    }


    else {
        course.videotitle.push(req.body.title);
        course.coursevideo.push(req.file.filename);

        res.render(__dirname + "/views/upload.ejs")

    }

});



app.post("/exploreteacher", function (req, res) {
    res.render(__dirname + "/views/teacher.ejs")
})




app.get("/course", function (req, res) {

    fullcourse.find({}, function (err, coursefounds) {
        courses1 = coursefounds;
        res.render("courses", { allcourse: coursefounds });

    })



})


app.post("/viewcourse", function (req, res) {
    var id = req.body.button;
    courseid1 = req.body.button;


    fullcourse.find({ _id: id }, function (err, idfind) {
        buy = 0;
        console.log(loginid);
        if (studentuser1 != '') {
            for (let i = 0; i < studentuser1[0].mycourse.length; i++) {
                if (studentuser1[0].mycourse[i].courseid == courseid1) {
                    buy = 1;
                    console.log(buy);

                    break;
                }

            }

            console.log(buy);
        }
        console.log(buy);
        
        res.render("onecourse", { ocourse: idfind, diff: loginid, user: studentuser1, done: buy });




    })

})


app.post("/mycart", function (req, res) {
    fullcourse.find({}, function (err, coursefounds) {
        res.render("studentcart", { myprofile: studentuser1, allcourse: coursefounds })

    })


})


app.get("/mycart", function (req, res) {


    fullcourse.find({}, function (err, coursefounds) {
        courses1 = coursefounds;
        console.log(courses1);
        console.log(teacheruser1);
        res.render("cart", { myprofile: teacheruser1, allcourse: courses1 })

    })


})



app.post("/search", function (req, res) {
    const search = req.body.sname;
    console.log(search);
    fullcourse.find({ coursetitle: { $regex: search, $options: "$i" } }, function (err, searchfounds) {
        console.log(searchfounds);
        res.render("courses", { allcourse: searchfounds });
    })
})


app.post("/certificate", function (req, res) {
    console.log(studentuser1);
    console.log(req.body.courseid)
    var cid = req.body.courseid;

    const date = new Date();
    var cdate = date.toDateString();
    console.log(cdate);
    fullcourse.find({ _id: cid }, function (err, coursefind) {
        console.log(coursefind);
        res.render("certi", { certificate: studentuser1, coursecerti: coursefind, coursedate: cdate })
    })



})



app.post("/select", function (req, res) {
    var cat = req.body.sbtn;
    fullcourse.find({ category: cat }, function (err, coursefind) {
        res.render("courses", { allcourse: coursefind })

    })


})


app.post("/addexam", function (req, res) {
    res.sendFile(__dirname + "/exam.html")
    console.log(req.body.courseexam);
    examid1 = req.body.courseexam;

})




app.post("/exam", function (req, res) {




    var m = req.body.marks;
    var s = 0
    var total = 0;


    for (let i = 0; i < m.length; i++) {
        var x = m[i];
        s = parseInt(x, 10);
        total = total + s;
    }

    totalmarks = total;






    const addexam = new exam({
        title: req.body.title,
        description: req.body.description,
        question: req.body.question,
        marks: req.body.marks,
        option: req.body.option,
        answer: req.body.optionradio,
        totalscore: totalmarks,

    });

    addexam.save();

    fullcourse.find({ _id: examid1 }, function (err, finduser) {
        finduser[0].examid.push(addexam._id);
        finduser[0].save();
        
        res.render("onecourse", { ocourse: finduser,user: studentuser1, diff: loginid, done: buy });
    });
});





app.post("/startquiz", function (req, res) {

    var qid = req.body.quizid;
    var quizid1;
    fullcourse.findById(qid, function (err, examcoursefind) {


        quizid1 = examcoursefind.examid[0];

        exam.find({ _id: quizid1 }, function (err, examfind) {
            res.render("paper", { printexam: examfind });

        })
    })



})





app.post("/check", function (req, res) {



    var tid = req.body.submit;

    var quizans = req.body.optionradio;


    var ans = [];
    var mar = [];
    var total = 0;
    exam.find({ _id: tid }, function (err, quizfind) {

        ans = quizfind[0].answer;
        mar = quizfind[0].marks;

        var temp;
        for (let i = 0; i < ans.length; i++) {
            if (quizans[i] == ans[i]) {
                temp = parseInt(mar[i], 10)
                total = total + temp;
            }
        }
        achivemarks = total;

        const ures = new response({
            examid: tid,
            courseid: courseid1,
            userid: studentuser1[0]._id,
            userresponse: quizans,
            score: achivemarks,

        });



        ures.save();
        console.log(ures);
        console.log(ures._id);

        console.log(studentuser1[0]._id);
        console.log(studentuser1[0].mycourse.length);
        console.log(courseid1);

        for (let i = 0; i < studentuser1[0].mycourse.length; i++) {
            if (studentuser1[0].mycourse[i].courseid == courseid1) {


                studentuser1[0].mycourse[i].responseid = ures._id;
                studentuser1[0].save();
                console.log(studentuser1[0]);
            }

        }
    })
    fullcourse.find({ _id: courseid1 }, function (err, idfind) {
        coursebuy = 0;
        res.render("onecourse", { ocourse: idfind, diff: loginid, user: studentuser1, done: buy});
    })
})






app.post("/payment1", function (req, res) {

    if (studentuser1 == '') {
        var success = 1;
        res.render("frontpage", { smsg: success });
    }
    else {
        console.log(req.body.buy);


        studentuser1[0].mycourse.push({ courseid: req.body.buy, responseid: "" });

        buy = 1;
        console.log(studentuser1[0].mycourse);

        studentuser1[0].save();

        fullcourse.find({ _id: courseid1 }, function (err, idfind) {
            coursebuy = 0;
            res.render("onecourse", { ocourse: idfind, diff: loginid, user: studentuser1, done: buy });
        })
    }



})



app.post("/review", function (req, res) {
    var a = (req.body.review);
    var b = (req.body.reviewbtn);
    var rate = 0;
    console.log(courseid1);
    fullcourse.find({ _id: courseid1 }, function (err, idfind) {



        console.log(studentuser1);
        console.log(studentuser1[0].firstname);
        console.log(studentuser1[0].lastname);
        var luser = studentuser1[0].firstname + " " + studentuser1[0].lastname;
        console.log(luser);
        idfind[0].rating.push(b);

        idfind[0].review.push({ userid: studentuser1[0]._id, username: luser, feedback: a });

        if (idfind[0].rating.length == 0) {
            idfind[0].finalrating = b;
        }

        else {

            for (let i = 0; i < idfind[0].rating.length; i++) {
                rate = rate + idfind[0].rating[i];
            }
            idfind[0].finalrating = rate / idfind[0].rating.length;
        }
        idfind[0].save();
        console.log(idfind);
        coursebuy = 0;
        res.render("onecourse", { ocourse: idfind, diff: loginid, user: studentuser1, done: buy });
    })

})



app.post("/viewscore", function (req, res) {
    var resid = "";

    for (let i = 0; i < studentuser1[0].mycourse.length; i++) {
        if (studentuser1[0].mycourse[i].courseid == courseid1) {
            resid = studentuser1[0].mycourse[i].responseid;

            response.find({ _id: resid }, function (err, resfound) {

                var idexam = resfound[0].examid;
                console.log(resfound);

                exam.find({ _id: idexam }, function (err, examfound) {

                    console.log(examfound);


                    fullcourse.find({ _id: courseid1 }, function (err, idfind) {

                        res.render("score", { response: resfound, user: studentuser1, course: idfind, exam: examfound })
                    })
                })
            })


        }
    }



})



















app.listen(3000, () => {
    console.log("Server started at port 3000");
});