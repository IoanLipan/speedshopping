import { db } from '../config/firebase.js'
import type { SupplyItem } from '../types/index.js'

const COLLECTION = 'supplyItems'

export class SupplyService {
  async getAll(userId: string): Promise<SupplyItem[]> {
    const snapshot = await db
      .collection(COLLECTION)
      .where('userId', '==', userId)
      .get()

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      lastUpdated: doc.data().lastUpdated?.toDate(),
    })) as SupplyItem[]
  }

  async getById(id: string, userId: string): Promise<SupplyItem | null> {
    const doc = await db.collection(COLLECTION).doc(id).get()

    if (!doc.exists || doc.data()?.userId !== userId) {
      return null
    }

    return {
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data()?.createdAt?.toDate(),
      lastUpdated: doc.data()?.lastUpdated?.toDate(),
    } as SupplyItem
  }

  async create(userId: string, data: Omit<SupplyItem, 'id' | 'userId' | 'createdAt' | 'lastUpdated' | 'daysRemaining'>): Promise<SupplyItem> {
    const daysRemaining = data.dailyConsumption > 0
      ? Math.floor(data.quantity / data.dailyConsumption)
      : 999

    const itemData = {
      ...data,
      userId,
      daysRemaining,
      createdAt: new Date(),
      lastUpdated: new Date(),
    }

    const docRef = await db.collection(COLLECTION).add(itemData)
    const doc = await docRef.get()

    return {
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data()?.createdAt?.toDate(),
      lastUpdated: doc.data()?.lastUpdated?.toDate(),
    } as SupplyItem
  }

  async update(id: string, userId: string, updates: Partial<SupplyItem>): Promise<SupplyItem | null> {
    const docRef = db.collection(COLLECTION).doc(id)
    const doc = await docRef.get()

    if (!doc.exists || doc.data()?.userId !== userId) {
      return null
    }

    // Recalculate days remaining if quantity or dailyConsumption changed
    const currentData = doc.data()
    const quantity = updates.quantity ?? currentData?.quantity
    const dailyConsumption = updates.dailyConsumption ?? currentData?.dailyConsumption

    const daysRemaining = dailyConsumption > 0
      ? Math.floor(quantity / dailyConsumption)
      : 999

    await docRef.update({
      ...updates,
      daysRemaining,
      lastUpdated: new Date(),
    })

    const updated = await docRef.get()
    return {
      id: updated.id,
      ...updated.data(),
      createdAt: updated.data()?.createdAt?.toDate(),
      lastUpdated: updated.data()?.lastUpdated?.toDate(),
    } as SupplyItem
  }

  async delete(id: string, userId: string): Promise<boolean> {
    const doc = await db.collection(COLLECTION).doc(id).get()

    if (!doc.exists || doc.data()?.userId !== userId) {
      return false
    }

    await db.collection(COLLECTION).doc(id).delete()
    return true
  }

  async getLowStockItems(userId: string): Promise<SupplyItem[]> {
    const items = await this.getAll(userId)
    return items.filter(item => item.daysRemaining <= item.lowStockThreshold)
  }
}

export const supplyService = new SupplyService()
