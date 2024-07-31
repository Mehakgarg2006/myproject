var express = require("express");
var mysql2 = require("mysql2");
const nodemailer = require('nodemailer');
var fileuploader = require("express-fileupload");

let app = express();

app.listen(2736, function () {
    console.log("Server Started   :-)");
})
app.use(express.static("public"));
app.use(express.urlencoded(true));// converts binary form data to JSON Object

//88888888888888888888888888888888888888888888888
app.use(fileuploader());
/*let config = {
    host: "127.0.0.1",
    user: "root",
    password: "Mehak2703#",
    database: "project2024",
    dateStrings: true
}*/

let config = {
  host: "brnqynvegg2mywvz8bxi-mysql.services.clever-cloud.com",
  user: "upuxfaaoge9wymyw",
  password: "yn6pHbHGsRkt0xZ3V6sF",
  database: "brnqynvegg2mywvz8bxi",
  dateStrings: true,
  keepAliveInitialDelay: 10000,
  enableKeepAlive: true,
};



var mysql = mysql2.createConnection(config);
mysql.connect(function (err) {
    if (err == null)
        console.log("Connected To Database Successfulllyyyy");
    else
        console.log(err.message + "  ########");

})
//88888888888888888888888888888888888888888888888

app.get("/", function (req, resp) {
    let path = __dirname + "/public/index.html";
    resp.sendFile(path);

})

app.get("/sign-up-process", function (req, resp) {

    let email = req.query.signupEmail;
    let pwd = req.query.signupPwd;
    let utype = req.query.utype;

    mysql.query("insert into users values(?,?,?,?)", [email, pwd, utype, 1], function (err) {
        if (err)
            resp.send(err.message);
        else
            resp.send("SignUp Successful.");
    });


});

app.get("/check-user-existance", function (req, resp) {
    let email = req.query.signupEmail;

    mysql.query("select * from users where email=?", [email], function (err, resultJsonAry) {
        if (err != null) {
            resp.send(err.message);
            return;
        }
        if (resultJsonAry.length == 0)
            resp.send("Yes!! Available :-)");
        else
            resp.send("Sorrryy Alreadyy Taken... :-(");
    });

});

app.get("/login-process", function (req, resp) {

    let email = req.query.loginEmail;
    let pwd = req.query.loginPwd;

    console.log(req.query);

    mysql.query("select * from users where email=? and pwd=?", [email, pwd], function (err, resultJsonAry) {

        if (err != null) {
            resp.send(err.message);
            return;
        }

        console.log(resultJsonAry);

        if (resultJsonAry.length == 1) {
            console.log("affected rows == 1");

            if (resultJsonAry[0].statuss == 1)
                resp.send(resultJsonAry[0].utype);

            else
                resp.send("You are Blocked..");
        }
        else
            resp.send("Invalid ID and Password.");

    });


});


/*app.post("/Pic-upload-process",function(req,resp)
{
    if(req.files!=null)//check: file uploaded or not 
        {
            //console.log(req.files.ppic.name);
            let path=__dirname+"/public/uploads/"+req.files.ppic.name;
            req.files.ppic.mv(path); //mv: move-save at desiered location
        }
    else
    console.log("Pic is Not Uploaded");

    })
*/

app.get("/Client-Profile", function (req, resp) {
    let path = __dirname + "/public/client-profile.html";
    resp.sendFile(path);
})


app.post("/cli-Profile-process", function (req, resp) {
    console.log(req.body);
    let cemail = req.body.cemail;
    let cname = req.body.cname;
    let ccity = req.body.ccity;
    let cContact = req.body.cContact;
    let cstatus = req.body.cstatus;
    let other = req.body.other;

    mysql.query("insert into cprofile values(?,?,?,?,?,?)", [cemail, cname, ccity, cContact, cstatus, other], function (err) {
        if (err)
            resp.send(err.message);
        else
            resp.redirect("result1.html");
    });

})

app.get("/find-client-details", function (req, resp) {
    let email = req.query.email;

    mysql.query("select * from cprofile where cemail=?", [email], function (err, resultJsonAry) {
        if (err != null) {
            resp.send(err.message);
            return;

        }
        console.log(resultJsonAry);
        resp.send(resultJsonAry);//sending array of json object 0-1
    })

})


app.get("/client-update", function (req, resp) {
    console.log(req.query);
    let cemail = req.query.cemail;
    let coldpass = req.query.coldpass;
    let cnewpass = req.query.cnewpass;
    let creppass = req.query.creppass;

    if (cnewpass != creppass) {
        resp.send("New Password and confirm password don't match.");
        return;
    }

    mysql.query("update users set pwd=? where email=? and pwd=?", [cnewpass, cemail, coldpass], function (err, res) {

        if (err != null)
            resp.send(err.message);
        else {
            if (res.affectedRows == 0) {
                resp.send("Invalid ID and Password.");
            }
            else
                resp.send("Password Updated Successfully.");

        }
    })

});

