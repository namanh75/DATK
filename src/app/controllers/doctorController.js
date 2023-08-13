const user = require('../models/userModel')
const schedule = require('../models/scheduleModel')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const scheduleModel = require('../models/scheduleModel')
class doctorController {

    //list of doctor
    info(req, res, next) {
        user.find({ role: 2 })
            .then(doctors => {
                doctors = doctors.map(user => user.toObject())
                res.render('doctor/doctor', {
                    doctors: doctors
                })
            })
    }

    //form schedule
    schedule(req, res, next) {
        if (req.cookies.token) {
            jwt.verify(req.cookies.token, "nam", function (err, data) {
                if (err) {
                    console.log(err)
                    res.render('site/page404', {
                        layout: false,
                        massage: "Xác thực tài khoản thất bại"
                    })
                }
                else {
                    // var small=new user(data)
                    user.findOne({ account: data.account })
                        .then(userdata => {
                            userdata = userdata ? userdata.toObject() : userdata
                            user.findOne({ name: req.query.d })
                                .then(doctor => {
                                    doctor = doctor ? doctor.toObject() : doctor
                                    res.render('doctor/schedule', {
                                        doctor: doctor,
                                        userdata: userdata
                                    })
                                })
                                .catch(err => {
                                    console.error(err)
                                    res.render('site/page404', {
                                        layout: false,
                                        massage: "Có lỗi xảy ra ở sever"
                                    })
                                })
                        })
                        .catch(err => {
                            console.log(err)
                            res.render('site/page404', {
                                layout: false,
                                massage: "Không tìm thấy tài khoản trên hệ thống, hãy đăng ký!!!"
                            })
                        })
                    console.log(req.body)
                }
            })
        }
        else {
            res.render('site/page404', {
                layout: false,
                massage: "Bạn chưa đăng nhập. Hãy vui lòng đăng nhập"
            })
        }


    }

    //post book schedule
    book(req, res, next) {
        if (req.cookies.token) {
            jwt.verify(req.cookies.token, "nam", function (err, data) {
                if (err) {
                    console.log(err)
                    res.render('site/page404')
                }
                else {
                    user.findOne({ account: data.account })
                        .then(userdata => {
                            user.findOne({ name: req.query.d })
                                .then(doctordata => {
                                    var formData = req.body
                                    formData.username = userdata.name
                                    formData.doctorname = doctordata.name
                                    formData.accountuser = userdata.account
                                    console.log(formData)
                                    var small = new schedule(formData)
                                    small.save().then(success => {
                                        console.log('Lưu dữ liệu thành công')
                                        //send email to user
                                        const output = `
                                            <h3>Chi tiết đơn đặt lịch</h3>
                                            <p>Họ và tên : ${req.body.username}</p>
                                            <p>Ngày sinh : ${req.body.birthday}</p>
                                            <p>Địa chỉ : ${req.body.address}</p>
                                            <p>Bác sĩ khám : ${req.body.doctorname}</p>
                                            <p>Ngày khám: ${req.body.timeday} (${req.body.timehours})</p>
                                            <p>Mô tả bệnh : ${req.body.description}</p>
                                            <p>Nếu có bất kỳ thắc mắc nào, vui lòng liên hệ lại qua email này hoặc qua số điện thoại 0398790580</p>
                                        `
                                        let transporter = nodemailer.createTransport({
                                            // host: 'mail.hustcare.com',
                                            // port: 587,
                                            // secure: false, // true for 465, false for other ports
                                            service: "hotmail",
                                            auth: {
                                                user: 'anh.tn183687@sis.hust.edu.vn', // generated ethereal user
                                                pass: 'lqaYEM49'  // generated ethereal password
                                            },
                                            tls: {
                                                rejectUnauthorized: false
                                            }
                                        })

                                        let mailOptions = {
                                            from: '"HustCare Contact" <anh.tn183687@sis.hust.edu.vn>', // sender address
                                            to: req.body.email, // list of receivers
                                            subject: 'Thông báo chi tiết lịch hẹn khám bác sĩ', // Subject line
                                            text: 'Lịch khám bênh tại HustCare đã đăng ký quá email này', // plain text body
                                            html: output // html body
                                        };

                                        // send mail with defined transport object
                                        transporter.sendMail(mailOptions, (error, info) => {
                                            if (error) {
                                                return console.log(error);
                                            }
                                            console.log('Message sent: %s', info.messageId);
                                            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
                                        });
                                        res.redirect('/information')

                                    })
                                        .catch(err => { console.log(err) })


                                })
                                .catch(err => {
                                    console.log(err)
                                })
                        })
                        .catch(err => {
                            console.log(err)
                            res.send('vui lòng đăng ký')
                        })
                }
            })
        }
        else {
            res.send('vui lòng đăng nhập')
        }
    }

    deleteSchedule(req, res, next) {
        scheduleModel.deleteOne({ _id: req.params.scheduleId }, function (err, res) {
            if (err) console.error(err)
        })
    }
}

module.exports = new doctorController