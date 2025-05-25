import * as yup from 'yup';

export const verifyResetCodeSchema = yup.object().shape({
    verificationCode: yup
        .string()
        .required('Verification code is required')
        .matches(/^\d{6}$/, 'Verification code must be 6 digits')
}); 