app.post("/cProfile-Update", function (req, resp) {
    console.log(req.body);
    let cemail = req.body.cemail;
    let cname = req.body.cname;
    let ccity = req.body.ccity;
    let cContact = req.body.cContact;
    let cstatus = req.body.cstatus;
    let other = req.body.other;



    //req.body.ppic=fileName;
    //resp.send(req.body);

    //plz use Table wale columns ke NAAAMMMM
    mysql.query("update cProfile set cname=?,ccity=?,cContact=?,cstatus=?,other=? where cemail=?", [cname, ccity, cContact, cstatus, other, cemail], function (err, result) {
        if (err == null)//no error
        {
            if (result.affectedRows >= 1)
                resp.redirect("result1.html");
            else
                resp.send("Invalid Email ID");
        }
        else
            resp.send(err.message);
    })

})

//***************************************************************** */
app.get("/Inf-Profile", function (req, resp) {
    let path = __dirname + "/public/Inf-Profile.html";
    resp.sendFile(path);

})

app.post("/Inf-Profile-process", function (req, resp) {

    console.log(req.body);
    let email = req.body.email;
    let Iname = req.body.Iname;
    let address = req.body.address;
    let Gender = req.body.Gender;
    let dob = req.body.dob;
    let city = req.body.city;
    let Contact = req.body.Contact;
    let field = req.body.field;
    let Instagram = req.body.Instagram;
    let youtube = req.body.youtube;
    let Other = req.body.Other;
    let Facebook = req.body.Facebook;

    let fileName = "";
    if (req.files != null) {
        fileName = req.files.picpath.name;
        let path = __dirname + "/public/uploads/" + fileName;
        req.files.picpath.mv(path);
    }
    else {
        fileName = req.body.hdn;
    }


    mysql.query("insert into IProfile values(?,?,?,?,?,?,?,?,?,?,?,?,?)", [email, Iname, Gender, dob, address, city, Contact, field, Instagram, Facebook, youtube, Other, fileName], function (err) {
        if (err)
            resp.send(err.message);
        else
            resp.redirect("result1.html");
    });


});

app.get("/find-user-details", function (req, resp) {
    let email = req.query.email;

    mysql.query("select * from IProfile where email=?", [email], function (err, resultJsonAry) {
        if (err != null) {
            resp.send(err.message);
            return;

        }
        console.log(resultJsonAry);
        resp.send(resultJsonAry);//sending array of json object 0-1
    })

})

app.post("/IProfile-Update", function (req, resp) {
    console.log(req.body);
    let email = req.body.email;
    let Iname = req.body.Iname;
    let address = req.body.address;
    let Gender = req.body.Gender;
    let dob = req.body.dob;
    let city = req.body.city;
    let Contact = req.body.Contact;
    let field = req.body.field;
    let Instagram = req.body.Instagram;
    let youtube = req.body.youtube;
    let Other = req.body.Other;
    let Facebook = req.body.Facebook;

    let fileName = "";
    if (req.files != null) {
        fileName = req.files.picpath.name;
        let path = __dirname + "/public/uploads/" + fileName;
        req.files.picpath.mv(path);
    }
    else {
        fileName = req.body.hdn;
    }

    //req.body.ppic=fileName;
    //resp.send(req.body);

    //plz use Table wale columns ke NAAAMMMM
    mysql.query("update IProfile set Iname=?,Gender=?,dob=?,address=?,city=?,Contact=?,field=?,Instagram=?,Facebook=?,youtube=?,Other=?,picpath=?  where email=?", [Iname, Gender, dob, address, city, Contact, field, Instagram, Facebook, youtube, Other, fileName, email], function (err, result) {
        if (err == null)//no error
        {
            if (result.affectedRows >= 1)
                resp.redirect("result.html");
            else
                resp.send("Invalid Email ID");
        }
        else
            resp.send(err.message);
    })

})
app.get("/Inf-post-bookings", function (req, resp) {

    console.log(req.query);
    let email = req.query.email;
    let eventt = req.query.eventt;
    let doe = req.query.doe;
    let toe = req.query.toe;
    let city = req.query.city;
    let Venue = req.query.Venue;




    mysql.query("insert into eventss values(null,?,?,?,?,?,?)", [email, eventt, doe, toe, city, Venue], function (err) {
        if (err)
            resp.send(err.message);
        else
            resp.send("Bookings saved");
    });


});

app.get("/inf-update", function (req, resp) {
    console.log(req.query);
    let emaill = req.query.emaill;
    let oldpass = req.query.oldpass;
    let newpass = req.query.newpass;
    let reppass = req.query.reppass;

    if (newpass != reppass) {
        resp.send("New Password and confirm password don't match.");
        return;
    }

    mysql.query("update users set pwd=? where email=? and pwd=?", [newpass, emaill, oldpass], function (err, res) {

        if (err != null)
            resp.send(err.message);
        else {
            if (res.affectedRows == 0) {
                resp.send("Invalid ID and Password.");
            }
            else
                resp.send("Password Updated Successfully.");

        }
    })

});


