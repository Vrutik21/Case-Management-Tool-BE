import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Access_level } from '@prisma/client';
import { CreateCaseDto } from './dto/case.dto';
import { prismaError } from 'src/shared/error-handling';

@Injectable()
export class CaseService {
  constructor(private readonly prisma: PrismaService) {}

  // Find a case by ID
  async findCaseById(id: string) {
    return this.prisma.case.findUnique({
      where: { id },
      include: { client: true, tasks: true },
    });
  }

  // Assign a user access to a case
  async assignCaseAccess(user_id: string, case_id: string, access_level: Access_level) {
    return this.prisma.case_access.create({
      data: {
        user_id,
        case_id,
        access_level,
      },
    });
  }

  async getCasesForUser(user_id: string) {
    return this.prisma.case_access.findMany({
      where: { user_id },
      include: { case: true },
    });
  }

  async createCase(dto: CreateCaseDto) {
    try {
      const { client_id, case_manager_id, service_id, start_at, region, status } = dto;
      return this.prisma.case.create({
        data: {
          client_id,
          case_manager_id,
          service_id,
          start_at,
          region,
          status,
        },
      });
    } catch (err) {
      prismaError(err);
    }
  }
}