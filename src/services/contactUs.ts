import { prisma } from '../prisma/client';

export const ContactusService = {
    async createContactUs(fullname: string, workemail: string, phonenumber: string, catergory: string, message: string, findus: string
    ) {
        return await prisma.contactUS.create({
            data: {
                fullname,
                workemail,
                phonenumber,
                catergory,
                message,
                findus
            },
        });
    },
};