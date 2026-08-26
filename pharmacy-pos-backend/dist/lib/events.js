import { EventEmitter } from 'events';
class AppEventBus extends EventEmitter {
    emitSaleCompleted(payload) {
        return this.emit('SALE_COMPLETED', payload);
    }
    onSaleCompleted(listener) {
        return this.on('SALE_COMPLETED', listener);
    }
    emitSystemAlert(payload) {
        return this.emit('SYSTEM_ALERT', payload);
    }
    onSystemAlert(listener) {
        return this.on('SYSTEM_ALERT', listener);
    }
}
export const eventBus = new AppEventBus();
//# sourceMappingURL=events.js.map