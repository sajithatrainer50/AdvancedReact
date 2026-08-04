import { useSyncExternalStore } from 'react';
import { tellerQueueStore, subscribeOnlineStatus, getOnlineStatusSnapshot } from '../lib/queueStore';

// Reading live data from a source that lives outside React's own state

function BranchQueueWidget() {
  const queueLength = useSyncExternalStore(tellerQueueStore.subscribe, tellerQueueStore.getSnapshot);

  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">Merrion Row Branch — Teller Queue</h5>
        <p className="display-6 mb-0">{queueLength}</p>
        <small className="text-muted">customers waiting</small>
      </div>
    </div>
  );
}

function ConnectionWidget() {
  const isOnline = useSyncExternalStore(subscribeOnlineStatus, getOnlineStatusSnapshot, () => true);

  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">NorthBridge Gateway</h5>
        <span className={`badge ${isOnline ? 'bg-success' : 'bg-danger'}`}>
          {isOnline ? 'Connected' : 'Offline'}
        </span>
      </div>
    </div>
  );
}

export default function SyncExternalStoreDemo() {
  return (
    <div className="container py-4">
      <h3 className="mb-3">Branch Operations Dashboard</h3>
      <div className="row g-3">
        <div className="col-md-6">
          <BranchQueueWidget />
        </div>
        <div className="col-md-6">
          <ConnectionWidget />
        </div>
      </div>
    </div>
  );
}
