import { BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';

export class ValidationService {
  /**
   * Validate email format
   */
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate phone format (nicaraguan format)
   */
  static isValidPhone(phone: string): boolean {
    const phoneRegex = /^(\+505)?[0-9]{8}$/;
    return phoneRegex.test(phone.replace(/-/g, ''));
  }

  /**
   * Check if entity exists by ID
   */
  static async entityExists(
    repository: Repository<any>,
    id: string,
    entityName: string
  ): Promise<any> {
    const entity = await repository.findOne({ where: { id } });
    if (!entity) {
      throw new BadRequestException(`${entityName} no encontrado`);
    }
    return entity;
  }

  /**
   * Check if entity already exists (unique field)
   */
  static async entityNotExists(
    repository: Repository<any>,
    field: string,
    value: string,
    entityName: string
  ): Promise<void> {
    const entity = await repository.findOne({ where: { [field]: value } });
    if (entity) {
      throw new BadRequestException(`${entityName} con este ${field} ya existe`);
    }
  }

  /**
   * Validate quantity is positive
   */
  static validateQuantity(quantity: number, fieldName: string = 'Cantidad'): void {
    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new BadRequestException(`${fieldName} debe ser un número entero positivo`);
    }
  }

  /**
   * Validate price is valid
   */
  static validatePrice(price: number, fieldName: string = 'Precio'): void {
    if (typeof price !== 'number' || price < 0) {
      throw new BadRequestException(`${fieldName} debe ser un número válido no negativo`);
    }
  }

  /**
   * Validate stock is sufficient
   */
  static validateStockSufficient(
    currentStock: number,
    requiredQuantity: number,
    productName: string
  ): void {
    if (currentStock < requiredQuantity) {
      throw new BadRequestException(
        `Stock insuficiente para ${productName}. Disponible: ${currentStock}, Requerido: ${requiredQuantity}`
      );
    }
  }

  /**
   * Validate minimum stock requirements
   */
  static validateMinimumStock(
    currentStock: number,
    minimumStock: number,
    productName: string
  ): boolean {
    return currentStock <= minimumStock;
  }

  /**
   * Validate date is not in future
   */
  static validateDateNotFuture(date: Date, fieldName: string = 'Fecha'): void {
    const now = new Date();
    if (date > now) {
      throw new BadRequestException(`${fieldName} no puede ser en el futuro`);
    }
  }

  /**
   * Validate required field
   */
  static validateRequired(value: any, fieldName: string): void {
    if (!value || value.toString().trim() === '') {
      throw new BadRequestException(`${fieldName} es requerido`);
    }
  }

  /**
   * Validate string length
   */
  static validateStringLength(
    value: string,
    minLength: number,
    maxLength: number,
    fieldName: string
  ): void {
    if (value.length < minLength || value.length > maxLength) {
      throw new BadRequestException(
        `${fieldName} debe tener entre ${minLength} y ${maxLength} caracteres`
      );
    }
  }

  /**
   * Validate date range
   */
  static validateDateRange(startDate: Date, endDate: Date, fieldName: string = 'Rango de fechas'): void {
    if (startDate > endDate) {
      throw new BadRequestException(`${fieldName}: la fecha inicial no puede ser mayor que la final`);
    }
  }

  /**
   * Validate array is not empty
   */
  static validateArrayNotEmpty(array: any[], fieldName: string = 'Array'): void {
    if (!Array.isArray(array) || array.length === 0) {
      throw new BadRequestException(`${fieldName} no puede estar vacío`);
    }
  }

  /**
   * Validate document number format
   */
  static isValidDocumentNumber(docNumber: string): boolean {
    const docRegex = /^[A-Z0-9\-\/]{3,30}$/;
    return docRegex.test(docNumber);
  }

  /**
   * Validate RUC format (nicaraguan)
   */
  static isValidRUC(ruc: string): boolean {
    const rucRegex = /^[0-9]{14}$/;
    return rucRegex.test(ruc.replace(/-/g, ''));
  }

  /**
   * Validate product code format
   */
  static isValidProductCode(code: string): boolean {
    const codeRegex = /^[A-Z0-9\-]{3,20}$/;
    return codeRegex.test(code);
  }
}
