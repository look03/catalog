import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('sync_meta')
export class SyncMeta {
  @PrimaryColumn()
  entityName: string;

  @Column({ type: 'timestamptz' })
  lastSyncAt: Date;
}
