import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';

@Catch()
export class HttpFilter<T> implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost) {}
}
