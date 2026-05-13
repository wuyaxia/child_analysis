import { db } from './firebase';
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc,
  query, 
  where, 
  orderBy,
  onSnapshot,
  serverTimestamp,
  writeBatch,
  QuerySnapshot,
  DocumentData
} from 'firebase/firestore';
import { useAuthStore } from '../store/useAuthStore';
import { useChildrenStore } from '../store/useChildrenStore';
import type { 
  GrowthRecord, 
  Task, 
  Review, 
  GrowthMeasurement,
  EmotionRecord,
  Milestone
} from '../types';

class FirestoreDataService {
  private getFamilyId(): string | null {
    return useAuthStore.getState().family?.id || null;
  }

  private getChildId(): string | null {
    return useChildrenStore.getState().currentChild?.id || null;
  }

  private getMemberId(): string | null {
    return useAuthStore.getState().currentMember?.id || null;
  }

  // ==================== 成长记录 ====================
  
  async getGrowthRecords(): Promise<GrowthRecord[]> {
    const familyId = this.getFamilyId();
    const childId = this.getChildId();
    
    if (!familyId || !childId) return [];

    const q = query(
      collection(db, 'families', familyId, 'children', childId, 'growthRecords'),
      orderBy('date', 'desc')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as GrowthRecord[];
  }

  subscribeGrowthRecords(callback: (records: GrowthRecord[]) => void) {
    const familyId = this.getFamilyId();
    const childId = this.getChildId();
    
    if (!familyId || !childId) {
      callback([]);
      return () => {};
    }

    const q = query(
      collection(db, 'families', familyId, 'children', childId, 'growthRecords'),
      orderBy('date', 'desc')
    );

    return onSnapshot(q, (snapshot: QuerySnapshot) => {
      const records = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as GrowthRecord[];
      callback(records);
    });
  }

  async addGrowthRecord(record: Omit<GrowthRecord, 'id' | 'createdAt'>): Promise<string> {
    const familyId = this.getFamilyId();
    const childId = this.getChildId();
    const memberId = this.getMemberId();
    
    if (!familyId || !childId || !memberId) {
      throw new Error('未登录或未选择孩子');
    }

    const docRef = await addDoc(
      collection(db, 'families', familyId, 'children', childId, 'growthRecords'),
      {
        ...record,
        createdBy: memberId,
        createdAt: new Date().toISOString()
      }
    );

    return docRef.id;
  }

  async updateGrowthRecord(id: string, data: Partial<GrowthRecord>) {
    const familyId = this.getFamilyId();
    const childId = this.getChildId();
    
    if (!familyId || !childId) {
      throw new Error('未登录或未选择孩子');
    }

    await updateDoc(
      doc(db, 'families', familyId, 'children', childId, 'growthRecords', id),
      {
        ...data,
        updatedAt: new Date().toISOString()
      }
    );
  }

  async deleteGrowthRecord(id: string) {
    const familyId = this.getFamilyId();
    const childId = this.getChildId();
    
    if (!familyId || !childId) {
      throw new Error('未登录或未选择孩子');
    }

    await deleteDoc(
      doc(db, 'families', familyId, 'children', childId, 'growthRecords', id)
    );
  }

  // ==================== 任务 ====================
  
  async getTasks(): Promise<Task[]> {
    const familyId = this.getFamilyId();
    const childId = this.getChildId();
    
    if (!familyId || !childId) return [];

    const q = query(
      collection(db, 'families', familyId, 'children', childId, 'tasks')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Task[];
  }

  subscribeTasks(callback: (tasks: Task[]) => void) {
    const familyId = this.getFamilyId();
    const childId = this.getChildId();
    
    if (!familyId || !childId) {
      callback([]);
      return () => {};
    }

    const q = query(
      collection(db, 'families', familyId, 'children', childId, 'tasks')
    );

    return onSnapshot(q, (snapshot: QuerySnapshot) => {
      const tasks = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Task[];
      callback(tasks);
    });
  }

  async addTask(task: Omit<Task, 'id' | 'createdAt'>): Promise<string> {
    const familyId = this.getFamilyId();
    const childId = this.getChildId();
    const memberId = this.getMemberId();
    
    if (!familyId || !childId || !memberId) {
      throw new Error('未登录或未选择孩子');
    }

    const docRef = await addDoc(
      collection(db, 'families', familyId, 'children', childId, 'tasks'),
      {
        ...task,
        createdBy: memberId,
        createdAt: new Date().toISOString()
      }
    );

    return docRef.id;
  }

  async updateTask(id: string, data: Partial<Task>) {
    const familyId = this.getFamilyId();
    const childId = this.getChildId();
    
    if (!familyId || !childId) {
      throw new Error('未登录或未选择孩子');
    }

    await updateDoc(
      doc(db, 'families', familyId, 'children', childId, 'tasks', id),
      {
        ...data,
        updatedAt: new Date().toISOString()
      }
    );
  }

  async deleteTask(id: string) {
    const familyId = this.getFamilyId();
    const childId = this.getChildId();
    
    if (!familyId || !childId) {
      throw new Error('未登录或未选择孩子');
    }

    await deleteDoc(
      doc(db, 'families', familyId, 'children', childId, 'tasks', id)
    );
  }

  async toggleTaskComplete(taskId: string, date: string) {
    const familyId = this.getFamilyId();
    const childId = this.getChildId();
    
    if (!familyId || !childId) {
      throw new Error('未登录或未选择孩子');
    }

    const taskDoc = await getDoc(
      doc(db, 'families', familyId, 'children', childId, 'tasks', taskId)
    );
    
    if (!taskDoc.exists()) return;

    const taskData = taskDoc.data() as Task;
    const completedDates = taskData.completedDates || [];
    const hasDate = completedDates.includes(date);

    await updateDoc(
      doc(db, 'families', familyId, 'children', childId, 'tasks', taskId),
      {
        completedDates: hasDate
          ? completedDates.filter(d => d !== date)
          : [...completedDates, date],
        updatedAt: new Date().toISOString()
      }
    );
  }

  // ==================== 阶段复盘 ====================
  
  async getReviews(): Promise<Review[]> {
    const familyId = this.getFamilyId();
    const childId = this.getChildId();
    
    if (!familyId || !childId) return [];

    const q = query(
      collection(db, 'families', familyId, 'children', childId, 'reviews'),
      orderBy('date', 'desc')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Review[];
  }

  subscribeReviews(callback: (reviews: Review[]) => void) {
    const familyId = this.getFamilyId();
    const childId = this.getChildId();
    
    if (!familyId || !childId) {
      callback([]);
      return () => {};
    }

    const q = query(
      collection(db, 'families', familyId, 'children', childId, 'reviews'),
      orderBy('date', 'desc')
    );

    return onSnapshot(q, (snapshot: QuerySnapshot) => {
      const reviews = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Review[];
      callback(reviews);
    });
  }

  async addReview(review: Omit<Review, 'id' | 'createdAt'>): Promise<string> {
    const familyId = this.getFamilyId();
    const childId = this.getChildId();
    const memberId = this.getMemberId();
    
    if (!familyId || !childId || !memberId) {
      throw new Error('未登录或未选择孩子');
    }

    const docRef = await addDoc(
      collection(db, 'families', familyId, 'children', childId, 'reviews'),
      {
        ...review,
        createdBy: memberId,
        createdAt: new Date().toISOString()
      }
    );

    return docRef.id;
  }

  async updateReview(id: string, data: Partial<Review>) {
    const familyId = this.getFamilyId();
    const childId = this.getChildId();
    
    if (!familyId || !childId) {
      throw new Error('未登录或未选择孩子');
    }

    await updateDoc(
      doc(db, 'families', familyId, 'children', childId, 'reviews', id),
      {
        ...data,
        updatedAt: new Date().toISOString()
      }
    );
  }

  async deleteReview(id: string) {
    const familyId = this.getFamilyId();
    const childId = this.getChildId();
    
    if (!familyId || !childId) {
      throw new Error('未登录或未选择孩子');
    }

    await deleteDoc(
      doc(db, 'families', familyId, 'children', childId, 'reviews', id)
    );
  }

  // ==================== 生长测量 ====================
  
  async getMeasurements(): Promise<GrowthMeasurement[]> {
    const familyId = this.getFamilyId();
    const childId = this.getChildId();
    
    if (!familyId || !childId) return [];

    const q = query(
      collection(db, 'families', familyId, 'children', childId, 'measurements'),
      orderBy('date', 'asc')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as GrowthMeasurement[];
  }

  subscribeMeasurements(callback: (measurements: GrowthMeasurement[]) => void) {
    const familyId = this.getFamilyId();
    const childId = this.getChildId();
    
    if (!familyId || !childId) {
      callback([]);
      return () => {};
    }

    const q = query(
      collection(db, 'families', familyId, 'children', childId, 'measurements'),
      orderBy('date', 'asc')
    );

    return onSnapshot(q, (snapshot: QuerySnapshot) => {
      const measurements = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as GrowthMeasurement[];
      callback(measurements);
    });
  }

  async addMeasurement(measurement: Omit<GrowthMeasurement, 'id' | 'createdAt'>): Promise<string> {
    const familyId = this.getFamilyId();
    const childId = this.getChildId();
    const memberId = this.getMemberId();
    
    if (!familyId || !childId || !memberId) {
      throw new Error('未登录或未选择孩子');
    }

    const docRef = await addDoc(
      collection(db, 'families', familyId, 'children', childId, 'measurements'),
      {
        ...measurement,
        createdBy: memberId,
        createdAt: new Date().toISOString()
      }
    );

    return docRef.id;
  }

  async deleteMeasurement(id: string) {
    const familyId = this.getFamilyId();
    const childId = this.getChildId();
    
    if (!familyId || !childId) {
      throw new Error('未登录或未选择孩子');
    }

    await deleteDoc(
      doc(db, 'families', familyId, 'children', childId, 'measurements', id)
    );
  }
}

export const firestoreDataService = new FirestoreDataService();
export default firestoreDataService;
