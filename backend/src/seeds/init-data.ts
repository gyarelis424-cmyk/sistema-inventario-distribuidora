import { DataSource } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../entities/user.entity';
import { Category } from '../entities/category.entity';
import { Unit } from '../entities/unit.entity';
import { Product } from '../entities/product.entity';
import { Supplier } from '../entities/supplier.entity';
import { Client } from '../entities/client.entity';
import { Configuration } from '../entities/configuration.entity';

export async function seedDatabase(dataSource: DataSource) {
  const userRepository = dataSource.getRepository(User);
  const categoryRepository = dataSource.getRepository(Category);
  const unitRepository = dataSource.getRepository(Unit);
  const productRepository = dataSource.getRepository(Product);
  const supplierRepository = dataSource.getRepository(Supplier);
  const clientRepository = dataSource.getRepository(Client);
  const configRepository = dataSource.getRepository(Configuration);

  const userCount = await userRepository.count();
  if (userCount > 0) return;

  const salt = await bcrypt.genSalt(10);
  const adminUser = userRepository.create({
    email: 'admin@distribuidora.com',
    names: 'Administrador',
    phone: '0987654321',
    passwordHash: await bcrypt.hash('password123', salt),
    role: 'Administrador',
    status: 'Activo',
  });
  await userRepository.save(adminUser);

  const categories = [
    { name: 'Abarrottes', description: 'Productos de consumo diario', status: 'Activo' },
    { name: 'Bebidas', description: 'Bebidas alcohólicas y no alcohólicas', status: 'Activo' },
    { name: 'Lácteos', description: 'Productos lácteos y derivados', status: 'Activo' },
    { name: 'Limpieza', description: 'Productos de limpieza del hogar', status: 'Activo' },
  ];

  const savedCategories = await categoryRepository.save(categories);

  const units = [
    { name: 'Unidad', abbreviation: 'und', description: 'Unidad básica', status: 'Activo' },
    { name: 'Kilogramo', abbreviation: 'kg', description: 'Medida de peso', status: 'Activo' },
    { name: 'Litro', abbreviation: 'L', description: 'Medida de volumen', status: 'Activo' },
    { name: 'Caja', abbreviation: 'caja', description: 'Empaque de caja', status: 'Activo' },
  ];

  const savedUnits = await unitRepository.save(units);

  const products = [
    {
      code: 'P001',
      name: 'Leche Entera 1L',
      price: 45.0,
      currentStock: 250,
      minimumStock: 50,
      description: 'Leche entera fresca',
      categoryId: savedCategories[2].id,
      unitId: savedUnits[0].id,
      status: 'Activo',
    },
    {
      code: 'P002',
      name: 'Arroz 5kg',
      price: 150.0,
      currentStock: 180,
      minimumStock: 50,
      description: 'Arroz blanco de calidad',
      categoryId: savedCategories[0].id,
      unitId: savedUnits[0].id,
      status: 'Activo',
    },
    {
      code: 'P003',
      name: 'Aceite Vegetal 1L',
      price: 85.0,
      currentStock: 320,
      minimumStock: 50,
      description: 'Aceite vegetal comestible de 1 litro',
      categoryId: savedCategories[0].id,
      unitId: savedUnits[0].id,
      status: 'Activo',
    },
    {
      code: 'P004',
      name: 'Azúcar 1kg',
      price: 38.0,
      currentStock: 400,
      minimumStock: 100,
      description: 'Azúcar granulada',
      categoryId: savedCategories[0].id,
      unitId: savedUnits[0].id,
      status: 'Activo',
    },
    {
      code: 'P005',
      name: 'Detergente 1kg',
      price: 70.0,
      currentStock: 150,
      minimumStock: 50,
      description: 'Detergente en polvo para ropa',
      categoryId: savedCategories[3].id,
      unitId: savedUnits[0].id,
      status: 'Activo',
    },
  ];

  await productRepository.save(products);

  const suppliers = [
    {
      name: 'Distribuidora La Fe',
      contact: 'Pedro Ramírez',
      phone: '0987654321',
      email: 'pedro@lafe.com',
      address: 'Managua, Nicaragua',
      paymentTerms: '30 días',
      status: 'Activo',
    },
    {
      name: 'Comercial ABC',
      contact: 'Ana Torres',
      phone: '0912345678',
      email: 'ana@abc.com',
      address: 'León, Nicaragua',
      paymentTerms: '15 días',
      status: 'Activo',
    },
    {
      name: 'Suministros del Norte',
      contact: 'Luis González',
      phone: '0988776655',
      email: 'luis@sdn.com',
      address: 'Estelí, Nicaragua',
      paymentTerms: '20 días',
      status: 'Activo',
    },
  ];

  await supplierRepository.save(suppliers);

  const clients = [
    {
      name: 'Supermercado La Familia',
      contact: 'Juan Carlos',
      phone: '0987742211',
      email: 'ventas@lafamilia.com',
      address: 'Managua, Nicaragua',
      creditLimit: 10000.0,
      creditUsed: 0,
      status: 'Activo',
    },
    {
      name: 'Tienda El Ahorro',
      contact: 'María López',
      email: 'info@losahorros.com',
      phone: '0987233448',
      address: 'Masaya, Nicaragua',
      creditLimit: 5000.0,
      creditUsed: 0,
      status: 'Activo',
    },
    {
      name: 'Minimarket Central',
      contact: 'Pedro Gómez',
      phone: '0987889900',
      email: 'pedro@minimarket.com',
      address: 'Granada, Nicaragua',
      creditLimit: 7500.0,
      creditUsed: 0,
      status: 'Activo',
    },
    {
      name: 'Comercial Rápido',
      contact: 'Carlos Ruiz',
      phone: '0986554433',
      email: 'contacto@rapido.com',
      address: 'Chinandega, Nicaragua',
      creditLimit: 3000.0,
      creditUsed: 0,
      status: 'Activo',
    },
  ];

  await clientRepository.save(clients);

  const config = configRepository.create({
    companyName: 'Distribuidora S.A.',
    ruc: '09999999900001',
    address: 'Av. Principal 123, Managua',
    phone: '0987654321',
    email: 'info@distribuidora.com',
    currency: 'NIO',
    timezone: 'America/Managua',
    timeFormat: '24h',
    dateFormat: 'dd/MM/yyyy',
  });

  await configRepository.save(config);

  console.log('✅ Base de datos inicializada correctamente');
}
