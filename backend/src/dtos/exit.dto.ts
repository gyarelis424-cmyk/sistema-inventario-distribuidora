import { IsNumber, IsString, IsArray, IsOptional } from 'class-validator';

export class CreateExitDto {
  @IsString()
  document: string;

  @IsNumber()
  clientId: number;

  @IsArray()
  items: Array<{
    productId: number;
    quantity: number;
    unitPrice: number;
  }>;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class UpdateExitDto {
  @IsString()
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
