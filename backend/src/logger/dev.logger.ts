import { Injectable, ConsoleLogger } from '@nestjs/common';

// Обёртка над ConsoleLogger для dev-окружения (LOGGER=dev)
@Injectable()
export class DevLogger extends ConsoleLogger {}