app.get("/Forgot-Password", function (req, resp) {
    console.log("HELLO");
    let email = req.query.loginEmail;

    console.log(req.query);

    mysql.query("select * from users where email=?", [email], function (err, result) {
        // console.log(result);

        if (err)
            resp.send(err.message);

        else if (result.length == 0)
            resp.send("Invalid ID");

        else {
            // console.log(result);

            const transporter = nodemailer.createTransport({
                service: 'gmail', // Use Gmail as the email service
                auth: {
                    user: 'gmehak2736@gmail.com', // Your Gmail email address
                    pass: 'crew gpjq tual zppf' // Your Gmail password
                },
                tls: {
                    rejectUnauthorized: false
                }
            });

            const mailOptions = {
                from: "gmehak2736@gmail.com", // Sender's email address
                to: email, // Recipient's email address
                subject: "Forgot Password", // Subject line
                text: "Your Password is " + result[0].pwd + ". Use this to Login into your account." // Plain text body
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log(error);
                    resp.send(error.message);
                } else {
                    console.log("Email Sent");
                    resp.send("Email sent: ");
                }
            });
        }

    });
})
//************************************************ /////////////////////////////////////////////////////////


app.get("/admin-dash", function (req, resp) {

    let path = __dirname + "/public/admin-dash.html";
    resp.sendFile(path);

});

app.get("/admin-user", function (req, resp) {

    let path = __dirname + "/public/admin-users.html";
    resp.sendFile(path);

});

app.get("/fetch-all", function (req, resp) {
    mysql.query("select * from users", function (err, resultJsonAry) {
        if (err != null) {
            resp.send(err.message);
            return;

        }
        resp.send(resultJsonAry);
    })

})
app.get("/del-one", function (req, resp) {
    mysql.query("delete from users where email=?", [req.query.email], function (err, resultJsonAry) {
        if (err != null) {
            resp.send(err.message);
            return;

        }
        resp.send("Deleted");

    })
});

app.get("/block-one", function (req, resp) {
    mysql.query("update users set statuss=? where email=?", [0, req.query.email], function (err, resultJsonAry) {
        if (err != null) {
            resp.send(err.message);
            return;

        }
        // console.log(resultJsonAry);
        resp.send("User is Blocked");

    })
});

app.get("/resume-one", function (req, resp) {
    mysql.query("update users set statuss=? where email=?", [1, req.query.email], function (err, resultJsonAry) {
        if (err != null) {
            resp.send(err.message);
            return;

        }
        // console.log(resultJsonAry);
        resp.send("User is Unblocked");

    })
});

app.get("/inf-console", function (req, resp) {
    let path = __dirname + "/public/admin-all-influ.html";
    resp.sendFile(path);
});

app.get("/fetch-all-inf", function (req, resp) {
    mysql.query("select * from IProfile", function (err, resultJsonAry) {
        if (err != null) {
            resp.send(err.message);
            return;

        }
        resp.send(resultJsonAry);
    })

});



app.get("/find-influ", function (req, resp) {
    let path = __dirname + "/public/influ-finder.html";
    resp.sendFile(path);
});

app.get("/get-city", function (req, resp) {
    let field = "%" + req.query.txtField + "%";
    // console.log(field);

    mysql.query("select distinct city from IProfile where field like ?", [field], function (err, res) {

        if (err) {
            resp.send(err.message);
            return;
        }

        resp.send(res);
    });

});



app.get("/get-inf", function (req, resp) {
    let field = "%" + req.query.txtField + "%";
    let city = req.query.selCity;

    // console.log(field);
    // console.log(city);

    mysql.query("select * from IProfile where field like ? and city=?", [field, city], function (err, res) {

        if (err) {
            resp.send(err.message);
            return;
        }

        // console.log(res);
        resp.send(res);
    });

});

app.get("/get-inf-by-name", function (req, resp) {

    let name = req.query.txtName;

    // console.log(field);
    // console.log(city);

    mysql.query("select * from IProfile where Iname=?", [name], function (err, res) {

        if (err) {
            resp.send(err.message);
            return;
        }

        // console.log(res);
        resp.send(res);
    });

});

app.get("/event-manager", function (req, resp) {
    let path = __dirname + "/public/events-manager.html";
    resp.sendFile(path);
});

//******************************************************************************************************** */
app.get("/fetch-all-events", function (req, resp) {
    let email = req.query.emailTxt;
    console.log(email);

    mysql.query("select * from eventss where doe >= current_date() and email = ?", [email], function (err, resultJsonAry) {
        if (err != null) {
            resp.send(err.message);
            return;

        }
        resp.send(resultJsonAry);
    })

});
app.get("/del-one-event", function (req, resp) {
    mysql.query("delete from eventss where rid=?", [req.query.rid], function (err, resultJsonAry) {
        if (err != null) {
            resp.send(err.message);
            return;

        }
        resp.send("Deleted");

    })
});

