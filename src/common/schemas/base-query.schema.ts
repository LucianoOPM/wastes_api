import { z, ZodObject, ZodRawShape } from 'zod';

type Writable<T> = { -readonly [P in keyof T]: T[P] };

export class BaseQuerySchemaBuilder {
  static baseSchema = z.object({
    limit: z.coerce
      .number({ message: 'Limit should be a valid number' })
      .int({ message: 'Limit should be a valid integer' })
      .min(1, { message: 'Limit should be at least 1' })
      .max(100, { message: 'Limit cannot exceed 100' })
      .default(10),
    page: z.coerce
      .number({ message: 'Page should be a valid number' })
      .int({ message: 'Page should be a valid integer' })
      .min(1, { message: 'Page should be at least 1' })
      .default(1),
    order: z.enum(['asc', 'desc']).default('asc'),
  });

  /**
   * Construye un esquema de filtro combinando el esquema base con propiedades adicionales.
   * @param additionalShape - Un objeto con propiedades adicionales específicas del filtro
   */
  static extendWith<T extends ZodRawShape>(additionalShape: T) {
    return this.baseSchema.extend(additionalShape);
  }

  /**
   * Método especial para construir filtros con un `orderBy` específico
   * @param orderByFields - Lista de campos ordenables
   * @param extraFields - Campos adicionales del filtro
   */
  static buildFilterSchema<F extends Readonly<[string, ...string[]]>, T extends ZodRawShape = ZodRawShape>(
    orderByFields: F,
    extraFields?: T,
  ): ZodObject<T & typeof BaseQuerySchemaBuilder.baseSchema.shape & { orderBy: z.ZodEnum<Writable<F>> }> {
    const orderBySchema = {
      orderBy: z.enum(orderByFields).default(orderByFields[0]),
    };

    return this.baseSchema.extend(orderBySchema).extend(extraFields || ({} as T)) as unknown as ZodObject<
      T & typeof BaseQuerySchemaBuilder.baseSchema.shape & { orderBy: z.ZodEnum<Writable<F>> }
    >;
  }
}
