import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

//the global decorator is responsible for providing the module the globally  and  make sure your module should be import in next main module
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
