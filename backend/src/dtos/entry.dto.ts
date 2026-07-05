import { IsNumber, IsString, IsArray, IsOptional } from 'class-validator';

export class CreateEntryDto {
  @IsString()
  document: string;

  @IsNumber()
  supplierId: number;

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

export class UpdateEntryDto {
  @IsString()
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
