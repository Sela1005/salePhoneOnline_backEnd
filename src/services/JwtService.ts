import jwt, { VerifyErrors } from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

interface Payload {
    id: string;
    isAdmin: boolean;
}

const genneralAccessToken = (payload: Payload): string => {
    const access_token = jwt.sign({
        ...payload
    }, process.env.ACCESS_TOKEN as string, { expiresIn: '180s' });
    return access_token;
}

const genneralRefreshToken = (payload: Payload): string => {
    const refresh_token = jwt.sign({
        ...payload
    }, process.env.REFRESH_TOKEN as string, { expiresIn: '360d' });

    return refresh_token;
}

const refreshTokenJwtService = (token: string): Promise<{ status: string, message: string, access_token: string }> => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.REFRESH_TOKEN as string, (err: VerifyErrors | null, decoded: any) => {
            if (err) {
                return reject(err); // Trả về lỗi cụ thể nếu có lỗi trong quá trình xác thực token
            }
            
            const access_token = genneralAccessToken({
                id: (decoded as Payload).id,
                isAdmin: (decoded as Payload).isAdmin
            });
            
            resolve({
                status: "OK",
                message: "SUCCESS",
                access_token
            });
        });
    });
};

export {
    genneralAccessToken,
    genneralRefreshToken,
    refreshTokenJwtService
};
