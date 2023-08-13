const user = require("../models/userModel");
const jwt = require("jsonwebtoken");
const schedule = require("../models/scheduleModel");
const multer  = require('multer')

var storage = multer.diskStorage({
  destination: function(req, file, callback) {
      callback(null, 'src/public/uploads' )
  },
  filename: function(req, file, callback) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      callback(null, uniqueSuffix + '-' + file.originalname )
  }
})
var upload = multer({
  storage: storage,
  limits: {
    fileSize: 4 * 1024 * 1024,
  }
}).single('avatar')

class infoController {
  // info of user
  info(req, res, next) {
    if (req.cookies.token) {
      jwt.verify(req.cookies.token, "nam", function (err, datatoken) {
        if (err) {
          console.error(err);
          res.render("site/page404", {
            layout: false,
            massage: "Xác thực tài khoản thất bại",
          });
        } else {
          user
            .findOne({ account: datatoken.account })
            .then((userdata) => {
              userdata = userdata ? userdata.toObject() : userdata;
              if (userdata.role == 1 || userdata.role==3 ) {
                schedule
                  .find({ accountuser: userdata.account })
                  .then((schedules) => {
                    schedules = schedules.map((schedule) =>
                      schedule.toObject()
                    );
                    res.render("information/userInformation", {
                      userdata: userdata,
                      schedules: schedules,
                    });
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              }
              if(userdata.role == 2){
                schedule
                  .find({ doctorname: userdata.name })
                  .then((schedules) => {
                    schedules = schedules.map((schedule) =>
                      schedule.toObject()
                    )
                    res.render("information/userInformation", {
                      userdata: userdata,
                      schedules: schedules,
                    })
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              }
            })
            .catch((err) => {
              console.error(err);
              res.render("site/page404", {
                layout: false,
                massage:
                  "Không tìm thấy dữ liệu người dùng. Hãy thử đăng nhập lại hoặc đăng ký",
              });
            });
        }
      });
    } else {
      res.redirect("/");
    }
  }

  //update information
  update(req, res, next) {
    jwt.verify(req.cookies.token, "nam", function (err, tokendata) {
      if (err) {
        console.error(err);
        res.send("xác thực tài khoản thất bại, vui lòng đăng nhập lại");
      } else {
        user
          .findOne({ account: tokendata.account })
          .then((userdata) => {
            user
              .updateOne({ account: userdata.account }, req.body)
              .then((data) => {
                console.log("Update thành công");
                console.log(data);
                res.redirect("/information");
              })
              .catch((err) => {
                console.error(err);
                res.render("site/page404", {
                  massage: "đã có lỗi xảy ra với sever",
                });
              });
          })
          .catch((err) => console.error(err));
      }
    });
  }

  //uploadAvatar
  uploadAvatar(req, res, next) {
    jwt.verify(req.cookies.token, "nam", function (err, tokendata) {
      if (err) {
        console.error(err);
        res.send("xác thực tài khoản thất bại, vui lòng đăng nhập lại");
      } else {
        user
          .findOne({ account: tokendata.account })
          .then((userdata) => {
            upload(req, res, function(err){
              if(err) {
                  console.log(err)
                  return res.end('err')
              }
              console.log('Upload successfully')
              console.log(req.file)
              user
                .updateOne({ account: userdata.account }, {'avatar': req.file.filename})
                .then((data) => {
                  console.log("Update thành công");
                  console.log(data);
                  res.redirect('/information')
                })
                .catch((err) => {
                  console.error(err);
                  res.render("site/page404", {
                    massage: "đã có lỗi xảy ra với sever",
                });
              });
            })
            
          })
          .catch((err) => console.error(err));
      }
    });
    
  }
}

module.exports = new infoController();
