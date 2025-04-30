import fs from 'fs';
import { mockUser1 } from '@mocks/models';
import * as emailHelper from '@src/helpers/email';
import { User } from '@src/models';
import nodemailer from 'nodemailer';

const mockTemplate = {
    main: '<html>{{SUMMARY}}{{HEADER}}{{BODY}}{{FOOTER}}</html>',
    header: '<header></header>',
    body: '<body>{{CONTENT}}</body>',
    footer: '<footer></footer>',
    button: '<button>{{TEXT}}{{URL}}{{SIZE}}</button>'
};

jest.mock('fs', () => ({
    readFileSync: jest.fn().mockImplementation((file: string) => {
        if (file.includes('main.html')) return mockTemplate.main;
        if (file.includes('header.html')) return mockTemplate.header;
        if (file.includes('body.html')) return mockTemplate.body;
        if (file.includes('footer.html')) return mockTemplate.footer;
        if (file.includes('button.html')) return mockTemplate.button;
        return '';
    })
}));
jest.mock('path', () => ({
    join: jest.fn((...args: string[]) => args.join('/')),
    resolve: jest.fn((...args: string[]) => args.join('/'))
}));
jest.mock('nodemailer');

const mockUser: User = mockUser1();
const sendMailMock = jest.fn().mockResolvedValue(undefined);

describe('email helper', () => {
    beforeEach(() => {
        jest.resetModules();
        process.env.EMAIL_PASSWORD = 'pw';
        process.env.CLIENT_URL = 'https://client.com';
        (nodemailer.createTransport as jest.Mock).mockReturnValue({ sendMail: sendMailMock });
        sendMailMock.mockClear();
        (fs.readFileSync as jest.Mock).mockClear();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should handle error when loading template fails for sendValidateEmail', async () => {
        (fs.readFileSync as jest.Mock).mockImplementationOnce(() => { throw new Error('fail'); });

        await expect(emailHelper.sendValidateEmail(mockUser)).rejects.toThrow('fail');
    });

    it('should handle error when loading template fails for sendResetPasswordEmail', async () => {
        (fs.readFileSync as jest.Mock).mockImplementationOnce(() => { throw new Error('fail'); });

        await expect(emailHelper.sendResetPasswordEmail(mockUser)).rejects.toThrow('fail');
    });

    it('should handle error when loading template fails for sendContactEmail', async () => {
        (fs.readFileSync as jest.Mock).mockImplementationOnce(() => { throw new Error('fail'); });

        await expect(emailHelper.sendContactEmail('Alice', 'Hello there!')).rejects.toThrow('fail');
    });

    it('should throw a string error when loading template fails with non-Error for sendValidateEmail', async () => {
        (fs.readFileSync as jest.Mock).mockImplementationOnce(() => { throw 'fail-string'; });

        await expect(emailHelper.sendValidateEmail(mockUser)).rejects.toThrow('Error loading email template');
    });

    it('should throw a string error when loading template fails with non-Error for sendResetPasswordEmail', async () => {
        (fs.readFileSync as jest.Mock).mockImplementationOnce(() => { throw 'fail-string'; });

        await expect(emailHelper.sendResetPasswordEmail(mockUser)).rejects.toThrow('Error loading email template');
    });

    it('should throw a string error when loading template fails with non-Error for sendContactEmail', async () => {
        (fs.readFileSync as jest.Mock).mockImplementationOnce(() => { throw 'fail-string'; });

        await expect(emailHelper.sendContactEmail('Alice', 'Hello there!')).rejects.toThrow('Error loading email template');
    });

    it('should load email template from files if not cached', async () => {
        await emailHelper.sendValidateEmail(mockUser);

        expect(fs.readFileSync).toHaveBeenCalledTimes(5);
    });

    it('should send validate email with correct content', async () => {
        await emailHelper.sendValidateEmail(mockUser);

        expect(nodemailer.createTransport).toHaveBeenCalled();
        expect(sendMailMock).toHaveBeenCalledWith(expect.objectContaining({
            from: 'noreply@gfaiers.com',
            to: mockUser.email,
            subject: 'Validate Email',
            text: 'Click the link to validate your email',
            html: expect.stringContaining('Validate Email')
        }));
    });

    it('should send validate email with correct content', async () => {
        process.env.CLIENT_URL = undefined;
        mockUser.validateToken = undefined;
        mockUser.validateTokenExpires = undefined;
        await emailHelper.sendValidateEmail(mockUser);

        expect(nodemailer.createTransport).toHaveBeenCalled();
        expect(sendMailMock).toHaveBeenCalledWith(expect.objectContaining({
            from: 'noreply@gfaiers.com',
            to: mockUser.email,
            subject: 'Validate Email',
            text: 'Click the link to validate your email',
            html: expect.stringContaining('Validate Email')
        }));
    });

    it('should send reset password email with correct content', async () => {
        await emailHelper.sendResetPasswordEmail(mockUser);

        expect(nodemailer.createTransport).toHaveBeenCalled();
        expect(sendMailMock).toHaveBeenCalledWith(expect.objectContaining({
            from: 'noreply@gfaiers.com',
            to: mockUser.email,
            subject: 'Password Reset',
            text: 'Click the link to reset your password',
            html: expect.stringContaining('Reset Password')
        }));
    });

    it('should send reset password email with correct content', async () => {
        process.env.CLIENT_URL = undefined;
        mockUser.resetToken = undefined;
        mockUser.resetTokenExpires = undefined;
        await emailHelper.sendResetPasswordEmail(mockUser);

        expect(nodemailer.createTransport).toHaveBeenCalled();
        expect(sendMailMock).toHaveBeenCalledWith(expect.objectContaining({
            from: 'noreply@gfaiers.com',
            to: mockUser.email,
            subject: 'Password Reset',
            text: 'Click the link to reset your password',
            html: expect.stringContaining('Reset Password')
        }));
    });

    it('should send contact email with correct content', async () => {
        await emailHelper.sendContactEmail('Alice', 'Hello there!');

        expect(nodemailer.createTransport).toHaveBeenCalled();
        expect(sendMailMock).toHaveBeenCalledWith(expect.objectContaining({
            from: 'noreply@gfaiers.com',
            to: 'info@gfaiers.com',
            subject: 'Alice: Contact Form',
            text: 'Hello there!',
            html: expect.stringContaining('Contact Form')
        }));
    });
});
