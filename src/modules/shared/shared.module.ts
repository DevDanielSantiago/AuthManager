import { Module } from '@nestjs/common';
import { TransactionManager } from 'src/common/managers';

@Module({
  providers: [TransactionManager],
  exports: [TransactionManager],
})
export class SharedModule {}
