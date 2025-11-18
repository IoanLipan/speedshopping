import { db } from '../config/firebase.js'
import type { NecessityItem } from '../types/index.js'

const COLLECTION = 'necessityItems'

export class NecessityService {
  async getAll(userId: string): Promise<NecessityItem[]> {
    const snapshot = await db
      .collection(COLLECTION)
      .where('userId', '==', userId)
      .get()

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      completedAt: doc.data().completedAt?.toDate(),
    })) as NecessityItem[]
  }

  async getById(id: string, userId: string): Promise<NecessityItem | null> {
    const doc = await db.collection(COLLECTION).doc(id).get()

    if (!doc.exists || doc.data()?.userId !== userId) {
      return null
    }

    return {
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data()?.createdAt?.toDate(),
      completedAt: doc.data()?.completedAt?.toDate(),
    } as NecessityItem
  }

  async create(userId: string, data: Omit<NecessityItem, 'id' | 'userId' | 'createdAt' | 'completed'>): Promise<NecessityItem> {
    const itemData = {
      ...data,
      userId,
      completed: false,
      createdAt: new Date(),
    }

    const docRef = await db.collection(COLLECTION).add(itemData)
    const doc = await docRef.get()

    return {
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data()?.createdAt?.toDate(),
      completedAt: doc.data()?.completedAt?.toDate(),
    } as NecessityItem
  }

  async update(id: string, userId: string, updates: Partial<NecessityItem>): Promise<NecessityItem | null> {
    const docRef = db.collection(COLLECTION).doc(id)
    const doc = await docRef.get()

    if (!doc.exists || doc.data()?.userId !== userId) {
      return null
    }

    await docRef.update(updates)

    const updated = await docRef.get()
    return {
      id: updated.id,
      ...updated.data(),
      createdAt: updated.data()?.createdAt?.toDate(),
      completedAt: updated.data()?.completedAt?.toDate(),
    } as NecessityItem
  }

  async delete(id: string, userId: string): Promise<boolean> {
    const doc = await db.collection(COLLECTION).doc(id).get()

    if (!doc.exists || doc.data()?.userId !== userId) {
      return false
    }

    await db.collection(COLLECTION).doc(id).delete()
    return true
  }
}

export const necessityService = new NecessityService()
