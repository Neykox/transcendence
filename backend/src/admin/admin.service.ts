import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Admin } from "./entities/admin.entity";
import { Repository } from "typeorm";
import { AdminDto } from "./dto/admin.dto";

@Injectable()
export class AdminService {
    constructor(
        @InjectRepository(Admin)
        private adminRepository : Repository<Admin>
    ) {}

    async getOne(channel: number, user: number): Promise<Admin> {
        return this.adminRepository.findOne({
            where: {
                channel,
                user
            }
        });
    }

    async getAll(channel: number): Promise<Admin[]> {
        return this.adminRepository.find({
            where: {
                channel
            }
        });
    }

    async setAdmin(adminDto: AdminDto) {
        const exist = await this.getOne(adminDto.channel, adminDto.user);
        if (exist === null)
            await this.adminRepository.save(adminDto);
    }

    async delete(adminDto: AdminDto) {
        const exist = await this.getOne(adminDto.channel, adminDto.user);
        if (exist !== null)
            await this.adminRepository.delete(exist.id);
    }

    async isAdmin(channel: number, user: number) {
        const banUser = await this.getOne(channel, user);
        if (!banUser)
            return false;
        return true;
    }
}