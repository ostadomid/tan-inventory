import { z } from 'zod'

export const addOrderValidator = z.object({
  cardId: z.string({ error: 'card_id is required' }).min(3),
  count: z.number().int(),
  type: z.enum(['in', 'out']),
  orderedAt: z.string().min(10).max(10),
})
