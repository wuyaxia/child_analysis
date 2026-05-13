import { db } from './firebase';
import { 
  collection, 
  addDoc, 
  setDoc, 
  doc, 
  getDocs, 
  query, 
  where, 
  serverTimestamp,
  writeBatch
} from 'firebase/firestore';
import { useAuthStore } from '../store/useAuthStore';
import { useChildrenStore } from '../store/useChildrenStore';
import { useAppStore } from '../store/useAppStore';

interface MigrationResult {
  success: boolean;
  migrated: number;
  failed: number;
  errors: string[];
}

class DataMigration {
  private getFamilyId(): string | null {
    return useAuthStore.getState().family?.id || null;
  }

  private getChildId(): string | null {
    return useChildrenStore.getState().currentChild?.id || null;
  }

  private getMemberId(): string | null {
    return useAuthStore.getState().currentMember?.id || null;
  }

  async migrateGrowthRecords(): Promise<MigrationResult> {
    const familyId = this.getFamilyId();
    const childId = this.getChildId();
    const memberId = this.getMemberId();
    
    if (!familyId || !childId || !memberId) {
      return { success: false, migrated: 0, failed: 0, errors: ['未登录或未选择孩子'] };
    }

    const localRecords = useAppStore.getState().growthRecords;
    const result: MigrationResult = { success: true, migrated: 0, failed: 0, errors: [] };

    try {
      const batch = writeBatch(db);
      
      for (const record of localRecords) {
        const docRef = doc(collection(db, 'families', familyId, 'children', childId, 'growthRecords'));
        batch.set(docRef, {
          ...record,
          createdBy: memberId,
          createdAt: record.createdAt,
          updatedAt: new Date().toISOString()
        });
      }
      
      await batch.commit();
      result.migrated = localRecords.length;
    } catch (error: any) {
      result.success = false;
      result.failed = localRecords.length;
      result.errors.push(error.message);
    }

    return result;
  }

  async migrateTasks(): Promise<MigrationResult> {
    const familyId = this.getFamilyId();
    const childId = this.getChildId();
    const memberId = this.getMemberId();
    
    if (!familyId || !childId || !memberId) {
      return { success: false, migrated: 0, failed: 0, errors: ['未登录或未选择孩子'] };
    }

    const localTasks = useAppStore.getState().tasks;
    const result: MigrationResult = { success: true, migrated: 0, failed: 0, errors: [] };

    try {
      const batch = writeBatch(db);
      
      for (const task of localTasks) {
        const docRef = doc(collection(db, 'families', familyId, 'children', childId, 'tasks'));
        batch.set(docRef, {
          ...task,
          createdBy: memberId,
          createdAt: task.createdAt,
          updatedAt: new Date().toISOString()
        });
      }
      
      await batch.commit();
      result.migrated = localTasks.length;
    } catch (error: any) {
      result.success = false;
      result.failed = localTasks.length;
      result.errors.push(error.message);
    }

    return result;
  }

  async migrateReviews(): Promise<MigrationResult> {
    const familyId = this.getFamilyId();
    const childId = this.getChildId();
    const memberId = this.getMemberId();
    
    if (!familyId || !childId || !memberId) {
      return { success: false, migrated: 0, failed: 0, errors: ['未登录或未选择孩子'] };
    }

    const localReviews = useAppStore.getState().reviews;
    const result: MigrationResult = { success: true, migrated: 0, failed: 0, errors: [] };

    try {
      const batch = writeBatch(db);
      
      for (const review of localReviews) {
        const docRef = doc(collection(db, 'families', familyId, 'children', childId, 'reviews'));
        batch.set(docRef, {
          ...review,
          createdBy: memberId,
          createdAt: review.createdAt,
          updatedAt: new Date().toISOString()
        });
      }
      
      await batch.commit();
      result.migrated = localReviews.length;
    } catch (error: any) {
      result.success = false;
      result.failed = localReviews.length;
      result.errors.push(error.message);
    }

    return result;
  }

  async migrateMeasurements(): Promise<MigrationResult> {
    const familyId = this.getFamilyId();
    const childId = this.getChildId();
    const memberId = this.getMemberId();
    
    if (!familyId || !childId || !memberId) {
      return { success: false, migrated: 0, failed: 0, errors: ['未登录或未选择孩子'] };
    }

    const localMeasurements = useAppStore.getState().growthMeasurements;
    const result: MigrationResult = { success: true, migrated: 0, failed: 0, errors: [] };

    try {
      const batch = writeBatch(db);
      
      for (const measurement of localMeasurements) {
        const docRef = doc(collection(db, 'families', familyId, 'children', childId, 'measurements'));
        batch.set(docRef, {
          ...measurement,
          createdBy: memberId,
          createdAt: measurement.createdAt
        });
      }
      
      await batch.commit();
      result.migrated = localMeasurements.length;
    } catch (error: any) {
      result.success = false;
      result.failed = localMeasurements.length;
      result.errors.push(error.message);
    }

    return result;
  }

  async migrateAll(): Promise<{
    growthRecords: MigrationResult;
    tasks: MigrationResult;
    reviews: MigrationResult;
    measurements: MigrationResult;
  }> {
    const results = {
      growthRecords: await this.migrateGrowthRecords(),
      tasks: await this.migrateTasks(),
      reviews: await this.migrateReviews(),
      measurements: await this.migrateMeasurements()
    };

    return results;
  }

  getLocalDataCount() {
    const store = useAppStore.getState();
    return {
      growthRecords: store.growthRecords.length,
      tasks: store.tasks.length,
      reviews: store.reviews.length,
      measurements: store.growthMeasurements.length,
      total: store.growthRecords.length + store.tasks.length + 
             store.reviews.length + store.growthMeasurements.length
    };
  }
}

export const dataMigration = new DataMigration();
export default dataMigration;
