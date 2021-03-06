const { check } = require('express-validator');

module.exports = {
    validUpdateProfile: [
        check('name')
            .not()
            .isEmpty()
            .withMessage('Họ tên bắt buộc')
            .trim()
            .isLength({ max: 60 })
            .withMessage('Tên nhiều nhất 60 ký tự')
            .isLength({ min: 5 })
            .withMessage('Họ tên ít nhất 5 ký tự'),
        check('email')
            .notEmpty()
            .withMessage('Email không được rỗng')
            .isEmail()
            .normalizeEmail()
            .withMessage('Email không phù hợp')
    ],
    validRegister: [
        check('username')
            .isLength({ max: 20 })
            .withMessage('tên nguời dùng nhiều nhất 20 ký tự'),
        check('password')
            .not()
            .isEmpty()
            .withMessage('mật khẩu bắt buộc')
            .isLength({ min: 5 })
            .withMessage('mật khẩu ít nhất 5 ký tự')
            .matches(/\d/)
            .withMessage('mật khẩu phải chứa 1 chữ số')
            .not()
            .isIn(['12345', '123456', 'password'])
            .withMessage('mật khẩu không được đơn giản, vd: 12345, 123456, ...'),
        check('name')
            .not()
            .isEmpty()
            .withMessage('Họ tên bắt buộc')
            .trim()
            .isLength({ max: 60 })
            .withMessage('Tên nhiều nhất 60 ký tự')
            .isLength({ min: 5 })
            .withMessage('Họ tên ít nhất 5 ký tự'),
        check('email')
            .isEmail()
            .normalizeEmail()
            .withMessage('Email không phù hợp'),
        check('address')
            .not()
            .isEmpty()
            .withMessage('Địa chỉ bắt buộc')
    ],
    validChangePassword: [
        check('oldPassword')
            .not()
            .isEmpty()
            .withMessage('mật khẩu bắt buộc'),
        check('newPassword')
            .not()
            .isEmpty()
            .withMessage('mật khẩu mới bắt buộc')
            .isLength({ min: 5 })
            .withMessage('mật khẩu mới ít nhất 5 ký tự')
            .matches(/\d/)
            .withMessage('mật khẩu mới phải chứa 1 chữ số')
            .not()
            .isIn(['12345', '123456', 'password'])
            .withMessage('mật khẩu không được đơn giản, vd: 12345, 123456, ...'),
        check('re_newPassword')
            .custom((value, { req }) => {
                if (value !== req.body.newPassword) {
                    // throw error if passwords do not match
                    throw new Error("Nhập lại mật  khẩu mới không đúng");
                } else {
                    return value;
                }
            })
    ],
    validResetPassword: [
        check('newPassword')
            .not()
            .isEmpty()
            .withMessage('mật khẩu mới bắt buộc')
            .isLength({ min: 5 })
            .withMessage('mật khẩu mới ít nhất 5 ký tự')
            .matches(/\d/)
            .withMessage('mật khẩu mới phải chứa 1 chữ số')
            .not()
            .isIn(['12345', '123456', 'password'])
            .withMessage('mật khẩu không được đơn giản, vd: 12345, 123456, ...'),
        check('re_newPassword')
            .custom((value, { req }) => {
                if (value !== req.body.newPassword) {
                    // throw error if passwords do not match
                    throw new Error("Nhập lại mật  khẩu mới không đúng");
                } else {
                    return value;
                }
            })
    ]
}