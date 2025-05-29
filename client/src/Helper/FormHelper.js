import Swal from 'sweetalert2';

const EmailRegx = /\S+@\S+\.\S+/;
const OnlyNumberRegx = /^-?[0-9]+(?:\.[0-9]+)?$/;
const MobileRegx = /(^(\+88|0088)?(01){1}[3456789]{1}(\d){8})$/;

class FormHelper {
    IsEmpty(value) {
        return value === undefined || value === null || value.length === 0;
    }

    IsMobile(value) {
        return MobileRegx.test(value);
    }

    IsEmail(value) {
        return EmailRegx.test(value);
    }

    IsNumber(value) {
        return OnlyNumberRegx.test(value);
    }

    ErrorToast(msg) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: msg,
            position: "center"
        });
    }

    SuccessToast(msg) {
        Swal.fire({
            icon: 'success',
            title: 'Success',
            text: msg,
            position: "center"
        });
    }

    getBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    }
}

const formHelper = new FormHelper();

export const {
    IsEmpty,
    IsMobile,
    IsNumber,
    IsEmail,
    ErrorToast,
    getBase64,
    SuccessToast
} = formHelper;
